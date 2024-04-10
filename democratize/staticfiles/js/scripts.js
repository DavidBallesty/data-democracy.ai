// Placeholder for initializing the globe
function initGlobe() {
    // Code to initialize the globe with dots and animated lines
    // This will likely utilize a library like Globe.js or Three.js
  }
  
  // Function to animate horizontal text
  function animateHorizontalText() {
    // Code for animating the horizontal text
    // Use a library like GSAP or simple CSS transitions
  }
  
  // Function to handle language selection
  function switchLanguage(language) {
    // Code to switch the text of the site to the selected language
    // Potentially using a library or a framework for internationalization
  }
  
  // Event listeners for language buttons
  document.querySelectorAll('#language-selector button').forEach(button => {
    button.addEventListener('click', function() {
      switchLanguage(this.getAttribute('data-language'));
      document.querySelector('#language-selector button.active').classList.remove('active');
      this.classList.add('active');
    });
  });
  
  // Initialize functions when the window loads
  window.onload = function() {
    initGlobe();
    animateHorizontalText();
  };

  document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to buttons
    document.getElementById('btn-auto-analyze').addEventListener('click', function() {
        window.location.href = '/auto_analyze/'; // Adjust URL as necessary
    });

    document.getElementById('btn-scan-websites').addEventListener('click', function() {
        window.location.href = '/scan_websites/'; // Adjust URL as necessary
    });

    document.getElementById('btn-scan-images').addEventListener('click', function() {
        window.location.href = '/scan_images/'; // Adjust URL as necessary
    });

    // Additional JavaScript for globe.js can be initialized here or in a separate file
    // initGlobe(); // Uncomment and implement this if globe.js is separate and needs to be initialized
});

  
  