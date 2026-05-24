/* js/feedback.js - Support Accordion and Star Rating Logic */

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.support-tab-btn');
  const contents = document.querySelectorAll('.support-tab-content');
  const stars = document.querySelectorAll('.star-rating-input i');
  const ratingInput = document.getElementById('feedback-rating-value');

  if (!tabs.length || !contents.length) return;

  // --- 1. ACCORDION TAB SWITCHER ---
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active states
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      // Set active current
      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }

      // Refresh ScrollTrigger since container heights might change
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    });
  });

  // --- 2. INTERACTIVE STAR RATING WIDGET ---
  if (stars.length) {
    let currentRating = 0;

    stars.forEach((star, index) => {
      // Mouse Hover Enter (highlight stars up to hovered)
      star.addEventListener('mouseenter', () => {
        highlightStars(index + 1);
      });

      // Mouse Leave (revert to last clicked rating)
      star.addEventListener('mouseleave', () => {
        highlightStars(currentRating);
      });

      // Mouse Click (permanently save rating and play pop animation)
      star.addEventListener('click', () => {
        currentRating = index + 1;
        if (ratingInput) ratingInput.value = currentRating;
        
        highlightStars(currentRating);
        
        // Play bounce animations
        for (let i = 0; i < currentRating; i++) {
          stars[i].classList.add('star-pop-animate');
          // Clear class after animation runs
          setTimeout(() => {
            stars[i].classList.remove('star-pop-animate');
          }, 400);
        }
      });
    });

    // Helper to color/fill stars based on value
    function highlightStars(count) {
      stars.forEach((star, idx) => {
        if (idx < count) {
          star.classList.add('active');
          star.setAttribute('data-lucide', 'star-filled'); // Swap to filled star
          // If Lucide is active, update classes
          star.style.color = '#ffc107';
        } else {
          star.classList.remove('active');
          star.style.color = ''; // Restore default color
        }
      });
    }
  }

  // --- 3. SUBMIT STATES HANDLING ---
  const issueForm = document.getElementById('issue-report-form');
  const feedbackForm = document.getElementById('feedback-submit-form');

  function handleFormSuccess(form, overlayId, messageText) {
    form.reset();
    const successOverlay = document.getElementById(overlayId);
    if (successOverlay) {
      successOverlay.classList.add('active');
      // Hide form contents
      form.style.opacity = '0';
      form.style.pointerEvents = 'none';

      // Auto-hide success panel after 5 seconds and restore form
      setTimeout(() => {
        successOverlay.classList.remove('active');
        form.style.opacity = '1';
        form.style.pointerEvents = 'auto';
      }, 5000);
    }
  }

  if (issueForm) {
    issueForm.addEventListener('submit', (e) => {
      // Client-side validations
      const descInput = document.getElementById('issue-desc');
      if (descInput && descInput.value.length < 100) {
        e.preventDefault();
        alert("Please describe the issue in detail (at least 100 characters).");
        return;
      }
      
      // Let standard action submission execute, but mock visually for offline double click
      if (window.location.protocol === 'file:') {
        e.preventDefault();
        handleFormSuccess(issueForm, 'issue-success-overlay');
      }
    });
  }

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      if (window.location.protocol === 'file:') {
        e.preventDefault();
        handleFormSuccess(feedbackForm, 'feedback-success-overlay');
      }
    });
  }
});
