/**
 * ====================================================================
 * STUDYFLOW INTEGRATIONS PAGE JAVASCRIPT
 * ====================================================================
 * @file integrations-script.js
 * @description Interactive features for integrations showcase
 * @author StudyFlow Team
 * @version 2.0.0
 *
 * FEATURES:
 * - Infinite logo slideshow with duplication for seamless loop
 * - Scroll-triggered animations for cards and sections
 * - Interactive platform card filtering
 * - Smooth scrolling to sections
 * - Analytics tracking for user engagement
 * - Responsive slideshow speed adjustment
 *
 * TABLE OF CONTENTS:
 * 1. Slideshow Manager
 * 2. Scroll Animations
 * 3. Section Navigation
 * 4. Analytics Tracking
 * 5. Interactive Elements
 * 6. Initialization
 * ====================================================================
 */

"use strict";

/* ===================================================================
   1. SLIDESHOW MANAGER
   ===================================================================
   Manages infinite logo slideshow with seamless looping
   =================================================================== */

/**
 * SlideshowManager Class
 * Creates and manages infinite scrolling logo slideshow
 *
 * @class
 * @example
 * const slideshow = new SlideshowManager();
 */
class SlideshowManager {
  /**
   * Creates a SlideshowManager instance
   * Duplicates logos for seamless infinite scroll
   */
  constructor() {
    this.track = document.getElementById("slideshowTrack");
    this.init();
  }

  /**
   * Initialize slideshow
   * Duplicates items for seamless infinite scroll
   *
   * @private
   */
  init() {
    if (!this.track) return;

    // Clone all items and append to create seamless loop
    const items = Array.from(this.track.children);
    items.forEach((item) => {
      const clone = item.cloneNode(true);
      this.track.appendChild(clone);
    });

    // Add pause on hover functionality
    this.track.addEventListener("mouseenter", () => {
      this.track.style.animationPlayState = "paused";
    });

    this.track.addEventListener("mouseleave", () => {
      this.track.style.animationPlayState = "running";
    });

    // Adjust speed on window resize
    window.addEventListener("resize", () => this.adjustSpeed());
    this.adjustSpeed();
  }

  /**
   * Adjust animation speed based on viewport width
   * Faster on mobile for better UX
   *
   * @private
   */
  adjustSpeed() {
    const viewportWidth = window.innerWidth;
    let duration = 60; // Default: 60 seconds

    if (viewportWidth < 768) {
      duration = 40; // Faster on mobile
    } else if (viewportWidth < 1024) {
      duration = 50; // Medium on tablets
    }

    this.track.style.animationDuration = `${duration}s`;
  }
}

/* ===================================================================
   2. SCROLL ANIMATIONS
   ===================================================================
   Animate elements on scroll for engaging UX
   =================================================================== */

/**
 * ScrollAnimations Class
 * Handles scroll-triggered animations for cards and sections
 *
 * @class
 */
class ScrollAnimations {
  /**
   * Creates a ScrollAnimations instance
   */
  constructor() {
    this.elements = document.querySelectorAll(
      ".category-card, .platform-card, .ai-model-card, .privacy-feature, .step-item",
    );
    this.init();
  }

  /**
   * Initialize scroll observer
   * Uses Intersection Observer API for performance
   *
   * @private
   */
  init() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animation for visual appeal
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 50);

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Prepare elements for animation
    this.elements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });
  }
}

/* ===================================================================
   3. SECTION NAVIGATION
   ===================================================================
   Smooth scrolling and navigation helpers
   =================================================================== */

/**
 * Scroll to a specific section smoothly
 *
 * @param {string} sectionId - ID of section to scroll to
 * @global
 */
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const navHeight = 80; // Height of sticky navbar
    const targetPosition = element.offsetTop - navHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    // Track navigation event
    trackEvent("navigation", "scroll_to_section", sectionId);
  }
}

/**
 * Add smooth scrolling to all anchor links
 *
 * @private
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href === "#" || href === "#!") {
        e.preventDefault();
        return;
      }

      const targetId = href.substring(1);
      const target = document.getElementById(targetId);

      if (target) {
        e.preventDefault();
        scrollToSection(targetId);
      }
    });
  });
}

/* ===================================================================
   4. ANALYTICS TRACKING
   ===================================================================
   Track user interactions for insights (optional)
   =================================================================== */

/**
 * Track custom events
 *
 * @param {string} category - Event category
 * @param {string} action - Event action
 * @param {string} label - Event label
 * @private
 */
function trackEvent(category, action, label) {
  // Log to console in development
  console.log(`Event: ${category} - ${action} - ${label}`);

  // TODO: Integrate with actual analytics service
  // Example for Google Analytics:
  // if (typeof gtag !== 'undefined') {
  //     gtag('event', action, {
  //         'event_category': category,
  //         'event_label': label
  //     });
  // }
}

/**
 * Track platform card interactions
 *
 * @private
 */
function trackPlatformInteractions() {
  const platformCards = document.querySelectorAll(".platform-card");

  platformCards.forEach((card) => {
    card.addEventListener("click", () => {
      const platformName = card.querySelector(".platform-name")?.textContent;
      if (platformName) {
        trackEvent("integrations", "platform_card_click", platformName);
      }
    });
  });
}

/**
 * Track CTA button clicks
 *
 * @private
 */
function trackCTAClicks() {
  const ctaButtons = document.querySelectorAll(".btn-primary, .btn-secondary");

  ctaButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const buttonText = button.textContent.trim();
      trackEvent("conversion", "cta_click", buttonText);
    });
  });
}

/* ===================================================================
   5. INTERACTIVE ELEMENTS
   ===================================================================
   Enhanced interactivity for category cards
   =================================================================== */

/**
 * CategoryInteractions Class
 * Handles interactive filtering and highlighting
 *
 * @class
 */
class CategoryInteractions {
  /**
   * Creates a CategoryInteractions instance
   */
  constructor() {
    this.categoryCards = document.querySelectorAll(".category-card");
    this.init();
  }

  /**
   * Initialize category interactions
   *
   * @private
   */
  init() {
    this.categoryCards.forEach((card) => {
      card.addEventListener("click", () => this.handleCategoryClick(card));
    });
  }

  /**
   * Handle category card click
   * Scrolls to relevant section
   *
   * @param {HTMLElement} card - Clicked card element
   * @private
   */
  handleCategoryClick(card) {
    const category = card.dataset.category;

    // Map categories to sections
    const sectionMap = {
      lms: "platforms-section",
      ai: "ai-models-section",
      tools: "platforms-section", // Could be separate section
    };

    const targetSection = sectionMap[category];
    if (targetSection) {
      scrollToSection(targetSection);
      trackEvent("navigation", "category_card_click", category);
    }
  }
}

/* ===================================================================
   6. PARALLAX EFFECTS
   ===================================================================
   Subtle parallax for hero background shapes
   =================================================================== */

/**
 * ParallaxEffects Class
 * Adds subtle parallax scrolling to hero shapes
 *
 * @class
 */
class ParallaxEffects {
  /**
   * Creates a ParallaxEffects instance
   */
  constructor() {
    this.shapes = document.querySelectorAll(".floating-shape");
    this.init();
  }

  /**
   * Initialize parallax effects
   *
   * @private
   */
  init() {
    if (this.shapes.length === 0) return;

    window.addEventListener("scroll", () => this.handleScroll());
  }

  /**
   * Handle scroll event for parallax
   *
   * @private
   */
  handleScroll() {
    const scrolled = window.pageYOffset;

    this.shapes.forEach((shape, index) => {
      const speed = (index + 1) * 0.05;
      const yPos = -(scrolled * speed);
      shape.style.transform = `translateY(${yPos}px)`;
    });
  }
}

/* ===================================================================
   7. PLATFORM CARD HOVER EFFECTS
   ===================================================================
   Enhanced hover effects for platform cards
   =================================================================== */

/**
 * PlatformCardEffects Class
 * Adds enhanced hover effects to platform cards
 *
 * @class
 */
class PlatformCardEffects {
  /**
   * Creates a PlatformCardEffects instance
   */
  constructor() {
    this.cards = document.querySelectorAll(".platform-card, .ai-model-card");
    this.init();
  }

  /**
   * Initialize card effects
   *
   * @private
   */
  init() {
    this.cards.forEach((card) => {
      card.addEventListener("mouseenter", (e) => this.handleMouseEnter(e));
      card.addEventListener("mousemove", (e) => this.handleMouseMove(e));
      card.addEventListener("mouseleave", (e) => this.handleMouseLeave(e));
    });
  }

  /**
   * Handle mouse enter event
   *
   * @param {Event} e - Mouse event
   * @private
   */
  handleMouseEnter(e) {
    const card = e.currentTarget;
    card.style.transition = "transform 0.1s ease";
  }

  /**
   * Handle mouse move for tilt effect
   *
   * @param {Event} e - Mouse event
   * @private
   */
  handleMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  }

  /**
   * Handle mouse leave event
   *
   * @param {Event} e - Mouse event
   * @private
   */
  handleMouseLeave(e) {
    const card = e.currentTarget;
    card.style.transition = "transform 0.5s ease";
    card.style.transform = "";
  }
}

/* ===================================================================
   8. INITIALIZATION
   ===================================================================
   Initialize all components when DOM is ready
   =================================================================== */

/**
 * Initialize integrations page
 * Called when DOM is fully loaded
 */
function initializeIntegrationsPage() {
  console.log("🔗 StudyFlow Integrations Page initialized");

  // Initialize all managers
  new SlideshowManager();
  new ScrollAnimations();
  new CategoryInteractions();
  new ParallaxEffects();
  new PlatformCardEffects();

  // Initialize navigation
  initSmoothScrolling();

  // Track interactions
  trackPlatformInteractions();
  trackCTAClicks();

  // Add entrance animation to hero
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    heroContent.style.opacity = "0";
    heroContent.style.transform = "translateY(30px)";

    setTimeout(() => {
      heroContent.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      heroContent.style.opacity = "1";
      heroContent.style.transform = "translateY(0)";
    }, 100);
  }

  // Track page view
  trackEvent("pageview", "integrations_page", window.location.pathname);

  console.log("✨ All components loaded successfully");
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeIntegrationsPage);
} else {
  initializeIntegrationsPage();
}

// Handle window resize for responsive adjustments
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    console.log("Window resized - adjusting layout");
    // Trigger any necessary recalculations
  }, 250);
});

// Export for module use if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    SlideshowManager,
    ScrollAnimations,
    CategoryInteractions,
    ParallaxEffects,
    PlatformCardEffects,
    scrollToSection,
  };
}
