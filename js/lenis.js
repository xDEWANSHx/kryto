/* js/lenis.js - Smooth Scrolling Initialization & GSAP integration */

document.addEventListener('DOMContentLoaded', () => {
  // Check if Lenis is loaded from CDN, if not log a warning
  if (typeof Lenis === 'undefined') {
    console.warn('Lenis smooth scroll library not found. Falling back to native scrolling.');
    return;
  }

  // Initialize Lenis smooth scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing curve
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false, // Keep false on mobile to prevent scrolling issues
    touchMultiplier: 2,
    infinite: false,
  });

  // Share lenis globally for other scripts to use
  window.lenis = lenis;

  // Sync scroll events to GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && gsap.registerPlugin) {
    lenis.on('scroll', () => {
      if (window.ScrollTrigger) {
        ScrollTrigger.update();
      }
    });

    // Hook Lenis into GSAP ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Disable lag smoothing to prevent animation jumps
    gsap.ticker.lagSmoothing(0);
  } else {
    // Normal RAF loop if GSAP isn't initialized yet
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Handle smooth scroll clicks on hash links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        lenis.scrollTo(targetElement, {
          offset: -72, // Sticky nav offset
          duration: 1.2
        });
      }
    });
  });
});
