/* js/navbar.js - Sticky Header, Hamburger Menu, and Active Nav Observer */

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section, #hero, #case-study');

  // --- 1. STICKY GLASS HEADER ---
  function checkScroll() {
    // Check scrolled height
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    if (scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Listen to window scroll (Lenis syncs this)
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial check on load

  // --- 2. MOBILE MENU OVERLAY ---
  function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    
    // Toggle body scroll locking via Lenis
    if (mobileNav.classList.contains('active')) {
      // Rotate hamburger bars to X shape
      const bars = hamburger.querySelectorAll('span');
      bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      
      if (window.lenis) window.lenis.stop();
      document.body.style.overflow = 'hidden';
    } else {
      // Revert hamburger bars
      const bars = hamburger.querySelectorAll('span');
      bars[0].style.transform = 'none';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'none';
      
      if (window.lenis) window.lenis.start();
      document.body.style.overflow = '';
    }
  }

  hamburger.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when links are clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileMenu();
      
      // Smooth scroll to target using lenis
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement && window.lenis) {
        setTimeout(() => {
          window.lenis.scrollTo(targetElement, { offset: -72 });
        }, 500); // Wait for menu close slide out
      }
    });
  });

  // --- 3. ACTIVE SECTION HIGHLIGHT OBSERVER ---
  const observerOptions = {
    root: null, // Viewport
    rootMargin: '-30% 0px -60% 0px', // Focus window in middle of screen
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Skip sections that don't map to nav links
        if (!id) return;

        // Desktop nav highlights
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Mobile nav highlights
        mobileLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    if (section.getAttribute('id')) {
      sectionObserver.observe(section);
    }
  });
});
