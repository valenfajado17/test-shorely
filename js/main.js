window.addEventListener("DOMContentLoaded", () => {
  animateAboutUsSection();
  animateSeaCreatures();
  scrollFromHome();

  industriesSection();
  animateBoatSection();  
  scrollFromBoat();
  animateFounderSection();
});


let crabLegsAnimations = [];

function animateAboutUsSection(){
  const tl = gsap.timeline();
   
  // Shorely logo scales in 
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
  
  eyeMovementSeaCreatures();
  squishSeaCreature(); 

  gsap.set(".crab-container", { 
    x: window.innerWidth,
    y: 0,
    opacity: 0,
    position: "absolute",
    bottom: "-1vh",
    transform: "translateX(-50%)"
  });

  // Crab enter walking
  tl.to(".crab-container", {
    x: 0,
    opacity: 1,
    duration: 2.5,
    ease: "power2.out",
    onStart: animateCrabLegs,
    onComplete:  stopCrabLegs
  }, "-=0.5");
}

function animateCrabLegs(){
  const speed = 0.25;

  crabLegsAnimations.push(
    gsap.to(".ll-1", {
      rotate: 15,
      yoyo: true,
      repeat: -1,
      duration: speed,
      ease: "sine.inOut"
    }),
    gsap.to(".ll-2", {
      rotate: -15, 
      yoyo: true,
      repeat: -1,
      duration: speed,
      ease: "sine.inOut",
      delay: speed / 2
    }),
    gsap.to(".lr-1", {
      rotate: -15,
      yoyo: true,
      repeat: -1,
      duration: speed,
      ease: "sine.inOut"
    }),
    gsap.to(".lr-2", {
      rotate: 15, 
      yoyo: true,
      repeat: -1,
      duration: speed,
      ease: "sine.inOut",
      delay: speed / 2
    })
  );
}
  
function stopCrabLegs(){
  crabLegsAnimations.forEach(anim => anim.kill());
  crabLegsAnimations = [];

  gsap.set([".ll-1", ".ll-2", ".lr-1", ".lr-2"], {rotate:0});

  gsap.to(".bf", {
    opacity: 1,
    scale: 1,
    duration: 0.7,
    ease: "back.out(1.7)"
  });
}


function squishSeaCreature(){
  document.querySelectorAll(".creature").forEach(c => {
    const normal = c.querySelector(".normal");
    const squish = c.querySelector(".squish");
    const eyes = c.querySelectorAll(".eye");

    c.addEventListener("click", () => {
      normal.style.display = "none";
      eyes.forEach(e => e.style.display = "none");
      squish.style.display = "block";

      // squish animation
      gsap.fromTo(squish, 
        { scale: 0.8, opacity: 1},
        { scale : 1.1, yoyo: true, repeat: 1, duration: 0.2}
      );

      // Reaparecen
      setTimeout(() => {
        squish.style.display = "none";
        normal.style.display = "block";
        normal.classList.add("pop-in");
        gsap.set(eyes, { display: "block" });
        gsap.to(eyes, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" });

        // Calcular ramdom position
        const newX = Math.random() * 50 - 25;
        const newY = Math.random() * 30 - 15;

        gsap.to(c, {
          xPercent: newX,
          yPercent: newY,
          duration: 0.6,
          ease: "power2.out"
        });

        setTimeout(() => {
          normal.classList.remove("pop-in")
        }, 400);

      }, 500);
    })
  })
}

function eyeMovementSeaCreatures(){
  document.addEventListener("mousemove", (e) => {
    const eyes = document.querySelectorAll(".eye");

    eyes.forEach(eye => {

      if (getComputedStyle(eye).opacity === "0") return;

      const rect = eye.getBoundingClientRect();
      const eyeX = rect.left + rect.width / 2;
      const eyeY = rect.top + rect.height / 2;

      const angle = Math.atan2(e.clientY - eyeY, e.clientX - eyeX);
      const offset = 4;
      const x = Math.cos(angle) * offset;
      const y = Math.sin(angle) * offset;

      eye.style.transform = `translate(${x}px, ${y}px) scale(1)`;
    });
  });
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

  scrollCrabAnimation();
  
}

function scrollCrabAnimation(){
  const crab = document.querySelector(".crab-container");

  ScrollTrigger.create({
    trigger: ".about-us",
    start: "bottom bottom",
    end: "+=100%", 
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;

      if(progress > 0 && progress < 1){
        animateCrabLegs();

        gsap.to(crab, {
          x: window.innerWidth / 2 - 100,
          y: 8,
          start: "top bottom",
          duration: 1.3,
          ease: "power2.out"
        });

        crab.style.position = "fixed";
        crab.style.bottom = "0vh";
        crab.style.right = "20vh";
      }

      if( progress == 0) {
        stopCrabLegs();
        gsap.to(crab, {
          x:0,
          y:0,
          duration: 1.3,
          ease: "power2.out"
        });

        crab.style.position = "absolute";
        crab.style.left = "50%";
        crab.style.right = "auto";
        crab.style.bottom = "-1vh";
        crab.style.transform = "translateX(-50%)";
      }
    }, x: 0, y: 0
  })
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
    x:0,
    opacity: 1,
    duration: 4.2,
    ease: "power2.out",
  }, "-=0.7");
  
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
function founderEyesFollowCursor() {
  const eyes = [
    document.querySelector('.left-eye-founder'),
    document.querySelector('.right-eye-founder')
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

  // crab.style.display = 'none';


  founderEyesFollowCursor();
}




function cargarData(){
  const companies = [
    { logo: "../assets/images/boat/companies-logos/aoe-logo.png", name: "aoe.bet", desc: "Place bets on matches and directly support your favorite players in the Age of Empires scene" },
    { logo: "../assets/images/boat/companies-logos/swapped-logo.png", name: "swapped.com", desc: "Real Estate Backed Equity Secured Fund - sub fund of Iridium Sicav PLC of Polymath & Boffin Limited" }
  ];

  let current = 0;

  function updateCompanyInfo(idx) {
    document.querySelector('.logo-company').innerHTML = `<img src='assets/images/companies/${companies[idx].logo}' alt='${companies[idx].name} logo' style='height:32px'>`;
    document.querySelector('.name-company').textContent = companies[idx].name;
    document.querySelector('.description-company').textContent = companies[idx].desc;
  }

  updateCompanyInfo(current);

  document.querySelector('.arrow-left').addEventListener('click', () => {
    current = (current - 1 + companies.length) % companies.length;
    updateCompanyInfo(current);
  });
  document.querySelector('.arrow-right').addEventListener('click', () => {
    current = (current + 1) % companies.length;
    updateCompanyInfo(current);
  });

}
 