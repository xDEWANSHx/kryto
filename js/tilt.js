/* js/tilt.js - VanillaTilt 3D Hover Cards Configuration */

document.addEventListener('DOMContentLoaded', () => {
  // Check if library exists
  if (typeof VanillaTilt === 'undefined') {
    console.warn("VanillaTilt library not found. Service cards will remain static.");
    return;
  }

  // Throttling for touch devices/mobile to avoid layout jitter
  const isMobileOrTablet = window.innerWidth < 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (isMobileOrTablet) {
    // Remove data-tilt attribute from cards to prevent default auto-initialization
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.removeAttribute('data-tilt');
    });
    return;
  }

  // Explicit initialization of Service Cards
  const serviceCards = document.querySelectorAll('.service-card');
  
  if (serviceCards.length > 0) {
    VanillaTilt.init(serviceCards, {
      max: 12, // Maximum tilt rotation angle in degrees
      speed: 400, // Speed of transition on hover enter/leave
      glare: true, // Enable specular highlight reflections
      "max-glare": 0.15, // Glare opacity
      perspective: 1000, // Lower values = more extreme 3D effect
      scale: 1.02, // Grow card size slightly on hover
      gyroscope: false // Disable gyro sensor controls to save performance
    });
  }
});
