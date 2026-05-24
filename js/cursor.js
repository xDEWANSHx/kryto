/* js/cursor.js - Custom Cursor Logic */

document.addEventListener('DOMContentLoaded', () => {
  // Create cursor elements dynamically so they don't have to be hardcoded in HTML
  const cursorDot = document.createElement('div');
  cursorDot.classList.add('custom-cursor');
  cursorDot.id = 'custom-cursor';
  
  const cursorRing = document.createElement('div');
  cursorRing.classList.add('custom-cursor-ring');
  cursorRing.id = 'custom-cursor-ring';
  
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);
  
  // Track mouse coordinates
  let mouseX = 0;
  let mouseY = 0;
  let dotX = 0;
  let dotY = 0;
  let ringX = 0;
  let ringY = 0;
  
  // Disable on mobile/tablet (touch devices)
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  if (isTouchDevice) {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
    return;
  }
  
  // Update mouse position on move
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Make the cursor elements visible once mouse moves
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '1';
  });
  
  // Interpolation loop for ultra-smooth movement (lerp)
  function updateCursor() {
    // Dot moves faster for responsiveness
    dotX += (mouseX - dotX) * 0.3;
    dotY += (mouseY - dotY) * 0.3;
    
    // Ring moves slower for a trailing physical feel
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;
    
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    
    requestAnimationFrame(updateCursor);
  }
  updateCursor();
  
  // Hover effects on interactive elements
  const hoverSelectors = 'a, button, input, textarea, select, .service-card, .gallery-card, .timeline-node, .social-link, .testimonials-arrow, .testimonials-dot, .hamburger, .star-rating-input i';
  
  function addHoverListeners() {
    const hoverElements = document.querySelectorAll(hoverSelectors);
    
    hoverElements.forEach(el => {
      // Avoid duplicate event listeners
      if (el.dataset.cursorBound) return;
      el.dataset.cursorBound = 'true';
      
      el.addEventListener('mouseenter', () => {
        // Expand ring, hide dot or make it larger
        cursorRing.style.width = '60px';
        cursorRing.style.height = '60px';
        cursorRing.style.borderColor = 'var(--accent-secondary)';
        cursorRing.style.backgroundColor = 'rgba(78, 203, 141, 0.05)';
        
        cursorDot.style.transform = 'translate(-50%, -50%) scale(0)';
      });
      
      el.addEventListener('mouseleave', () => {
        // Restore defaults
        cursorRing.style.width = '40px';
        cursorRing.style.height = '40px';
        cursorRing.style.borderColor = 'var(--accent-primary)';
        cursorRing.style.backgroundColor = 'transparent';
        
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });
  }
  
  // Initial run
  addHoverListeners();
  
  // Re-run whenever DOM changes (so newly rendered elements get cursor hover handlers)
  const observer = new MutationObserver(addHoverListeners);
  observer.observe(document.body, { childList: true, subtree: true });
});
