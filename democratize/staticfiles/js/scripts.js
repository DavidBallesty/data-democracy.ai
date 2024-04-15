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

// Initialize functions when the window loads
window.onload = function() {
  initGlobe();
  animateHorizontalText();
};

// Horizontal nav scroll effect
const nav = document.getElementById('horizontal-nav');

// Adding more logs to diagnose the issue
console.log('Initial clientWidth:', nav.clientWidth);
console.log('Initial scrollWidth:', nav.scrollWidth);
console.log('Initial overflowX:', getComputedStyle(nav).overflowX);
console.log('Children total width:', Array.from(nav.children).reduce((total, child) => total + child.offsetWidth, 0));


document.addEventListener('DOMContentLoaded', function() {
  const nav = document.getElementById('horizontal-nav');
  let totalScrollWidth = calculateTotalWidth(nav);  // Assume this function is defined to calculate width

  nav.addEventListener('wheel', function(e) {
      e.preventDefault();  // Prevent the default scroll behavior

      let scrollStep = 100;  // Adjust the step size based on your needs
      let delta = e.deltaY;

      if (delta < 0 && nav.scrollLeft > 0) {
          nav.scrollLeft -= scrollStep;
      } else if (delta > 0 && nav.scrollLeft < totalScrollWidth - nav.clientWidth) {
          nav.scrollLeft += scrollStep;
      }

      console.log('Current scroll position:', nav.scrollLeft);
  }, { passive: false });
});

function calculateTotalWidth(nav) {
  const children = nav.querySelectorAll('div');
  return Array.from(children).reduce((total, child) => total + child.offsetWidth, 0);
}