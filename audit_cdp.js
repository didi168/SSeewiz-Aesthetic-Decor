const { spawn } = require('child_process');
const http = require('http');

const CHROME_PATH = 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe';

async function auditWidth(width, height) {
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--window-size=${width},${height}`,
    'http://localhost:4321/'
  ]);

  // wait 1.5s for chrome to start
  await new Promise(r => setTimeout(r, 1500));

  try {
    const listRes = await fetch('http://localhost:9222/json');
    const tabs = await listRes.json();
    const wsUrl = tabs[0]?.webSocketDebuggerUrl;
    if (!wsUrl) {
      console.log('No tab found');
      chrome.kill();
      return;
    }

    const ws = new WebSocket(wsUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        const handler = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === msgId) {
            ws.removeEventListener('message', handler);
            resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    // Evaluate overflow script
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const docW = document.documentElement.scrollWidth;
          const winW = window.innerWidth;
          const bodyW = document.body.scrollWidth;
          const overflows = [];
          document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > winW + 1) {
              overflows.push({
                tag: el.tagName,
                id: el.id,
                class: el.className,
                rectRight: Math.round(rect.right),
                rectWidth: Math.round(rect.width)
              });
            }
          });
          return {
            winW,
            docW,
            bodyW,
            hasHorizontalScroll: docW > winW,
            overflowCount: overflows.length,
            sampleOverflows: overflows.slice(0, 8)
          };
        })()
      `,
      returnByValue: true
    });

    console.log(`[Viewport ${width}x${height}]`, JSON.stringify(evalRes.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Error auditing:', err.message);
  } finally {
    chrome.kill();
  }
}

async function run() {
  const widths = [320, 375, 480, 768, 1024, 1440, 2560, 3440, 5120];
  for (const w of widths) {
    await auditWidth(w, 800);
    await new Promise(r => setTimeout(r, 600));
  }
}

run();
