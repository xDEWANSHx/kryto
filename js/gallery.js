/* js/gallery.js - Gallery Masonry, Filtering and Custom Lightbox */

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.gallery-tabs .pill');
  const cards = document.querySelectorAll('.gallery-card');
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.querySelector('.lightbox-content');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (!tabs.length || !cards.length) return;

  // --- 1. FILTERING SYSTEM ---
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab style
      tabs.forEach(t => t.classList.remove('pill-active'));
      tab.classList.add('pill-active');

      const filterValue = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');

        // Smooth animations for filtering
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          // Fade in
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          // Fade out
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300); // Must match CSS transitions
        }
      });

      // Refresh ScrollTrigger to recalculate heights after items are hidden
      if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => ScrollTrigger.refresh(), 350);
      }
    });
  });

  // --- 2. CUSTOM HIGH-FIDELITY LIGHTBOX SYSTEM ---
  // Create mapping of project titles to descriptions for modal view
  const projectDetails = {
    "Srijan Institute ERP": {
      desc: "Full administrative system built for student records, fees, staff payroll, and mark processing.",
      gradient: "linear-gradient(135deg, #0d1b2a, #1a3a5c)",
      features: "• Automated Fee Receipting<br>• Student Grades Portal<br>• Account Balance Tracker"
    },
    "School Website — Ambikapur": {
      desc: "Responsive public portal with admission forms, notice boards, and student gallery.",
      gradient: "linear-gradient(135deg, #0d1b2a, #1a3a5c)",
      features: "• 100% Mobile Responsive<br>• Administrative Panel<br>• Dynamic Announcements List"
    },
    "Restaurant Landing Page": {
      desc: "Cinematic, interactive menu page with online booking and customer reviews.",
      gradient: "linear-gradient(135deg, #0d1b2a, #1a3a5c)",
      features: "• Direct Table Reservation<br>• High-Res Image Sliders<br>• Custom SVG Menu Layouts"
    },
    "NGO Website": {
      desc: "Charity fundraising and advocacy landing page with online donation integrations.",
      gradient: "linear-gradient(135deg, #0d1b2a, #1a3a5c)",
      features: "• Razorpay Donation Integration<br>• Blog & Event Calendar<br>• Volunteer Signup Forms"
    },
    "Fitness App UI": {
      desc: "UX mockups for an Android wellness application featuring daily workout guides.",
      gradient: "linear-gradient(135deg, #1a0d2e, #3d1a6b)",
      features: "• Dark Mode UI Kit<br>• Interactive Charts & Goals<br>• Custom Health Icons"
    },
    "E-commerce App": {
      desc: "Fully functional retail interface containing shopping carts and product reviews.",
      gradient: "linear-gradient(135deg, #1a0d2e, #3d1a6b)",
      features: "• Fast Product Searches<br>• Swipe-to-Delete Cart UX<br>• Firebase Authenticators"
    },
    "Wedding Photography Edit": {
      desc: "Advanced tone mapping and fine art editing with tailored color presets.",
      gradient: "linear-gradient(135deg, #1a0a00, #5c2a00)",
      features: "• Custom HSL Enhancements<br>• High Skin Texture Retention<br>• High-Resolution Exporting"
    },
    "Product Commercial": {
      desc: "Full promotional video rendering complete with visual effects and grading.",
      gradient: "linear-gradient(135deg, #1a0a00, #5c2a00)",
      features: "• Cinematic LUT Overlays<br>• Dynamic Kinetic Typography<br>• Sound Effects (SFX) Packs"
    },
    "Portrait Retouch": {
      desc: "Commercial magazine frequency separation retouching for professional portraits.",
      gradient: "linear-gradient(135deg, #1a0a00, #5c2a00)",
      features: "• Non-Destructive Editing<br>• Teeth/Eye Brightening<br>• Hair and Beard Adjustments"
    },
    "YouTube Channel Thumbnails": {
      desc: "High-clickthrough graphic design for video marketing campaigns.",
      gradient: "linear-gradient(135deg, #1a0a00, #5c2a00)",
      features: "• Click-optimized typography<br>• High-contrast lighting masking<br>• Expressive face extraction"
    },
    "Inventory System": {
      desc: "Commercial stock management platform for local retail businesses.",
      gradient: "linear-gradient(135deg, #0d2218, #1a5c3a)",
      features: "• Barcode Scanner integration<br>• Low stock email alerts<br>• Supplier invoice parser"
    },
    "Real Estate Website": {
      desc: "Premium property searching directory for Chhattisgarh developers.",
      gradient: "linear-gradient(135deg, #0d1b2a, #1a3a5c)",
      features: "• Full Interactive Maps<br>• Virtual Video Tours<br>• Filter-by-Budget Widgets"
    }
  };

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const name = card.querySelector('.gallery-name').textContent;
      const categoryTag = card.querySelector('.gallery-tag').textContent;
      
      // Fetch matching project metadata or use fallback
      const data = projectDetails[name] || {
        desc: "A custom handcrafted project delivering sleek layouts and functional interfaces.",
        gradient: "linear-gradient(135deg, #141414, #1e1e1e)",
        features: "• Custom Code Architecture<br>• Clean UI Styling<br>• Cross-Platform Performance"
      };

      // Set up content in lightbox modal dynamically
      lightboxContent.innerHTML = `
        <div class="lightbox-img-placeholder" style="background: ${data.gradient}; padding: 60px 40px; text-align: center;">
          <span class="gallery-tag" style="color: var(--accent-secondary); font-size: 13px;">${categoryTag}</span>
          <h3 style="font-size: 36px; margin: 16px 0; color: #fff; font-family: var(--font-heading); font-weight: 700;">${name}</h3>
          <p style="color: rgba(255,255,255,0.7); max-width: 500px; margin: 0 auto 30px auto; font-size: 15px; line-height: 1.6;">${data.desc}</p>
          <div style="text-align: left; max-width: 400px; margin: 0 auto; background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
            <h4 style="font-size: 14px; text-transform: uppercase; color: #fff; margin-bottom: 12px; font-weight: 600; font-family: var(--font-heading);">Key Features Delivered</h4>
            <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.8;">${data.features}</div>
          </div>
          <button class="btn btn-primary btn-sm" style="margin-top: 30px;" onclick="document.getElementById('lightbox').classList.remove('active'); document.getElementById('contact').scrollIntoView({behavior:'smooth'});">Inquire About This Work</button>
        </div>
      `;

      // Open modal
      lightbox.classList.add('active');
      
      // Pause lenis scrolling while lightbox is active
      if (window.lenis) {
        window.lenis.stop();
      }
    });
  });

  // Close Lightbox
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    // If click on background overlay, close it
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    // Resume scrolling
    if (window.lenis) {
      window.lenis.start();
    }
  }

  // Handle escape key to close lightbox
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
});
