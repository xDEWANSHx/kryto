/* js/contact.js - Leaflet Map Initialization and Contact Form Validation */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. LEAFLET.JS MAP INITIALIZATION ---
  const mapContainer = document.getElementById('map');
  
  if (mapContainer && typeof L !== 'undefined') {
    try {
      const ambikapurCoords = [23.1196, 83.1925];
      
      // Initialize Leaflet map with scroll zoom disabled to prevent scroll hijack
      const map = L.map('map', {
        center: ambikapurCoords,
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false
      });

      // Add CartoDB Dark Matter tile layer for premium visual continuity
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // Create Custom Violet Glowing Marker
      const violetIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="
          width: 14px; 
          height: 14px; 
          background-color: var(--accent-primary); 
          border: 2px solid #ffffff; 
          border-radius: 50%; 
          box-shadow: 0 0 12px var(--accent-primary);
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const marker = L.marker(ambikapurCoords, { icon: violetIcon }).addTo(map);
      
      // Bind popup mockup
      marker.bindPopup(`
        <div style="font-family: 'Space Grotesk', sans-serif; color: #111; font-size: 13px; line-height: 1.4;">
          <strong style="color: var(--accent-primary);">Kryto Studios</strong><br>
          Ambikapur, Chhattisgarh, India<br>
          <span style="font-size: 11px; color:#555;">Mon–Sat, 10am–7pm IST</span>
        </div>
      `).openPopup();
      
    } catch (err) {
      console.warn("Leaflet Map failed to load map canvas properly.", err);
    }
  }

  // --- 2. CONTACT FORM CLIENT-SIDE VALIDATION ---
  const contactForm = document.getElementById('primary-contact-form');
  const successOverlay = document.getElementById('contact-success-overlay');

  if (contactForm) {
    // Clear errors on input focus
    const inputs = contactForm.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        const inputGroup = input.closest('.input-group');
        if (inputGroup) {
          inputGroup.classList.remove('error');
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      let hasError = false;

      // 1. Validate Full Name
      const nameInput = document.getElementById('contact-name');
      if (nameInput && !nameInput.value.trim()) {
        showError(nameInput, "Please enter your full name.");
        hasError = true;
      }

      // 2. Validate Email
      const emailInput = document.getElementById('contact-email');
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInput && !emailPattern.test(emailInput.value.trim())) {
        showError(emailInput, "Please enter a valid email address.");
        hasError = true;
      }

      // 3. Validate Message
      const messageInput = document.getElementById('contact-message');
      if (messageInput && !messageInput.value.trim()) {
        showError(messageInput, "Please write a message description of your project.");
        hasError = true;
      }

      // Stop submission if validation errors occur
      if (hasError) {
        e.preventDefault();
        return;
      }

      // Handle visual success mocks when double-clicking locally
      if (window.location.protocol === 'file:') {
        e.preventDefault();
        contactForm.reset();
        
        if (successOverlay) {
          successOverlay.classList.add('active');
          contactForm.style.opacity = '0';
          contactForm.style.pointerEvents = 'none';

          // Reset forms after 6 seconds
          setTimeout(() => {
            successOverlay.classList.remove('active');
            contactForm.style.opacity = '1';
            contactForm.style.pointerEvents = 'auto';
          }, 6000);
        }
      }
    });
  }

  function showError(inputElement, errorMessageText) {
    const inputGroup = inputElement.closest('.input-group');
    if (inputGroup) {
      inputGroup.classList.add('error');
      const errorDiv = inputGroup.querySelector('.error-message');
      if (errorDiv) {
        errorDiv.textContent = errorMessageText;
      }
    }
  }
});
