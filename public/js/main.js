window.addEventListener("DOMContentLoaded", () => {
  // About-us Section
  animateAboutUsSection();
  animateSeaCreatures();

  scrollFromHome();

  //Industry Section
  industriesSection();

  // BoatSection
  animateBoatSection();  
  scrollFromBoat();
  // document.addEventListener("DOMContentLoaded", initBoatCarousel);
  // FounderSection
  animateFounderSection();

  // FormSection
  formSectionAnimations();

  

});


function animateAboutUsSection(){
  const tl = gsap.timeline();
  
  tl.to(".logo", {
    duration: 1.2,
    scale: 1,
    opacity: 1,
    ease: "back.out(1.7)"
  })

  .to(".tagline", {
    duration: 1,
    y: -80,
    opacity: 1, 
    ease: "power2.out"
  }, "-=0.6")

  .to(".wave-bg", {
    duration: 1.2,
    y: -100, 
    opacity: 1, 
    ease: "power2.out"
  }, "-=0.8")
}

function animateSeaCreatures(){
  const tl = gsap.timeline({ delay: 2});
  
  tl.to(".creature .normal", {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    stagger: 0.3,
    ease: "back.out(1.7)"
  });

  tl.to(".creature .eye", {
    opacity: 1, 
    scale: 1,
    duration: 0.4, 
    stagger: 0.3, 
    ease: "back.out(1.7)"
  }, "-=1");
  
  eyesFollowCursor();
  squishSeaCreature(); 
}

function squishSeaCreature(){
  document.querySelectorAll('.sea-creatures .creature')
    .forEach(c => {
      const normal = c.querySelector('.normal');
      const squish = c.querySelector('.squish');
      const eyes = c.querySelectorAll('.eye');

      c.addEventListener('click', () => {
        normal.style.display = 'none';
        eyes.forEach(e => e.style.display = 'none');
        squish.style.display = 'block';

        setTimeout(() => {
          squish.style.display = 'none';
          normal.style.display = 'block';
          eyes.forEach(e => e.style.display = 'block');
        }, 400);
      })
    })
}

function scrollFromHome(){
  gsap.registerPlugin(ScrollTrigger);

  // Waves movement 
  gsap.to(".wave-bg", {
    backgroundPositionX: "-50vw",
    ease: "none",
    scrollTrigger: {
      trigger: ".about-us",
      start: "bottom bottom",
      end: "+=100%", 
      scrub: true
    }
  });

  // scrollCrabAnimation();
  
}

function industriesSection(){
  gsap.registerPlugin(ScrollTrigger);

  //Title fades-in as the user scroll 
  gsap.to(".industries-title h1", {
    opacity:  1,
    y: -30,
    scrollTrigger: {
      trigger: ".industries-section", 
      start: "top center",
      end: "center center",
      scrub: true
    }
  }); 

  // Animate each shape
  const shapes = document.querySelectorAll(".industry-shape");

  shapes.forEach(shape => {
    shape.addEventListener("mouseenter", () => {
      shapes.forEach(s => {
        if (s !== shape) {
          s.classList.add("dimmed");
        } else {
          s.classList.add("hovered")
        }
      });
    });

    shape.addEventListener("mouseleave", () => {
      shapes.forEach(s => {
        s.classList.remove("dimmed", "hovered");
      })
    })
  });
}

function animateBoatSection(){
  gsap.registerPlugin(ScrollTrigger);

  gsap.set(".boat-content", {x: '-100vw', opacity: 0});

  gsap.to(".boat-title", {
    opacity:  1,
    duration: 0.8,
    y: -30,
    scrollTrigger: {
      trigger: ".boat-section", 
      start: "top center",
      end: "center center",
      scrub: true
    }
  });
  
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".boat-section",
      start: "top 85%",
      end: "top 60%",
      scrub: false
    }
  });

  //Boat enter floting
  tl.to(".boat-content", {
    x: -330,
    opacity: 1,
    duration: 4.2,
    ease: "power2.out",
    onComplete: () => {initBoatCarousel()}
  }, "-=0.7");
  
  initBoatCarousel();
}

function scrollFromBoat(){
   gsap.registerPlugin(ScrollTrigger);

  // Waves movement 
  gsap.to(".wave-darkblue-bg", {
    backgroundPositionX: "-50vw",
    ease: "none",
    scrollTrigger: {
      trigger: ".boat-section",
      start: "bottom bottom",
      end: "+=100%", 
      scrub: true
    }
  });

  animatePortfolioSection();
}

function animatePortfolioSection(){
  const tl = gsap.timeline();
   
  // Shorely logo scales in 
  tl.to(".portfolio-title", {
    duration: 1.4,
    scale: 1,
    opacity: 1,
    ease: "back.out(1.7)"
  });
  
  domiansCarousel();
}

function domiansCarousel(){
  const marquee = document.getElementById('domain-marquee-inner');
  marquee.innerHTML += marquee.innerHTML; 

  gsap.to(marquee, {
    xPercent: -50,
    repeat: -1,
    ease: "none",
    duration: 10 // más alto = más lento
  });
}


// Eyes follow cursor
function eyesFollowCursor() {
  const eyes = [
    document.querySelector('.left-eye-shell'),
    document.querySelector('.right-eye-shell'),

    document.querySelector('.left-eye-octopus'),
    document.querySelector('.right-eye-octopus'),

    document.querySelector('.left-eye-founder'),
    document.querySelector('.right-eye-founder'),

    document.querySelector('.left-eye-shell-form'),
    document.querySelector('.right-eye-shell-form'),

    document.querySelector('.left-eye-snail-form'),
    document.querySelector('.right-eye-snail-form'),

    document.querySelector('.left-eye-star-form'),
    document.querySelector('.right-eye-star-form'),

    document.querySelector('.left-eye-octopus-form'),
    document.querySelector('.right-eye-octopus-form'),

    document.querySelector('.left-eye-crab'),
    document.querySelector('.right-eye-crab')
  ];

  document.addEventListener("mousemove", e => {
    eyes.forEach(eye => {
      const rect = eye.getBoundingClientRect();
      const eyeX = rect.left + rect.width / 2;
      const eyeY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
      const offset = 5; // Tamaño del movimiento de la pupila
      const x = Math.cos(angle) * offset;
      const y = Math.sin(angle) * offset;
      eye.style.transform = `translate(${x}px, ${y}px)`;
    });
  });
}

// Fade in secuencial con GSAP
function animateFounderSection(){
  gsap.registerPlugin(ScrollTrigger);
  const crab = document.querySelector('.crab-container');

  gsap.to(".founder-title h3", {
    duration: 1.2,
    scale: 1,
    opacity: 1,
    ease: "back.out(1.7)"
  });

  gsap.fromTo('.dialog-founder', {
    opacity: 0,
    scale: 0.7
  },{
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: ".founder-section",
      start: "top 80%",
      end: "top 50%",
      toggleActions: "play none none reverse"
    }
  });

  gsap.fromTo('.dialog-text', {
    opacity: 0,
    scale: 0.7
  },{
    opacity: 1,
    scale: 1,
    duration: 1.2,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: ".founder-section",
      start: "top 80%",
      end: "top 50%",
      toggleActions: "play none none reverse"
    }
  },"-=0.7");


  gsap.fromTo('.silhouette', {
    opacity: 0, y: 60
  },{
    opacity: 1, y: 0,
    duration: 1.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".founder-section",
      start: "top 78%",
      end: "top 55%",
      toggleActions: "play none none reverse"
    }
  });

    // gsap.fromTo(crab, {
    //   opacity: 1, scale: 1
    // }, {
    //   opacity: 0,
    //   scale: 0,
    //   duration: 0.6,
    //   ease: "power1.out"
    // });

  eyesFollowCursor();
}

function formSectionAnimations() {
  eyesFollowCursor();
  seaCreaturesFormSquish();
}

function seaCreaturesFormSquish(){ 
  document.querySelectorAll('.sea-creatures-form .creature')
    .forEach(c => {
      const normal = c.querySelector('.normal');
      const squish = c.querySelector('.squish');
      const eyes = c.querySelectorAll('.eye');

      c.addEventListener('click', () => {
        normal.style.display = 'none';
        eyes.forEach(e => e.style.display = 'none');
        squish.style.display = 'block';

        setTimeout(() => {
          squish.style.display = 'none';
          normal.style.display = 'block';
          eyes.forEach(e => e.style.display = 'block');
        }, 400);
      })
    })
}

function scrollFromFounder(){
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('.wave-black-bg', {
    backgroundPositionX: "-50vw",
    ease: "none",
    scrollTrigger: {
      trigger: ".founder-section",
      start: "buttom buttom",
      end: "+=100%",
      scrub: true
    }
  });
}

function initBoatCarousel(){
  const projects = [
    { name: "swapped.com", url: "https://swapped.com", 
      logo: "../assets/images/boat/companies-logos/swapped-logo.png", 
      desc: "Offers a fast and simple way to buy cryptocurrencies. Buy crypto with 40+ local payment methods.",
      badgeIcon: "", badgeText: "Sofware" },
    { name: "pvp.com", url: "https://pvp.com",
      logo: "../assets/images/boat/companies-logos/pvp-logo.png", 
      desc: "...", badgeIcon: "", badgeText: "Domains" }
  ];

  if(!Array.isArray(projects) || projects.length === 0) return;

  // Load DOM
  const boatContent = document.querySelector(".boat-content");
  if (!boatContent) return;

  const info = boatContent.querySelector(".company-info");
  const logoEl = document.getElementById("logo-company");
  const nameEl = document.getElementById("name-company");
  const descEl = document.getElementById("description-company");

  const prevBtn = document.getElementById("arrow-left");
  const nextBtn = document.getElementById("arrow-right");

  if (!info || !logoEl || !nameEl || !descEl) return;
  
  let idx = 0;
  let animating = false;

  const wrap = (i) => {
    const n = projects.length;
    return ((i % n) + n) % n;
  }
  function render(i, animate = true, dir = 1) {
    i = wrap(i);
    const p = projects[i];
    if (!p) return;

    logoEl.innerHTML = `
      <div class="logo-chip">
        <img src="${p.logo}" alt="${p.name} logo" loading="lazy" decoding="async">
      </div>
    `;

    nameEl.innerHTML = `
      <a class="name-pill" href="${p.url}" target="_blank" rel="noopener">
        <span>${p.name}</span>
        <svg class="open-icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z"></path>
          <path fill="currentColor" d="M5 5h6v2H7v10h10v-4h2v6H5V5z"></path>
        </svg>
      </a>
    `;

    descEl.innerHTML = `
      <div class="project-blurb">${p.desc}</div>
      <div class="project-badge">
         ${p.badgeIcon ? `<img src="${p.badgeIcon}" alt="" aria-hidden="true">` : ""}
         <span>${p.badgeIcon || ""}</span>
      </div>
    `;

    if(!animate) {
      gsap.set([logoEl, nameEl, descEl], {opacity:1, y:0});
      return;
    }

    const tl = gsap.timeline({ defaults: {ease:"power2.out"}});
    tl.fromTo([logoEl, nameEl], {opacity:0, y:18*dir}, {opacity:1, y:0, duration:.28, stagger:.06})
      .fromTo(descEl, {opacity:0, y:12*dir}, {opacity:1, y:0, duration:.28}, "-=.12")
      .add(() => {animating = false})
  }

  function change(to) {
    if(animating) return;
    animating = true;

    const dir = to > idx ? 1 : -1;

    gsap.to([logoEl, nameEl, descEl], {
      opacity: 0, y: -10, duration: .18, ease: "power1.in", stagger: .40,
      onComplete: () => {idx = (to + projects.length) % projects.length;
      render(idx, true, dir);}
    });
  }

  // reveal when the boat enters 
  if(window.ScrollTrigger){
    ScrollTrigger.create({
      trigger: ".boat-content", 
      start: "top 78%",
      once: true, 
      onEnter: () => render(idx, true, 1)
    });
  } else { render(idx, false, 1) }

  //Controls 
  prevBtn?.addEventListener("click", () => change(idx - 1));
  nextBtn?.addEventListener("click", () => change(idx + 1));

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevBtn?.click();
    if (e.key === "ArrowRigth") nextBtn?.click();
  });

  let startX = null;
  boatContent.addEventListener("touchstart", (e) => { 
    startX = e.touches[0].clientX; }, { passive: true });

  boatContent.addEventListener("touchend", (e) => {
    if (startX == null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) (dx < 0 ? nextBtn : prevBtn)?.click();
    startX = null;
  }, { passive: true });

}