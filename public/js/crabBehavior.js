// ---- CRAB LOGIC - CLEAN VERSION ----
let crabLegsAnimations = [];
let crabIsWalking = false;
let crabPinned = false; // whether it's at bottom-right
let crab, speechBF;
const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

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
    { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
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
  gsap.set(crab, { position: "absolute", bottom: 0, left: "50%" }); //bottom: 72.84 check if is for mobile or destok
  startCrabLegs();
  gsap.to(crab, {
    x: 0,
    duration: 1.2,
    ease: "power2.out",
    onComplete: () => {
      stopCrabLegs();
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
        bottom: 0, //check 
        left: "auto",
        right: currentRight,
        // x: 0, //check
        clearProps: "transform"
    });

    startCrabLegs();
    gsap.to(crab, {
        // right: 0, //check
        duration: 0.8, 
        ease: "power2.out",
        onComplete: () => { stopCrabLegs (); crabPinned = true;}
         
    });
}



document.addEventListener("DOMContentLoaded", () => {
  crab = document.querySelector(".crab-container");
  speechBF = document.querySelector(".bubble-container .bf");

  // entrance when the page loads
  entranceCrab();

  // scroll behavior
  attachCrabScrollTrigger();

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
    window.addEventListener("resize", handleResizeForCrab)
});
