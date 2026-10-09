const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.join(__dirname, 'screenshots_after');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { width: 320, height: 568, name: "320_iphone5_portrait" },
  { width: 360, height: 640, name: "360_android_portrait" },
  { width: 375, height: 812, name: "375_iphoneX_portrait" },
  { width: 390, height: 844, name: "390_iphone14_portrait" },
  { width: 414, height: 896, name: "414_iphonePlus_portrait" },
  { width: 480, height: 800, name: "480_mobile_wide" },
  { width: 568, height: 320, name: "568x320_mobile_landscape" },
  { width: 667, height: 375, name: "667x375_mobile_landscape" },
  { width: 600, height: 960, name: "600_small_tablet" },
  { width: 768, height: 1024, name: "768_tablet_portrait" },
  { width: 820, height: 1180, name: "820_ipad_air" },
  { width: 1024, height: 768, name: "1024_tablet_landscape" },
  { width: 1280, height: 800, name: "1280_desktop" },
  { width: 1366, height: 768, name: "1366_desktop" },
  { width: 1440, height: 900, name: "1440_desktop" },
  { width: 1536, height: 864, name: "1536_desktop" },
  { width: 1920, height: 1080, name: "1920_fhd_desktop" },
  { width: 2560, height: 1440, name: "2560_qhd_ultrawide" },
  { width: 3440, height: 1440, name: "3440_ultrawide" },
  { width: 3840, height: 2160, name: "3840_4k" },
  { width: 5120, height: 1440, name: "5120_super_ultrawide" }
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { resolve, reject } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) {
            reject(msg.error);
          } else {
            resolve(msg.result);
          }
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

async function run() {
  console.log("Starting Chrome Headless with Remote Debugging...");
  const chromeProcess = spawn(CHROME_PATH, [
    "--headless=new",
    "--remote-debugging-port=9222",
    "--disable-gpu",
    "--hide-scrollbars",
    "about:blank"
  ]);

  await sleep(1500);

  let versionInfo;
  for (let i = 0; i < 10; i++) {
    try {
      versionInfo = await getJson("http://localhost:9222/json/version");
      if (versionInfo) break;
    } catch (e) {
      await sleep(500);
    }
  }

  if (!versionInfo) {
    console.error("Failed to connect to Chrome remote debugging port.");
    chromeProcess.kill();
    process.exit(1);
  }

  const targets = await getJson("http://localhost:9222/json/list");
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  console.log("Target page found:", pageTarget.id);

  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.connect();
  console.log("Connected to CDP!");

  await client.send("Page.enable");
  await client.send("DOM.enable");
  await client.send("Runtime.enable");

  console.log("Navigating to http://localhost:4321/ ...");
  await client.send("Page.navigate", { url: "http://localhost:4321/" });
  await sleep(2000);

  const auditResults = [];

  for (const vp of VIEWPORTS) {
    // Set device metrics
    await client.send("Emulation.setDeviceMetricsOverride", {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width <= 768
    });

    await sleep(200);

    // Evaluate scrollWidth and check for overflow
    const evalRes = await client.send("Runtime.evaluate", {
      expression: `
        (() => {
          const doc = document.documentElement;
          const body = document.body;
          const winWidth = window.innerWidth;
          const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
          const hasHorizontalOverflow = scrollWidth > winWidth;
          
          // Check overflowing elements
          const overflowing = [];
          document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > winWidth + 1) {
              overflowing.push({
                tag: el.tagName,
                class: el.className,
                id: el.id,
                right: Math.round(rect.right),
                excess: Math.round(rect.right - winWidth)
              });
            }
          });

          // Check input font size
          const firstInput = document.querySelector('input[type="text"], input[type="email"]');
          const inputFontSize = firstInput ? window.getComputedStyle(firstInput).fontSize : null;

          // Check mobile toggle visibility
          const toggle = document.getElementById('mobileMenuToggle');
          const toggleDisplay = toggle ? window.getComputedStyle(toggle).display : null;

          return {
            winWidth,
            scrollWidth,
            hasHorizontalOverflow,
            overflowCount: overflowing.length,
            sampleOverflow: overflowing.slice(0, 3),
            inputFontSize,
            toggleDisplay
          };
        })()
      `,
      returnByValue: true
    });

    if (!evalRes || !evalRes.result || !evalRes.result.value) {
      console.error("evalRes error:", JSON.stringify(evalRes));
    }
    const metrics = (evalRes && evalRes.result && evalRes.result.value) || {};
    const passed = !metrics.hasHorizontalOverflow;

    // Screenshot
    const screenshotRes = await client.send("Page.captureScreenshot", { format: "png" });
    const imgPath = path.join(OUTPUT_DIR, `${vp.name}.png`);
    fs.writeFileSync(imgPath, Buffer.from(screenshotRes.data, 'base64'));

    console.log(`[${passed ? 'PASS' : 'FAIL'}] Viewport ${vp.width}x${vp.height} (${vp.name}): ` +
                `win=${metrics.winWidth}px, scroll=${metrics.scrollWidth}px, ` +
                `overflow=${metrics.overflowCount}, toggle=${metrics.toggleDisplay}, inputFont=${metrics.inputFontSize}`);

    auditResults.push({
      viewport: `${vp.width}x${vp.height}`,
      name: vp.name,
      passed,
      ...metrics,
      screenshot: imgPath
    });
  }

  // Test Mobile Navigation Drawer Open State at 375x812
  console.log("\nTesting Mobile Navigation Drawer interaction at 375px...");
  await client.send("Emulation.setDeviceMetricsOverride", {
    width: 375,
    height: 812,
    deviceScaleFactor: 1,
    mobile: true
  });
  await sleep(200);

  // Click hamburger toggle
  await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const toggle = document.getElementById('mobileMenuToggle');
        if (toggle) toggle.click();
      })()
    `
  });
  await sleep(400);

  const drawerStateRes = await client.send("Runtime.evaluate", {
    expression: `
      (() => {
        const drawer = document.getElementById('mobileNavDrawer');
        const isActive = drawer && drawer.classList.contains('active');
        const ariaHidden = drawer ? drawer.getAttribute('aria-hidden') : null;
        const bodyOpen = document.body.classList.contains('nav-open');
        return { isActive, ariaHidden, bodyOpen };
      })()
    `,
    returnByValue: true
  });

  console.log("Drawer State after click:", drawerStateRes.result.value);

  const drawerScreenshot = await client.send("Page.captureScreenshot", { format: "png" });
  const drawerImgPath = path.join(OUTPUT_DIR, '375_mobile_drawer_open.png');
  fs.writeFileSync(drawerImgPath, Buffer.from(drawerScreenshot.data, 'base64'));
  console.log("Mobile drawer open screenshot saved to:", drawerImgPath);

  client.close();
  chromeProcess.kill();

  const total = auditResults.length;
  const passedCount = auditResults.filter(r => r.passed).length;
  console.log(`\n========================================`);
  console.log(`AUDIT COMPLETE: ${passedCount}/${total} viewports PASSED with ZERO horizontal overflow.`);
  console.log(`========================================\n`);

  fs.writeFileSync(
    path.join(__dirname, 'audit_after_results.json'),
    JSON.stringify(auditResults, null, 2)
  );
}

run().catch(err => {
  console.error("Error during audit run:", err);
  process.exit(1);
});
