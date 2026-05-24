/* js/counter.js - CountUp Stats Animation */

document.addEventListener('DOMContentLoaded', () => {
  const statNumbers = document.querySelectorAll('[data-target]');
  
  if (!statNumbers.length) return;

  // Custom Vanilla JS easing CountUp animator
  function animateValue(obj) {
    const targetValue = parseInt(obj.getAttribute('data-target'));
    const suffix = obj.getAttribute('data-suffix') || '';
    const duration = 2000; // Animate over 2 seconds
    let startTimestamp = null;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutQuad curve for custom physical slowing effect
      const easeProgress = progress * (2 - progress);
      
      const currentValue = Math.floor(easeProgress * targetValue);
      obj.innerHTML = currentValue.toLocaleString() + suffix;
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.innerHTML = targetValue.toLocaleString() + suffix;
      }
    };
    
    window.requestAnimationFrame(step);
  }

  // Setup Intersection Observer to count up only when elements scroll into view
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetElement = entry.target;
        
        // Prevent double trigger
        if (targetElement.dataset.counted) return;
        targetElement.dataset.counted = "true";
        
        animateValue(targetElement);
        observer.unobserve(targetElement); // Count up once, then stop tracking
      }
    });
  }, {
    threshold: 0.6 // Trigger when 60% of the stat card is visible
  });

  statNumbers.forEach(num => {
    counterObserver.observe(num);
  });
});
