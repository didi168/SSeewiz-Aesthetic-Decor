/**
 * SSEEWIZ AESTHETIC DECOR & DIGITAL ENTERPRISE
 * High-Performance Fast 3D Scrollytelling Engine & Accordion Interactivity
 * Model: HOUSE BLACK - BLACK LIVING SPACE (UID: eb27ce570f634309a0639b27cbf76757)
 */

(function () {
  'use strict';

  // 1. Fast & Snappy Lenis Momentum Scroller (Disabled if user prefers reduced motion)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenis = null;
  if (window.Lenis && !prefersReducedMotion) {
    lenis = new Lenis({
      duration: 0.5, // Fast, responsive flick
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.8,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // =========================================================================
  // 0. LUXURY 3D ARCHITECTURAL PRELOADER ENGINE
  // =========================================================================
  const sitePreloader = document.getElementById('sitePreloader');
  const preloaderBarFill = document.getElementById('preloaderBarFill');
  const preloaderPercentage = document.getElementById('preloaderPercentage');
  const preloaderStatusText = document.getElementById('preloaderStatusText');

  let preloaderProgress = 0;
  let preloaderTargetProgress = 15;
  let is3DModelReady = false;
  let preloaderDismissed = false;

  const statusStages = [
    { threshold: 25, text: 'Curating 3D Space...' },
    { threshold: 55, text: 'Loading Architecture Assets...' },
    { threshold: 82, text: 'Calibrating House Black Sanctuary...' },
    { threshold: 99, text: 'Finalizing Real-Time Shaders...' },
    { threshold: 100, text: '3D Living Space Ready' }
  ];

  function updatePreloaderStatus(val) {
    if (!preloaderStatusText) return;
    for (let i = 0; i < statusStages.length; i++) {
      if (val <= statusStages[i].threshold) {
        preloaderStatusText.textContent = statusStages[i].text;
        break;
      }
    }
  }

  function dismissPreloader() {
    if (preloaderDismissed || !sitePreloader) return;
    preloaderDismissed = true;

    if (preloaderBarFill) preloaderBarFill.style.width = '100%';
    if (preloaderPercentage) preloaderPercentage.textContent = '100%';
    if (preloaderStatusText) preloaderStatusText.textContent = '3D Living Space Ready';

    setTimeout(() => {
      sitePreloader.classList.add('preloader-hidden');
      setTimeout(() => {
        sitePreloader.style.display = 'none';
      }, 700);
    }, 380);
  }

  // Smooth ticker for realistic progress interpolation
  const preloaderInterval = setInterval(() => {
    if (preloaderDismissed) {
      clearInterval(preloaderInterval);
      return;
    }

    if (!is3DModelReady) {
      // Gradually increment target progress up to 90%
      if (preloaderTargetProgress < 35) {
        preloaderTargetProgress += 2.2;
      } else if (preloaderTargetProgress < 68) {
        preloaderTargetProgress += 1.4;
      } else if (preloaderTargetProgress < 90) {
        preloaderTargetProgress += 0.6;
      }
    } else {
      preloaderTargetProgress = 100;
    }

    // Ease current progress towards target
    if (preloaderProgress < preloaderTargetProgress) {
      const step = Math.max(0.6, (preloaderTargetProgress - preloaderProgress) * 0.16);
      preloaderProgress = Math.min(preloaderTargetProgress, preloaderProgress + step);
    }

    const displayVal = Math.round(preloaderProgress);
    if (preloaderBarFill) preloaderBarFill.style.width = `${displayVal}%`;
    if (preloaderPercentage) preloaderPercentage.textContent = `${displayVal}%`;
    updatePreloaderStatus(displayVal);

    if (is3DModelReady && displayVal >= 100) {
      clearInterval(preloaderInterval);
      dismissPreloader();
    }
  }, 35);

  function signal3DReady() {
    if (is3DModelReady) return;
    is3DModelReady = true;
    preloaderTargetProgress = 100;
  }

  // Safety fallback: Never trap users if WebGL or network is slow
  const PRELOADER_SAFETY_TIMEOUT_MS = 8000;
  setTimeout(() => {
    if (!preloaderDismissed) {
      console.warn('[SSeewiz 3D] Safety timeout reached, dismissing preloader');
      signal3DReady();
    }
  }, PRELOADER_SAFETY_TIMEOUT_MS);

  window.addEventListener('load', () => {
    if (!window.Sketchfab) {
      setTimeout(signal3DReady, 1200);
    }
  });

  // 2. DOM Elements
  const MODEL_UID = 'eb27ce570f634309a0639b27cbf76757';
  const iframe = document.getElementById('sketchfab-viewport');
  const heroTrack = document.getElementById('heroTrack');
  const progressFill = document.getElementById('progressFill');
  const chapters = document.querySelectorAll('.story-chapter');
  const navDots = document.querySelectorAll('.ch-dot');

  const recenterCamBtn = document.getElementById('recenterCamBtn');

  let sketchfabApi = null;
  let isApiReady = false;

  // Camera Waypoints calibrated for HOUSE BLACK living room (strictly interior)
  let waypoints = [
    {
      eye: [-2.8, -3.8, 1.6],
      target: [0.0, 0.0, 0.9]
    },
    {
      eye: [-1.3, -1.8, 1.1],
      target: [0.0, -0.1, 0.8]
    },
    {
      eye: [0.9, -1.9, 1.2],
      target: [-0.4, 0.2, 0.9]
    }
  ];

  // GSAP Virtual Camera Proxy
  const camState = {
    eyeX: waypoints[0].eye[0],
    eyeY: waypoints[0].eye[1],
    eyeZ: waypoints[0].eye[2],
    targetX: waypoints[0].target[0],
    targetY: waypoints[0].target[1],
    targetZ: waypoints[0].target[2]
  };

  let lastSentState = {
    eyeX: null,
    eyeY: null,
    eyeZ: null,
    targetX: null,
    targetY: null,
    targetZ: null
  };

  // 3. Sketchfab Client Initialization
  if (iframe && window.Sketchfab) {
    const client = new Sketchfab(iframe);

    client.init(MODEL_UID, {
      success: function onSuccess(api) {
        sketchfabApi = api;
        api.start();

        api.addEventListener('viewerready', function () {
          console.log('[SSeewiz 3D] Sketchfab viewer ready');
          isApiReady = true;
          signal3DReady();

          // Calibrate baseline relative to model's native camera bounds
          api.getCameraLookAt(function (err, camera) {
            if (!err && camera && camera.position && camera.target) {
              const bx = camera.position[0];
              const by = camera.position[1];
              const bz = camera.position[2];
              const tx = camera.target[0];
              const ty = camera.target[1];
              const tz = camera.target[2];

              // Direction vector from center target to initial camera position
              const dx = bx - tx;
              const dy = by - ty;
              const dz = bz - tz;

              // Waypoint 0 (0% - 28% scroll): Wide interior living room overview
              waypoints[0] = { 
                eye: [bx, by, bz], 
                target: [tx, ty, tz] 
              };

              // Waypoint 1 (30% - 65% scroll): Glides forward into the room center
              // Positions camera halfway between entrance and leather sofa/table, seated level
              waypoints[1] = { 
                eye: [tx + dx * 0.45, ty + dy * 0.45, tz + dz * 0.52], 
                target: [tx, ty, tz - 0.08] 
              };

              // Waypoint 2 (68% - 100% scroll): Lateral interior sweep to side timber wall & lighting
              // Rotates ~32 degrees horizontally inside the room, strictly bounded within room radius
              const cos32 = 0.848;
              const sin32 = 0.530;
              const rdx = (dx * cos32 - dy * sin32) * 0.52;
              const rdy = (dx * sin32 + dy * cos32) * 0.52;

              waypoints[2] = { 
                eye: [tx + rdx, ty + rdy, tz + dz * 0.62], 
                target: [tx - rdx * 0.28, ty - rdy * 0.28, tz + 0.12] 
              };

              camState.eyeX = waypoints[0].eye[0];
              camState.eyeY = waypoints[0].eye[1];
              camState.eyeZ = waypoints[0].eye[2];
              camState.targetX = waypoints[0].target[0];
              camState.targetY = waypoints[0].target[1];
              camState.targetZ = waypoints[0].target[2];

              setupScrollTimeline();
            } else {
              setupScrollTimeline();
            }
          });
        });
      },
      error: function onError() {
        console.error('[SSeewiz 3D] Sketchfab Viewer init failed');
      },
      transparent: 1,
      ui_theme: 'dark',
      ui_watermark: 0,
      ui_infos: 0,
      ui_controls: 0,
      ui_stop: 0,
      ui_inspector: 0,
      ui_settings: 0,
      ui_vr: 0,
      ui_fullscreen: 0,
      ui_animations: 0,
      ui_hint: 0,
      autostart: 1,
      preload: 1,
      camera: 0
    });
  }

  // 4. GSAP Timeline with Instantaneous Scrubbing (scrub: 0.15)
  let masterTimeline = null;

  function setupScrollTimeline() {
    if (!heroTrack || !window.gsap || !window.ScrollTrigger) return;

    if (masterTimeline) {
      masterTimeline.kill();
    }

    gsap.registerPlugin(ScrollTrigger);

    masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#heroTrack',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.15, // Fast, direct tracking with micro-smoothing
        onUpdate: (self) => {
          const progress = self.progress;

          // Update Progress Fill
          if (progressFill) {
            progressFill.style.width = `${progress * 100}%`;
          }

          // Snappy Chapter Switch: Instant pop into view
          let activeIdx = 0;
          if (progress >= 0.28 && progress < 0.65) {
            activeIdx = 1;
          } else if (progress >= 0.65) {
            activeIdx = 2;
          }

          chapters.forEach((ch, idx) => {
            ch.classList.toggle('active', idx === activeIdx);
          });

          navDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === activeIdx);
          });
        }
      }
    });

    // Animate camera proxy from Waypoint 0 -> Waypoint 1 -> Waypoint 2
    masterTimeline.to(camState, {
      eyeX: waypoints[1].eye[0],
      eyeY: waypoints[1].eye[1],
      eyeZ: waypoints[1].eye[2],
      targetX: waypoints[1].target[0],
      targetY: waypoints[1].target[1],
      targetZ: waypoints[1].target[2],
      ease: 'power1.inOut',
      duration: 1
    });

    masterTimeline.to(camState, {
      eyeX: waypoints[2].eye[0],
      eyeY: waypoints[2].eye[1],
      eyeZ: waypoints[2].eye[2],
      targetX: waypoints[2].target[0],
      targetY: waypoints[2].target[1],
      targetZ: waypoints[2].target[2],
      ease: 'power1.inOut',
      duration: 1
    });
  }

  // 5. Uncapped High-Framerate Camera Dispatcher (60Hz / 120Hz Displays)
  let isCamUpdatePending = false;
  let nextCamUpdate = null;

  function dispatchCamera() {
    if (!isApiReady || !sketchfabApi || isCamUpdatePending || !nextCamUpdate) return;

    const { eye, target } = nextCamUpdate;
    nextCamUpdate = null;
    isCamUpdatePending = true;

    sketchfabApi.setCameraLookAt(eye, target, 0, function (err) {
      isCamUpdatePending = false;
      if (nextCamUpdate) {
        dispatchCamera();
      }
    });
  }

  if (window.gsap) {
    gsap.ticker.add(() => {
      if (!isApiReady || !sketchfabApi) return;

      const eye = [camState.eyeX, camState.eyeY, camState.eyeZ];
      const target = [camState.targetX, camState.targetY, camState.targetZ];

      const dEye = Math.hypot(
        eye[0] - (lastSentState.eyeX ?? 999),
        eye[1] - (lastSentState.eyeY ?? 999),
        eye[2] - (lastSentState.eyeZ ?? 999)
      );

      const dTarget = Math.hypot(
        target[0] - (lastSentState.targetX ?? 999),
        target[1] - (lastSentState.targetY ?? 999),
        target[2] - (lastSentState.targetZ ?? 999)
      );

      // Only dispatch when position moved past threshold
      if (dEye > 0.002 || dTarget > 0.002) {
        lastSentState.eyeX = eye[0];
        lastSentState.eyeY = eye[1];
        lastSentState.eyeZ = eye[2];
        lastSentState.targetX = target[0];
        lastSentState.targetY = target[1];
        lastSentState.targetZ = target[2];

        nextCamUpdate = { eye, target };
        dispatchCamera();
      }
    });
  }

  // 6. Navigation and UI Interactions
  navDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.getAttribute('data-target'), 10);
      let targetProgress = 0;
      if (targetIdx === 1) targetProgress = 0.45;
      if (targetIdx === 2) targetProgress = 0.85;

      const maxScroll = heroTrack.offsetHeight - window.innerHeight;
      const targetScrollY = heroTrack.offsetTop + (targetProgress * maxScroll);

      if (lenis) {
        lenis.scrollTo(targetScrollY, { duration: 0.6 });
      } else {
        window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
      }
    });
  });

  // Recenter Camera Button
  if (recenterCamBtn && heroTrack) {
    recenterCamBtn.addEventListener('click', () => {
      if (lenis) {
        lenis.scrollTo(heroTrack.offsetTop, { duration: 0.5 });
      } else {
        window.scrollTo({ top: heroTrack.offsetTop, behavior: 'smooth' });
      }
    });
  }

  // 7. Interactive Accordion for "The 3 E's Framework"
  const recCards = document.querySelectorAll('.rec-card');
  function toggleRecCard(card) {
    recCards.forEach(c => {
      if (c !== card) {
        c.classList.remove('active');
        c.setAttribute('aria-expanded', 'false');
        const arrow = c.querySelector('.rec-arrow');
        if (arrow) arrow.innerHTML = '&rarr;';
      }
    });

    const isNowActive = card.classList.toggle('active');
    card.setAttribute('aria-expanded', isNowActive ? 'true' : 'false');
    const arrow = card.querySelector('.rec-arrow');
    if (arrow) {
      arrow.innerHTML = isNowActive ? '&darr;' : '&rarr;';
    }
  }

  recCards.forEach(card => {
    card.addEventListener('click', () => toggleRecCard(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleRecCard(card);
      }
    });
  });

  // 8. Smooth In-Page Anchor Navigation for Menu Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(targetElement, { duration: 0.8 });
          } else {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }
    });
  });

  // 9. Active Nav Item Spy on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 160;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navItems.forEach(item => {
        const href = item.getAttribute('href');
        item.classList.toggle('active', href === `#${currentId}`);
      });
    }
  }, { passive: true });

  // 10. Interactive Portfolio Filter Tabs
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const serviceCards = document.querySelectorAll('.service-showcase-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');
      
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (category === 'all' || cardCategory === category) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // 11. Quick Service Pre-Selector from Portfolio into Contact Form
  document.querySelectorAll('.btn-spec-request').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceVal = btn.getAttribute('data-service');
      const selectElem = document.getElementById('projectType');
      if (selectElem && serviceVal) {
        selectElem.value = serviceVal;
      }
    });
  });

  // 12. Interactive Budget Tier Selector
  const budgetPills = document.querySelectorAll('.budget-pill');
  const budgetInput = document.getElementById('selectedBudget');

  budgetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      budgetPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-checked', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-checked', 'true');
      if (budgetInput) {
        budgetInput.value = pill.getAttribute('data-budget');
      }
    });
  });

  // 13. Material Swatches Interactive Preview (Click & Keyboard Navigation)
  const swatchItems = document.querySelectorAll('.swatch-item');
  const swatchDetailTitle = document.getElementById('swatchDetailTitle');
  const swatchDetailDesc = document.getElementById('swatchDetailDesc');
  const swatchDetailSpec = document.getElementById('swatchDetailSpec');

  function activateSwatch(item) {
    swatchItems.forEach(s => s.classList.remove('active'));
    item.classList.add('active');

    if (swatchDetailTitle) swatchDetailTitle.textContent = item.getAttribute('data-title');
    if (swatchDetailDesc) swatchDetailDesc.textContent = item.getAttribute('data-desc');
    if (swatchDetailSpec) swatchDetailSpec.textContent = item.getAttribute('data-spec');
  }

  swatchItems.forEach(item => {
    item.addEventListener('click', () => activateSwatch(item));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateSwatch(item);
      }
    });
  });

  // 14. Accessible Mobile Navigation Drawer Controller
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const mobileDrawerBackdrop = document.getElementById('mobileDrawerBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-drawer-cta');

  function openMobileNav() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileToggle) {
      mobileToggle.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
    }
    document.body.classList.add('nav-open');
    if (mobileDrawerClose) {
      setTimeout(() => mobileDrawerClose.focus(), 50);
    }
  }

  function closeMobileNav() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileToggle) {
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.focus();
    }
    document.body.classList.remove('nav-open');
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (mobileDrawerClose) {
    mobileDrawerClose.addEventListener('click', closeMobileNav);
  }

  if (mobileDrawerBackdrop) {
    mobileDrawerBackdrop.addEventListener('click', closeMobileNav);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileNav();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
      closeMobileNav();
    }
  });

})();
