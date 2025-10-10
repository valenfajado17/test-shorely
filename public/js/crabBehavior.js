let crabLegsAnimations = [];
let crabIsWalking = false;
let crabPinned = false; // (desktop only)
let crab, speechBF;
let currentMode = null;

const isMobile = () => window.matchMedia('(max-width: 480px)').matches;

let crabHiddenByFounder = false; // hide crab once it reach the balck-wave
let cachedCrabHeight = 120;

function killCrabTriggers() {
  ScrollTrigger.getAll().forEach( st => {
    const id = st.vars?.id || "";
    if(id.startsWith("crab-") || st.vars?.crab === true) st.kill();
  });
  gsap.killTweensOf(crab);
}

function initCrabMobile() {
  killCrabTriggers();

  crabPinned = false;
  gsap.set(crab, {
    clearProps: "all",
    position: "fixed",
    left: "50%",
    bottom: "14vh",
    x: 0, y:0,
    transform: "translateX(-50%)",
    zIndex: 50, 
    pointerEvents: "auto",
    opacity: 0
  });

  startCrabLegs();
  gsap.to(crab, {
    opacity: 1,
    duration: 0.6,
    ease: "power2.out",
    onComplete: () => {
      stopCrabLegs();
      showCrabSpeech();
    }
  });
  gsap.to(".eye-crab", {
    opacity: 1,
    scale: 1,
    duration: 0.2,
    ease: "black-out(0.6)"
  })
  crab.addEventListener("click", onCrabTapToggleBubble);
}

function initCrabDesktop() {
  killCrabTriggers();

  gsap.set(crab, { 
    clearProps: "all",
    position: "absolute", 
    bottom: 72.84,
    left: "50%",
    x: 0,
    transform: "translateX(-50%)",
    zIndex: 30,
    opacity: 0
  });

  entranceCrab();
  attachCrabScrollTrigger();
  attachCrabFounderSection();
}

function onCrabTapToggleBubble(){
  const cOpacity = gsap.getProperty(".bubble-container .bf", "opacity");
  if ((cOpacity ?? 0) < 0.5) showCrabSpeech();
  else hideCrabSpeech();
}

function initCrabByMode(){
  const next = isMobile() ? "mobile" : "desktop";
  if (next === currentMode) return;

  crab?.removeEventListener?.("click", onCrabTapToggleBubble);

  if (next === "mobile") initCrabMobile();
  else initCrabDesktop();

  currentMode = next;
}

function startCrabLegs() {
  if (crabIsWalking) return;
  crabIsWalking = true;
  const speed = 0.25;
  crabLegsAnimations = [
    gsap.to(".ll-1", { rotate: 15, yoyo: true, repeat: -1, duration: speed, ease: "sine.inOut" }),
    gsap.to(".ll-2", { rotate: -15, yoyo: true, repeat: -1, duration: speed, ease: "sine.inOut", delay: speed/2 }),
    gsap.to(".lr-1", { rotate: -15, yoyo: true, repeat: -1, duration: speed, ease: "sine.inOut" }),
    gsap.to(".lr-2", { rotate: 15, yoyo: true, repeat: -1, duration: speed, ease: "sine.inOut", delay: speed/2 }),
  ];
}

function stopCrabLegs() {
  crabLegsAnimations.forEach(a => a.kill());
  crabLegsAnimations = [];
  crabIsWalking = false;
  gsap.set([".ll-1", ".ll-2", ".lr-1", ".lr-2"], { rotate: 0 });
}

function showCrabSpeech() {
  gsap.fromTo(".bubble-container .bf",
    { opacity: 0, scale: 0.6 },
    { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
  );
}

function hideCrabSpeech() {
    gsap.to(".bubble-container .bf", {
        opacity: 0,
        scale: 0,
        duration: 0.3,
        ease: "back.out(1.7)"
    });
}

function showCrabSpeechBR() {
  gsap.fromTo(".bubble-container .af",
    { opacity: 0, scale: 0.6 },
    { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)", left: "42%" }
  );
}

function hideCrabSpeechBR() {
    gsap.to(".bubble-container .af", {
        opacity: 0,
        scale: 0,
        duration: 0.3,
        ease: "back.out(1.7)"
    });
}

function entranceCrab() {
  const targetCenterX = 0;  

  gsap.set(crab, {x: () => window.innerWidth, opacity: 0});

  const tl = gsap.timeline();
  tl.add(() => startCrabLegs())
    .to(crab, {
      x: targetCenterX,
      opacity: 1,
      duration: 2.4,
      ease: "power2.out"
    })
    .add(() => stopCrabLegs())
    .add(() => { 
        if(isMobile()) {
            hideCrabSpeech();
            pinCrabBottomRight();
            showCrabSpeech();
        } else {
            showCrabSpeech();
        }
    });
}

function moveCrabToBottomRight(onComplete) {
    const margin = 16; 
    const crabWidth = crab.getBoundingClientRect().width || 120;

    const halfViewport = window.innerWidth / 2;
    const xToRight = halfViewport - (crabWidth / 2) - margin;

    gsap.set(crab, { position: "fixed", bottom: 0, left: "50%",});

    hideCrabSpeech();
    startCrabLegs();

    gsap.to(crab, {
        x: xToRight,
        duration: 1.2,
        ease: "power2.out",
        onComplete: () => {
            stopCrabLegs();
            crabPinned = true;
            if (typeof onComplete === "function") onComplete();
        }
    });
}

function moveCrabBackToCenter() {
  gsap.set(crab, { position: "absolute", bottom: 72.84, left: "50%" });  // when desktop
  startCrabLegs();
  gsap.to(crab, {
    x: 0,
    duration: 1.2,
    ease: "power2.out",
    onComplete: () => {
      stopCrabLegs();
      showCrabSpeech();
      crabPinned = false;
    }
  });
}

function attachCrabScrollTrigger() {
    if (isMobile()) return;

    ScrollTrigger.create({
        trigger: ".about-us",
        start: "bottom bottom",
        end: "+=100%",
        onEnter: () => { if (!crabPinned) moveCrabToBottomRight();},
        onLeaveBack: () => { if (crabPinned) moveCrabBackToCenter();}
    });
}

function handleResizeForCrab() {
  if (!crabPinned) return;

  const margin = 16;
  const crabWidth = crab.getBoundingClientRect().width || 120;
  const halfViewport = window.innerWidth / 2;
  const xToRight = halfViewport - (crabWidth / 2) - margin;
  gsap.set(crab, { x: xToRight });
}

function pinCrabBottomRight(){
    const rect = crab.getBoundingClientRect();
    const currentRight = window.innerWidth - (rect.left + rect.width);

    gsap.set(crab, {
        position: "fixed",
        bottom: 0, 
        left: "auto",
        right: currentRight,
        clearProps: "transform"
    });

    startCrabLegs();
    gsap.to(crab, {
        duration: 0.8, 
        ease: "power2.out",
        onComplete: () => { stopCrabLegs (); crabPinned = true;}
         
    });
}

function hideCrabContainer() {
  if (!crab) return;
  if(typeof stopCrabLegs === 'function') stopCrabLegs();
  if(typeof hideCrabSpeech === 'function') hideCrabSpeech();
  if(typeof hideCrabSpeechBR === 'function') hideCrabSpeechBR();

  gsap.killTweensOf(crab);
  crab.style.pointerEvents = 'none';
  gsap.set( crab, { display: 'none', clearProps: 'opacity,visibility' });
}

function showCrabRespectingState() {
  if (!crab) return;
  gsap.set( crab, { display: 'block'});
  crab.style.pointerEvents = 'auto';

  if(crabPinned) {
    gsap.set(crab, { position: 'fixed', bottom: 0, left: '50%'});
    if (typeof handleResizeForCrab === 'function') handleResizeForCrab();
  } else {
    gsap.set(crab, { position: 'absolute', bottom: 72.84, left: '50%', x:0 })
  }

  gsap.set( crab, { autoAlpha: 0 });
  gsap.to( crab, {autoAlpha: 1, duration: 0.22, ease: 'power1.out', overwrite: true})
  
}

function attachCrabFounderSection() {
  crab = crab || document.querySelector('.crab-container');
  const wave = document.querySelector('.wave-black-bg') || document.querySelector('.founder-section');

  if (!crab || !wave) return;

  const HYST = 12; // hysteresis -> avoid flicker

  const evaluateOverload = () => {
    const waveTop = wave.getBoundingClientRect().top;
    const vis = crab.style.display !== 'none';

    if (vis) {
      const crabRect = crab.getBoundingClientRect();
      if (crabRect.height > 0) cachedCrabHeight = crabRect.height;
    }


    const touchY = window.innerHeight - cachedCrabHeight * 0.45;
    const shouldHide = !crabHiddenByFounder && (waveTop <= (touchY - HYST));
    const shouldShow = crabHiddenByFounder && (waveTop > (touchY + HYST));

    if (shouldHide) {
      hideCrabContainer();
      crabHiddenByFounder = true;
    } else if (shouldShow) {
      showCrabRespectingState();
      crabHiddenByFounder = false;
    }
  }; 

  ScrollTrigger.create({
    trigger: wave,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: evaluateOverload,
    onEnter: evaluateOverload,
    onEnterBack: evaluateOverload,
    onLeaveBack: evaluateOverload 
  });
  
  window.addEventListener('resize', () => requestAnimationFrame(evaluateOverload), { passive: true });
  requestAnimationFrame(evaluateOverload);
}

document.addEventListener("DOMContentLoaded", () => {
  crab = document.querySelector(".crab-container");
  speechBF = document.querySelector(".bubble-container .bf");

  if(!crab) return;
  initCrabByMode();
  
  window.addEventListener("resize", () => {
    clearTimeout(window.__crabResizeT);
    window.__crabResizeT = setTimeout(initCrabByMode, 120);
  })
  // entrance when the page loads
  // entranceCrab();

  // scroll behavior
  // attachCrabScrollTrigger();
  // attachCrabFounderSection(); // When enter founder-section hide crab-container


  // Show the bubble when the mouse is over the crab
  crab.addEventListener("mouseenter", () => { if(crabPinned) showCrabSpeechBR(); });
  crab.addEventListener("mouseleave", () => { if(crabPinned) hideCrabSpeechBR(); });

  if (isMobile()) {
    crab.addEventListener("click", () => {
        const vis = Number(gsap.getProperty(".crab-container .af", "opacity")) > 0.5;
        vis ? hideCrabSpeechBR() : showCrabSpeechBR();
    });
  }

  // keep it responsive
//   window.addEventListener("resize", () => {
//     if(isMobile() && crabPinned) { gsap.set(crab, { right: 8, bottom: 8 });}
//   });

// chekc is un-comment
    // window.addEventListener("resize", handleResizeForCrab)
});
