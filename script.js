/**
 * @author Mugisha Sangwa Olivier Ishimwe
 * 
 */


// ===================================
// THEME CUSTOMIZER
// ===================================

class ThemeCustomizer {
  constructor() {
    this.customizerToggle = document.getElementById("customizerToggle");
    this.customizerPanel = document.getElementById("customizerPanel");
    this.customizerClose = document.getElementById("customizerClose");
    this.themePresets = document.querySelectorAll(".theme-preset");
    this.primaryColorPicker = document.getElementById("primaryColorPicker");
    this.paletteColors = document.querySelectorAll(".palette-color");
    this.modeButtons = document.querySelectorAll(".mode-btn");
    this.resetButton = document.getElementById("resetTheme");

    this.defaultTheme = {
      primary: "#0066cc",
      secondary: "#004d99",
      accent: "#00bfff",
      highlight: "#ffd700",
      mode: "light",
    };

    this.init();
  }

  init() {
    // Load saved theme
    this.loadTheme();

    // Event listeners
    this.customizerToggle.addEventListener("click", () => this.togglePanel());
    this.customizerClose.addEventListener("click", () => this.closePanel());

    this.themePresets.forEach((preset) => {
      preset.addEventListener("click", (e) =>
        this.applyPreset(e.currentTarget),
      );
    });

    this.primaryColorPicker.addEventListener("input", (e) => {
      this.updatePrimaryColor(e.target.value);
    });

    this.paletteColors.forEach((input) => {
      input.addEventListener("input", (e) => {
        this.updateColor(e.target.dataset.var, e.target.value);
      });
    });

    this.modeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => this.toggleMode(e.currentTarget));
    });

    this.resetButton.addEventListener("click", () => this.resetTheme());

    // Close panel on outside click
    document.addEventListener("click", (e) => {
      if (
        !this.customizerPanel.contains(e.target) &&
        !this.customizerToggle.contains(e.target) &&
        this.customizerPanel.classList.contains("active")
      ) {
        this.closePanel();
      }
    });
  }

  togglePanel() {
    this.customizerPanel.classList.toggle("active");
  }

  closePanel() {
    this.customizerPanel.classList.remove("active");
  }

  applyPreset(presetElement) {
    const theme = presetElement.dataset.theme;

    // Remove active class from all presets
    this.themePresets.forEach((p) => p.classList.remove("active"));
    presetElement.classList.add("active");

    // Define preset color schemes
    const presets = {
      "ocean-blue": {
        primary: "#0066cc",
        secondary: "#004d99",
        accent: "#00bfff",
        highlight: "#ffd700",
      },
      midnight: {
        primary: "#1a1a2e",
        secondary: "#0f0f1e",
        accent: "#4a4a6a",
        highlight: "#ff6b6b",
      },
      forest: {
        primary: "#2d5a3d",
        secondary: "#1e3d2b",
        accent: "#4caf50",
        highlight: "#8bc34a",
      },
      sunset: {
        primary: "#ff6b6b",
        secondary: "#ee5a6f",
        accent: "#ffa07a",
        highlight: "#ffd700",
      },
      lavender: {
        primary: "#8b5cf6",
        secondary: "#6d28d9",
        accent: "#a78bfa",
        highlight: "#c4b5fd",
      },
    };

    const colors = presets[theme];

    if (colors) {
      this.updateColor("--primary-color", colors.primary);
      this.updateColor("--secondary-color", colors.secondary);
      this.updateColor("--accent-color", colors.accent);
      this.updateColor("--highlight-color", colors.highlight);

      // Update color pickers to match
      this.primaryColorPicker.value = colors.primary;
      this.paletteColors.forEach((input) => {
        const varName = input.dataset.var;
        if (varName === "--primary-color") input.value = colors.primary;
        if (varName === "--secondary-color") input.value = colors.secondary;
        if (varName === "--accent-color") input.value = colors.accent;
        if (varName === "--highlight-color") input.value = colors.highlight;
      });

      this.saveTheme();
    }
  }

  updatePrimaryColor(color) {
    this.updateColor("--primary-color", color);

    // Generate harmonious colors
    const rgb = this.hexToRgb(color);
    const darker = this.darkenColor(rgb, 20);
    const lighter = this.lightenColor(rgb, 30);

    this.updateColor("--primary-dark", this.rgbToHex(darker));
    this.updateColor("--primary-light", this.rgbToHex(lighter));

    this.saveTheme();
  }

  updateColor(variable, value) {
    document.documentElement.style.setProperty(variable, value);
    this.saveTheme();
  }

  toggleMode(button) {
    const mode = button.dataset.mode;

    // Remove active class from all mode buttons
    this.modeButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Apply theme
    if (mode === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    this.saveTheme();
  }

  resetTheme() {
    // Reset to default theme
    this.updateColor("--primary-color", this.defaultTheme.primary);
    this.updateColor("--secondary-color", this.defaultTheme.secondary);
    this.updateColor("--accent-color", this.defaultTheme.accent);
    this.updateColor("--highlight-color", this.defaultTheme.highlight);

    // Reset color pickers
    this.primaryColorPicker.value = this.defaultTheme.primary;
    this.paletteColors.forEach((input) => {
      if (input.dataset.var === "--primary-color")
        input.value = this.defaultTheme.primary;
      if (input.dataset.var === "--secondary-color")
        input.value = this.defaultTheme.secondary;
      if (input.dataset.var === "--accent-color")
        input.value = this.defaultTheme.accent;
      if (input.dataset.var === "--highlight-color")
        input.value = this.defaultTheme.highlight;
    });

    // Reset mode
    document.documentElement.removeAttribute("data-theme");
    this.modeButtons.forEach((btn) => {
      if (btn.dataset.mode === "light") {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Reset preset selection
    this.themePresets.forEach((preset) => {
      if (preset.dataset.theme === "ocean-blue") {
        preset.classList.add("active");
      } else {
        preset.classList.remove("active");
      }
    });

    localStorage.removeItem("studyflow-theme");

    // Show confirmation
    this.showNotification("Theme reset to default");
  }

  saveTheme() {
    const theme = {
      primary: getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-color")
        .trim(),
      secondary: getComputedStyle(document.documentElement)
        .getPropertyValue("--secondary-color")
        .trim(),
      accent: getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-color")
        .trim(),
      highlight: getComputedStyle(document.documentElement)
        .getPropertyValue("--highlight-color")
        .trim(),
      mode: document.documentElement.getAttribute("data-theme") || "light",
    };

    localStorage.setItem("studyflow-theme", JSON.stringify(theme));
  }

  loadTheme() {
    const savedTheme = localStorage.getItem("studyflow-theme");

    if (savedTheme) {
      const theme = JSON.parse(savedTheme);

      this.updateColor("--primary-color", theme.primary);
      this.updateColor("--secondary-color", theme.secondary);
      this.updateColor("--accent-color", theme.accent);
      this.updateColor("--highlight-color", theme.highlight);

      // Update color pickers
      this.primaryColorPicker.value = theme.primary;
      this.paletteColors.forEach((input) => {
        if (input.dataset.var === "--primary-color")
          input.value = theme.primary;
        if (input.dataset.var === "--secondary-color")
          input.value = theme.secondary;
        if (input.dataset.var === "--accent-color") input.value = theme.accent;
        if (input.dataset.var === "--highlight-color")
          input.value = theme.highlight;
      });

      // Apply mode
      if (theme.mode === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        this.modeButtons.forEach((btn) => {
          if (btn.dataset.mode === "dark") {
            btn.classList.add("active");
          } else {
            btn.classList.remove("active");
          }
        });
      }
    }
  }

  // Color utility functions
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  rgbToHex(rgb) {
    return (
      "#" +
      ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)
    );
  }

  darkenColor(rgb, percent) {
    return {
      r: Math.max(0, Math.floor((rgb.r * (100 - percent)) / 100)),
      g: Math.max(0, Math.floor((rgb.g * (100 - percent)) / 100)),
      b: Math.max(0, Math.floor((rgb.b * (100 - percent)) / 100)),
    };
  }

  lightenColor(rgb, percent) {
    return {
      r: Math.min(255, Math.floor(rgb.r + ((255 - rgb.r) * percent) / 100)),
      g: Math.min(255, Math.floor(rgb.g + ((255 - rgb.g) * percent) / 100)),
      b: Math.min(255, Math.floor(rgb.b + ((255 - rgb.b) * percent) / 100)),
    };
  }

  showNotification(message) {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            animation: slideInUp 0.3s ease-out;
        `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = "slideOutDown 0.3s ease-out";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
}

// ===================================
// SMOOTH SCROLLING
// ===================================

class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href");

        // Skip if href is just "#"
        if (href === "#") {
          e.preventDefault();
          return;
        }

        const target = document.querySelector(href);

        if (target) {
          e.preventDefault();
          const offsetTop = target.offsetTop - 80; // Account for fixed navbar

          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      });
    });
  }
}

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================

class NavbarScroll {
  constructor() {
    this.navbar = document.querySelector(".navbar");
    this.init();
  }

  init() {
    let lastScroll = 0;

    window.addEventListener("scroll", () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        this.navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
      } else {
        this.navbar.style.boxShadow = "none";
      }

      lastScroll = currentScroll;
    });
  }
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

class ScrollAnimations {
  constructor() {
    this.elements = document.querySelectorAll(
      ".feature-card, .step, .pricing-card",
    );
    this.init();
  }

  init() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "0";
          entry.target.style.transform = "translateY(30px)";

          setTimeout(() => {
            entry.target.style.transition =
              "opacity 0.6s ease, transform 0.6s ease";
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, 100);

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    this.elements.forEach((el) => observer.observe(el));
  }
}

// ===================================
// COUNTER ANIMATION
// ===================================

class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll(".stat-number");
    this.init();
  }

  init() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    this.counters.forEach((counter) => observer.observe(counter));
  }

  animateCounter(element) {
    const target = element.textContent;
    const isNumber = /^\d+/.test(target);

    if (!isNumber) return;

    const match = target.match(/^(\d+)(.*)/);
    if (!match) return;

    const number = parseInt(match[1].replace(/,/g, ""));
    const suffix = match[2];
    const duration = 2000;
    const steps = 60;
    const increment = number / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= number) {
        element.textContent = this.formatNumber(number) + suffix;
        clearInterval(timer);
      } else {
        element.textContent = this.formatNumber(Math.floor(current)) + suffix;
      }
    }, duration / steps);
  }

  formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K+";
    }
    return num.toString();
  }
}

// ===================================
// PARALLAX EFFECT
// ===================================

class ParallaxEffect {
  constructor() {
    this.shapes = document.querySelectorAll(".shape");
    this.init();
  }

  init() {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;

      this.shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.1;
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px)`;
      });
    });
  }
}

// ===================================
// FORM VALIDATION (for future use)
// ===================================

class FormValidation {
  constructor() {
    this.forms = document.querySelectorAll("form");
    this.init();
  }

  init() {
    this.forms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.validateForm(form);
      });
    });
  }

  validateForm(form) {
    const inputs = form.querySelectorAll("input[required], textarea[required]");
    let isValid = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        isValid = false;
        this.showError(input, "This field is required");
      } else {
        this.clearError(input);
      }
    });

    if (isValid) {
      console.log("Form is valid! Ready to submit.");
      // Handle form submission here
    }
  }

  showError(input, message) {
    const errorElement = input.parentElement.querySelector(".error-message");
    if (errorElement) {
      errorElement.textContent = message;
    } else {
      const error = document.createElement("span");
      error.className = "error-message";
      error.textContent = message;
      error.style.cssText =
        "color: var(--error-color); font-size: 0.875rem; margin-top: 0.25rem;";
      input.parentElement.appendChild(error);
    }
    input.style.borderColor = "var(--error-color)";
  }

  clearError(input) {
    const errorElement = input.parentElement.querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
    }
    input.style.borderColor = "";
  }
}

// ===================================
// FEATURE CARDS TILT EFFECT
// ===================================

class TiltEffect {
  constructor() {
    this.cards = document.querySelectorAll(".feature-card, .pricing-card");
    this.init();
  }

  init() {
    this.cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }
}

// ===================================
// CURSOR TRAIL EFFECT (Optional)
// ===================================

class CursorTrail {
  constructor() {
    this.trail = [];
    this.maxTrail = 20;
    this.init();
  }

  init() {
    // Create trail elements
    for (let i = 0; i < this.maxTrail; i++) {
      const dot = document.createElement("div");
      dot.className = "cursor-trail";
      dot.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${1 - i / this.maxTrail};
                transition: opacity 0.3s ease;
            `;
      document.body.appendChild(dot);
      this.trail.push(dot);
    }

    // Track mouse movement
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Animate trail
    const animate = () => {
      let x = mouseX;
      let y = mouseY;

      this.trail.forEach((dot, index) => {
        const nextDot = this.trail[index + 1] || this.trail[0];

        dot.style.left = x + "px";
        dot.style.top = y + "px";

        x += (nextDot.offsetLeft - x) * 0.3;
        y += (nextDot.offsetTop - y) * 0.3;
      });

      requestAnimationFrame(animate);
    };

    animate();
  }
}

// ===================================
// TYPING EFFECT (for hero title)
// ===================================

class TypingEffect {
  constructor(element, text, speed = 50) {
    this.element = element;
    this.text = text;
    this.speed = speed;
    this.index = 0;
  }

  type() {
    if (this.index < this.text.length) {
      this.element.textContent += this.text.charAt(this.index);
      this.index++;
      setTimeout(() => this.type(), this.speed);
    }
  }

  start() {
    this.element.textContent = "";
    this.type();
  }
}

// ============================================================
// ABOUT SECTION ANIMATIONS
// ============================================================
// Brings the About section to life with scroll-triggered effects
// - Fades in MVG cards sequentially
// - Animates founder image on scroll
// - Smooth reveal of values section
// Inspired by storytelling - each element enters at the right time
// ============================================================

class AboutAnimations {
  constructor() {
    // ============================
    // DOM ELEMENT SELECTION
    // Grab all elements we need to animate
    // ============================
    this.mvgCards = document.querySelectorAll(".mvg-card");
    this.founderImage = document.querySelector(".founder-image");
    this.founderMessage = document.querySelector(".founder-message");
    this.valueItems = document.querySelectorAll(".value-item");
    this.aboutIntro = document.querySelector(".about-intro");

    this.init();
  }

  init() {
    // ============================
    // INTERSECTION OBSERVER SETUP
    // Watches when elements enter viewport
    // Triggers animations at the right time
    // ============================
    const observerOptions = {
      threshold: 0.15, // Element must be 15% visible
      rootMargin: "0px 0px -100px 0px", // Trigger slightly before fully visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // ========================
          // TRIGGER ANIMATION
          // Add 'animate-in' class when visible
          // ========================
          entry.target.classList.add("animate-in");

          // ========================
          // UNOBSERVE AFTER ANIMATION
          // Performance: stop watching once animated
          // ========================
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // ============================
    // ANIMATE INTRO SECTION
    // First element students see
    // ============================
    if (this.aboutIntro) {
      this.aboutIntro.style.opacity = "0";
      this.aboutIntro.style.transform = "translateY(40px)";
      observer.observe(this.aboutIntro);
    }

    // ============================
    // ANIMATE MVG CARDS
    // Staggered entrance for visual interest
    // Mission → Vision → Goals
    // ============================
    this.mvgCards.forEach((card, index) => {
      // Set initial state (invisible)
      card.style.opacity = "0";
      card.style.transform = "translateY(40px)";

      // Watch for scroll
      observer.observe(card);

      // ========================
      // STAGGER DELAY
      // Each card animates 150ms after previous
      // Creates smooth cascade effect
      // ========================
      card.style.transitionDelay = `${index * 0.15}s`;
    });

    // ============================
    // ANIMATE FOUNDER SECTION
    // Image and message work together
    // ============================
    if (this.founderImage) {
      this.founderImage.style.opacity = "0";
      this.founderImage.style.transform = "scale(0.9) translateX(-30px)";
      observer.observe(this.founderImage);
    }

    if (this.founderMessage) {
      this.founderMessage.style.opacity = "0";
      this.founderMessage.style.transform = "translateX(30px)";
      this.founderMessage.style.transitionDelay = "0.2s"; // Slight delay after image
      observer.observe(this.founderMessage);
    }

    // ============================
    // ANIMATE VALUE ITEMS
    // Bottom section - final impression
    // ============================
    this.valueItems.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(40px)";
      item.style.transitionDelay = `${index * 0.1}s`;
      observer.observe(item);
    });
  }
}

// ============================================================
// FOUNDER MESSAGE TYPING EFFECT (OPTIONAL)
// ============================================================
// Creates typewriter effect for founder's opening line
// Can be enabled for extra personality
// Currently disabled - uncomment in init to activate
// ============================================================

class FounderMessageTyping {
  constructor() {
    this.messageElement = document.querySelector(".message-paragraph.opening");
    if (!this.messageElement) return;

    // ============================
    // SAVE ORIGINAL TEXT
    // Store before we clear it
    // ============================
    this.originalText = this.messageElement.textContent;
    this.currentIndex = 0;
    this.typingSpeed = 50; // milliseconds per character

    // ============================
    // WAIT FOR SCROLL
    // Only start typing when visible
    // ============================
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.startTyping();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 },
    );

    observer.observe(this.messageElement);
  }

  // ================================
  // TYPING ANIMATION
  // Reveals text character by character
  // ================================
  startTyping() {
    // Clear text first
    this.messageElement.textContent = "";

    // ============================
    // ADD CURSOR EFFECT
    // Blinking cursor while typing
    // ============================
    this.messageElement.style.borderRight = "3px solid var(--primary-color)";

    // ============================
    // TYPE EACH CHARACTER
    // Recursive function with delay
    // ============================
    const typeNextChar = () => {
      if (this.currentIndex < this.originalText.length) {
        this.messageElement.textContent += this.originalText.charAt(
          this.currentIndex,
        );
        this.currentIndex++;
        setTimeout(typeNextChar, this.typingSpeed);
      } else {
        // ========================
        // REMOVE CURSOR WHEN DONE
        // Animation complete
        // ========================
        setTimeout(() => {
          this.messageElement.style.borderRight = "none";
        }, 500);
      }
    };

    typeNextChar();
  }
}

// ============================================================
// FOUNDER IMAGE PARALLAX
// ============================================================
// Subtle movement effect on founder photo as user scrolls
// Creates depth and visual interest
// ============================================================

class FounderImageParallax {
  constructor() {
    this.founderImage = document.querySelector(".founder-image");
    if (!this.founderImage) return;

    this.init();
  }

  init() {
    // ============================
    // THROTTLED SCROLL LISTENER
    // Performance: update max 60fps
    // ============================
    let ticking = false;

    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // ================================
  // CALCULATE PARALLAX OFFSET
  // Move image based on scroll position
  // ================================
  updateParallax() {
    const rect = this.founderImage.getBoundingClientRect();
    const scrollPercent =
      (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

    // ============================
    // APPLY TRANSFORM
    // Subtle movement - don't overdo it
    // ============================
    if (scrollPercent >= 0 && scrollPercent <= 1) {
      const yOffset = (scrollPercent - 0.5) * 20; // Max 10px movement
      this.founderImage.style.transform = `translateY(${yOffset}px)`;
    }
  }
}

// ============================================================
// MVG CARD PROGRESS INDICATORS
// ============================================================
// Visual feedback showing which MVG section is in focus
// Highlights active card as user scrolls
// ============================================================

class MVGProgressIndicator {
  constructor() {
    this.mvgCards = document.querySelectorAll(".mvg-card");
    if (this.mvgCards.length === 0) return;

    this.init();
  }

  init() {
    // ============================
    // OBSERVER FOR EACH CARD
    // Tracks which card is most visible
    // ============================
    const observerOptions = {
      threshold: [0.5], // Card must be 50% visible
      rootMargin: "-20% 0px -20% 0px", // Focus on middle of viewport
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // ========================
          // HIGHLIGHT ACTIVE CARD
          // Remove highlight from others
          // ========================
          this.mvgCards.forEach((card) => {
            card.classList.remove("mvg-active");
          });

          entry.target.classList.add("mvg-active");
        }
      });
    }, observerOptions);

    this.mvgCards.forEach((card) => observer.observe(card));
  }
}

// ============================================================
// INITIALIZE ALL COMPONENTS
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // Initialize theme customizer
  new ThemeCustomizer();

  // Initialize smooth scrolling
  new SmoothScroll();

  // Initialize navbar scroll effect
  new NavbarScroll();

  // Initialize scroll animations
  new ScrollAnimations();

  // Initialize counter animations
  new CounterAnimation();

  // Initialize parallax effect
  new ParallaxEffect();

  // Initialize form validation
  new FormValidation();

  // Initialize tilt effect on cards
  new TiltEffect();

  // ============================================
  // INITIALIZE ABOUT SECTION FEATURES
  // New animations specifically for About page
  // ============================================
  new AboutAnimations();
  new FounderImageParallax();
  new MVGProgressIndicator();

  // ============================================
  // OPTIONAL: FOUNDER MESSAGE TYPING
  // Uncomment below to enable typewriter effect
  // ============================================
  // new FounderMessageTyping();

  // Optional: Initialize cursor trail (uncomment to enable)
  // new CursorTrail();

  // Add keyboard navigation for accessibility
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const customizerPanel = document.getElementById("customizerPanel");
      if (customizerPanel.classList.contains("active")) {
        customizerPanel.classList.remove("active");
      }
    }
  });

  // Add animations to CSS
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideInUp {
            from {
                transform: translateY(100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutDown {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(100%);
                opacity: 0;
            }
        }
        
        .notification {
            font-family: var(--font-body);
            font-weight: 500;
        }
        
        /* ========================================
           ABOUT SECTION ANIMATION STATES
           Applied when elements become visible
           ======================================== */
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .founder-image.animate-in {
            transform: scale(1) translateX(0) !important;
        }
        
        .founder-message.animate-in {
            transform: translateX(0) !important;
        }
        
        /* ========================================
           MVG ACTIVE STATE
           Highlight for focused card
           ======================================== */
        
        .mvg-card.mvg-active {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
        }
        
        /* ========================================
           SMOOTH TRANSITIONS
           Applied to animated elements
           ======================================== */
        
        .about-intro,
        .mvg-card,
        .founder-image,
        .founder-message,
        .value-item {
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
    `;
  document.head.appendChild(style);

  console.log("✨ StudyFlow initialized successfully!");
  console.log("📚 About section animations loaded");
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Export for module use if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ThemeCustomizer,
    SmoothScroll,
    NavbarScroll,
    ScrollAnimations,
    CounterAnimation,
    ParallaxEffect,
    FormValidation,
    TiltEffect,
    CursorTrail,
    TypingEffect,
  };
}
