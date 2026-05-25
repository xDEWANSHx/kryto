/* js/gsap-animations.js - GSAP 3 & ScrollTrigger Animations */

document.addEventListener('DOMContentLoaded', () => {
  // Check if GSAP is loaded
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn("GSAP or ScrollTrigger libraries are missing. Running page with static components.");
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // Initialize GSAP Media Queries for responsive animation handling
  const mm = gsap.matchMedia();

  // --- 1. ON-LOAD ANIMATIONS (HERO SECTION) ---
  const heroTl = gsap.timeline({ defaults: { ease: "power2.out" } });

  // Fade down navigation bar smoothly
  heroTl.from("header", {
    y: -20,
    opacity: 0,
    duration: 1.2,
    delay: 0.1
  });

  // Fade in the hero text overlay smoothly (all together, avoiding fast stagger jumps)
  heroTl.from(".hero-overlay", {
    opacity: 0,
    y: 15,
    duration: 1.5
  }, "-=0.8");

  // Fade in Three.js hero canvas smoothly
  heroTl.from("#hero-canvas", {
    opacity: 0,
    duration: 2.0
  }, "0");

  // --- 2. GLOBAL SECTION HEADERS FADE ---
  document.querySelectorAll('.section-header').forEach(header => {
    gsap.from(header, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: header,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });

  // --- 3. SERVICES CARDS STAGGER ---
  gsap.from(".services-grid .service-card", {
    y: 60,
    opacity: 0,
    stagger: 0.12,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".services-grid",
      start: "top 80%"
    }
  });

  // --- 4. GALLERY MASONRY CARDS STAGGER ---
  gsap.from(".gallery-card", {
    scale: 0.95,
    opacity: 0,
    stagger: 0.08,
    duration: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".gallery-grid",
      start: "top 85%"
    }
  });

  // --- 5. PROCESS TIMELINE LINE FILL & NODES STAGGER ---
  mm.add("(min-width: 641px)", () => {
    // Fill timeline line vertically on scroll
    gsap.to(".timeline-line-fill", {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: ".timeline-container",
        scrub: 0.5,
        start: "top 30%",
        end: "bottom 75%"
      }
    });

    // Alternating slide-in steps (left & right sides)
    document.querySelectorAll(".timeline-step").forEach((step, i) => {
      const isLeft = step.classList.contains("timeline-step-left");
      gsap.from(step.querySelector(".timeline-content-wrap"), {
        x: isLeft ? -80 : 80,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: step,
          start: "top 75%"
        }
      });

      // Highlight step node as active when scroll hits it
      ScrollTrigger.create({
        trigger: step,
        start: "top 55%",
        end: "bottom 55%",
        onEnter: () => step.classList.add("active"),
        onLeaveBack: () => step.classList.remove("active")
      });
    });
  });

  mm.add("(max-width: 640px)", () => {
    // Mobilized straight line progress
    gsap.to(".timeline-line-fill", {
      height: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: ".timeline-container",
        scrub: 0.3,
        start: "top 20%",
        end: "bottom 80%"
      }
    });

    document.querySelectorAll(".timeline-step").forEach(step => {
      gsap.from(step.querySelector(".timeline-content-wrap"), {
        x: 40,
        opacity: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: step,
          start: "top 80%"
        }
      });

      ScrollTrigger.create({
        trigger: step,
        start: "top 60%",
        end: "bottom 60%",
        onEnter: () => step.classList.add("active"),
        onLeaveBack: () => step.classList.remove("active")
      });
    });
  });

  // --- 6. CASE STUDY PINNED HORIZONTAL SCROLL (CROWN JEWEL CASE STUDY) ---
  mm.add("(min-width: 1025px)", () => {
    const panels = gsap.utils.toArray(".case-panel");
    const totalPanels = panels.length;
    
    // Animate the horizontal track translation
    const horizontalScroll = gsap.to(".horizontal-scroll-track", {
      x: () => -(document.querySelector(".horizontal-scroll-track").scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: "#case-study",
        pin: true,
        scrub: 1,
        start: "top top",
        end: () => "+=" + (document.querySelector(".horizontal-scroll-track").scrollWidth - window.innerWidth),
        invalidateOnRefresh: true
      }
    });

    // Custom Panel-Specific Micro-animations inside horizontal scroll

    // Panel 2 - Features stagger inside solution panel
    gsap.from(".feature-check-item", {
      y: 20,
      opacity: 0,
      stagger: 0.05,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".panel-solution",
        containerAnimation: horizontalScroll, // Key parameter to bind to horizontal scroll
        start: "left 70%",
        toggleActions: "play none none none"
      }
    });

    // Panel 3 - Mockup chart bars animation
    gsap.from(".mock-chart-bar", {
      height: 0,
      stagger: 0.06,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".panel-preview",
        containerAnimation: horizontalScroll,
        start: "left 60%"
      }
    });

    // Panel 4 - Results numeric increments
    gsap.from(".results-card", {
      scale: 0.9,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "back.out(1.5)",
      scrollTrigger: {
        trigger: ".panel-results",
        containerAnimation: horizontalScroll,
        start: "left 65%"
      }
    });
  });

  // For Mobile and Small Tablets - reset horizontal scrolling, let it scroll naturally vertically
  mm.add("(max-width: 1024px)", () => {
    // Normal mobile vertical card scroll in case study
    gsap.from(".feature-check-item", {
      y: 20,
      opacity: 0,
      stagger: 0.05,
      duration: 0.4,
      scrollTrigger: {
        trigger: ".panel-solution",
        start: "top 75%"
      }
    });

    gsap.from(".mock-chart-bar", {
      height: 0,
      stagger: 0.05,
      duration: 0.6,
      scrollTrigger: {
        trigger: ".panel-preview",
        start: "top 70%"
      }
    });

    gsap.from(".results-card", {
      scale: 0.95,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      scrollTrigger: {
        trigger: ".panel-results",
        start: "top 75%"
      }
    });
  });

  // --- 7. ABOUT SECTION VALUE PILLS ---
  gsap.from(".about-badges .pill", {
    scale: 0.8,
    opacity: 0,
    stagger: 0.08,
    duration: 0.5,
    ease: "back.out(1.5)",
    scrollTrigger: {
      trigger: ".about-badges",
      start: "top 90%"
    }
  });

  // Team cards stagger
  gsap.from(".about-team-grid .team-card", {
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.6,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".about-team-grid",
      start: "top 85%"
    }
  });
});
