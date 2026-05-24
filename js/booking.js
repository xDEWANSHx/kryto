/* js/booking.js - Calendly Widget & Popup Integrations */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // OWNER CONFIGURATION:
  // Replace the placeholder below with your real Calendly scheduling link!
  // Example: 'https://calendly.com/your-username'
  const CALENDLY_LINK = "https://calendly.com/krytostudios/30min";
  // ==========================================

  const inlineWidget = document.querySelector('.calendly-inline-widget');
  const placeholder = document.getElementById('calendly-fallback-placeholder');
  
  // Set link in inline widget if it's the default or placeholder
  if (inlineWidget && CALENDLY_LINK !== "YOUR_CALENDLY_LINK_HERE") {
    inlineWidget.setAttribute('data-url', CALENDLY_LINK);
    
    // Hide fallback placeholder card and display widget if URL is configured
    if (placeholder && CALENDLY_LINK.indexOf("YOUR_CALENDLY_LINK_HERE") === -1) {
      placeholder.style.display = 'none';
      inlineWidget.style.display = 'block';
    }
  }

  // Handle CTA button triggers (floating button & hero bookings)
  const triggers = document.querySelectorAll('.book-call-trigger, .book-call-float');

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      if (CALENDLY_LINK.indexOf("YOUR_CALENDLY_LINK_HERE") !== -1) {
        // If owner hasn't configured it yet, scroll to booking section directly
        const bookingSection = document.getElementById('booking');
        if (bookingSection && window.lenis) {
          window.lenis.scrollTo(bookingSection, { offset: -72 });
        } else if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      // If Calendly scripts are loaded, launch overlay
      if (typeof Calendly !== 'undefined' && Calendly.initPopupWidget) {
        Calendly.initPopupWidget({
          url: CALENDLY_LINK,
          color: '#7c6ff7',
          textColor: '#ffffff',
          brandingColor: '#7c6ff7'
        });
      } else {
        // Fallback: open link in new tab
        window.open(CALENDLY_LINK, '_blank');
      }
    });
  });
});
