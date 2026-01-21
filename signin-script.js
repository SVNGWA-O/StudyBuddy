/**
 * ====================================================================
 * STUDYFLOW SIGN-IN PAGE JAVASCRIPT
 * ====================================================================
 * @file signin-script.js
 * @description Handles all authentication interactions and validations
 * @author StudyFlow Team
 * @version 2.0.0
 *
 * FEATURES:
 * - Multi-method authentication (Email, Phone, OAuth)
 * - Real-time form validation
 * - Theme customization persistence
 * - Loading states and error handling
 * - Accessibility enhancements
 * - Toast notification system
 *
 * TABLE OF CONTENTS:
 * 1. Theme Manager
 * 2. Form Validation
 * 3. Authentication Handlers
 * 4. UI Components
 * 5. Utility Functions
 * 6. Initialization
 * ====================================================================
 */

"use strict";

/* ===================================================================
   1. THEME MANAGER
   ===================================================================
   Handles theme customization and persistence
   =================================================================== */

/**
 * ThemeManager Class
 * Manages color themes, dark mode, and persistence to localStorage
 *
 * @class
 * @example
 * const themeManager = new ThemeManager();
 */
class ThemeManager {
  /**
   * Creates a ThemeManager instance
   * Initializes event listeners and loads saved theme
   */
  constructor() {
    // DOM Elements
    this.customizerToggle = document.getElementById("customizerToggle");
    this.customizerPanel = document.getElementById("customizerPanel");
    this.customizerClose = document.getElementById("customizerClose");
    this.colorPresets = document.querySelectorAll(".color-preset");
    this.customColorInput = document.getElementById("customColorInput");
    this.modeButtons = document.querySelectorAll(".mode-btn");

    // Default theme values
    this.defaultColor = "#0066cc";

    this.init();
  }

  /**
   * Initialize theme manager
   * Sets up event listeners and loads saved preferences
   *
   * @private
   */
  init() {
    this.loadSavedTheme();
    this.attachEventListeners();
  }

  /**
   * Attach all event listeners
   *
   * @private
   */
  attachEventListeners() {
    // Toggle customizer panel
    this.customizerToggle.addEventListener("click", () => this.togglePanel());
    this.customizerClose.addEventListener("click", () => this.closePanel());

    // Color preset buttons
    this.colorPresets.forEach((preset) => {
      preset.addEventListener("click", (e) =>
        this.applyPreset(e.currentTarget),
      );
    });

    // Custom color input
    this.customColorInput.addEventListener("input", (e) => {
      this.applyColor(e.target.value);
    });

    // Mode toggle buttons
    this.modeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => this.toggleMode(e.currentTarget));
    });

    // Close panel when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !this.customizerPanel.contains(e.target) &&
        !this.customizerToggle.contains(e.target) &&
        this.customizerPanel.classList.contains("active")
      ) {
        this.closePanel();
      }
    });

    // Keyboard accessibility
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        this.customizerPanel.classList.contains("active")
      ) {
        this.closePanel();
      }
    });
  }

  /**
   * Toggle customizer panel visibility
   *
   * @public
   */
  togglePanel() {
    this.customizerPanel.classList.toggle("active");
  }

  /**
   * Close customizer panel
   *
   * @public
   */
  closePanel() {
    this.customizerPanel.classList.remove("active");
  }

  /**
   * Apply a color preset theme
   *
   * @param {HTMLElement} presetElement - The clicked preset button
   * @public
   */
  applyPreset(presetElement) {
    const color = presetElement.dataset.color;

    // Update active state
    this.colorPresets.forEach((p) => p.classList.remove("active"));
    presetElement.classList.add("active");

    // Apply color
    this.applyColor(color);

    // Update custom color input
    this.customColorInput.value = color;
  }

  /**
   * Apply a custom color
   * Updates CSS variables and generates harmonious shades
   *
   * @param {string} color - Hex color value
   * @public
   */
  applyColor(color) {
    // Set primary color
    document.documentElement.style.setProperty("--primary-color", color);

    // Generate and set harmonious colors
    const rgb = this.hexToRgb(color);
    const darker = this.adjustBrightness(rgb, -20);
    const lighter = this.adjustBrightness(rgb, 20);
    const hover = this.adjustBrightness(rgb, -10);

    document.documentElement.style.setProperty(
      "--primary-dark",
      this.rgbToHex(darker),
    );
    document.documentElement.style.setProperty(
      "--primary-light",
      this.rgbToHex(lighter),
    );
    document.documentElement.style.setProperty(
      "--primary-hover",
      this.rgbToHex(hover),
    );

    // Save to localStorage
    this.saveTheme();
  }

  /**
   * Toggle between light and dark mode
   *
   * @param {HTMLElement} button - The clicked mode button
   * @public
   */
  toggleMode(button) {
    const mode = button.dataset.mode;

    // Update button states
    this.modeButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Apply theme
    if (mode === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    // Save preference
    this.saveTheme();
  }

  /**
   * Save current theme to localStorage
   *
   * @private
   */
  saveTheme() {
    const theme = {
      color: getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-color")
        .trim(),
      mode: document.documentElement.getAttribute("data-theme") || "light",
    };

    localStorage.setItem("studyflow-theme", JSON.stringify(theme));
  }

  /**
   * Load saved theme from localStorage
   *
   * @private
   */
  loadSavedTheme() {
    const savedTheme = localStorage.getItem("studyflow-theme");

    if (savedTheme) {
      const theme = JSON.parse(savedTheme);

      // Apply saved color
      this.applyColor(theme.color);
      this.customColorInput.value = theme.color;

      // Update preset selection
      this.colorPresets.forEach((preset) => {
        if (preset.dataset.color === theme.color) {
          preset.classList.add("active");
        } else {
          preset.classList.remove("active");
        }
      });

      // Apply saved mode
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

  /**
   * Convert hex color to RGB object
   *
   * @param {string} hex - Hex color value
   * @returns {Object} RGB object {r, g, b}
   * @private
   */
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

  /**
   * Convert RGB object to hex color
   *
   * @param {Object} rgb - RGB object {r, g, b}
   * @returns {string} Hex color value
   * @private
   */
  rgbToHex(rgb) {
    return (
      "#" +
      ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)
    );
  }

  /**
   * Adjust color brightness
   *
   * @param {Object} rgb - RGB object {r, g, b}
   * @param {number} percent - Brightness adjustment (-100 to 100)
   * @returns {Object} Adjusted RGB object
   * @private
   */
  adjustBrightness(rgb, percent) {
    return {
      r: Math.max(
        0,
        Math.min(255, Math.floor(rgb.r + (rgb.r * percent) / 100)),
      ),
      g: Math.max(
        0,
        Math.min(255, Math.floor(rgb.g + (rgb.g * percent) / 100)),
      ),
      b: Math.max(
        0,
        Math.min(255, Math.floor(rgb.b + (rgb.b * percent) / 100)),
      ),
    };
  }
}

/* ===================================================================
   2. FORM VALIDATION
   ===================================================================
   Real-time validation for email and phone inputs
   =================================================================== */

/**
 * FormValidator Class
 * Handles input validation and error display
 *
 * @class
 */
class FormValidator {
  /**
   * Validation rules and error messages
   */
  static rules = {
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
    password: {
      minLength: 8,
      message: "Password must be at least 8 characters long",
    },
    phone: {
      pattern: /^[\d\s\-\(\)]+$/,
      minLength: 10,
      message: "Please enter a valid phone number",
    },
  };

  /**
   * Validate email address
   *
   * @param {string} email - Email to validate
   * @returns {Object} Validation result {isValid, message}
   * @static
   */
  static validateEmail(email) {
    if (!email || email.trim() === "") {
      return { isValid: false, message: "Email is required" };
    }

    if (!this.rules.email.pattern.test(email)) {
      return { isValid: false, message: this.rules.email.message };
    }

    return { isValid: true, message: "" };
  }

  /**
   * Validate password
   *
   * @param {string} password - Password to validate
   * @returns {Object} Validation result {isValid, message}
   * @static
   */
  static validatePassword(password) {
    if (!password || password.trim() === "") {
      return { isValid: false, message: "Password is required" };
    }

    if (password.length < this.rules.password.minLength) {
      return { isValid: false, message: this.rules.password.message };
    }

    return { isValid: true, message: "" };
  }

  /**
   * Validate phone number
   *
   * @param {string} phone - Phone number to validate
   * @returns {Object} Validation result {isValid, message}
   * @static
   */
  static validatePhone(phone) {
    if (!phone || phone.trim() === "") {
      return { isValid: false, message: "Phone number is required" };
    }

    const digitsOnly = phone.replace(/\D/g, "");

    if (digitsOnly.length < this.rules.phone.minLength) {
      return { isValid: false, message: this.rules.phone.message };
    }

    if (!this.rules.phone.pattern.test(phone)) {
      return { isValid: false, message: this.rules.phone.message };
    }

    return { isValid: true, message: "" };
  }

  /**
   * Display validation error
   *
   * @param {HTMLElement} input - Input element
   * @param {string} message - Error message
   * @static
   */
  static showError(input, message) {
    const errorElement = document.getElementById(`${input.id}Error`);

    input.classList.add("error");
    input.setAttribute("aria-invalid", "true");

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.setAttribute("role", "alert");
    }

    // Shake animation
    input.parentElement.classList.add("shake");
    setTimeout(() => {
      input.parentElement.classList.remove("shake");
    }, 500);
  }

  /**
   * Clear validation error
   *
   * @param {HTMLElement} input - Input element
   * @static
   */
  static clearError(input) {
    const errorElement = document.getElementById(`${input.id}Error`);

    input.classList.remove("error");
    input.removeAttribute("aria-invalid");

    if (errorElement) {
      errorElement.textContent = "";
    }
  }
}

/* ===================================================================
   3. AUTHENTICATION HANDLERS
   ===================================================================
   Handle form submissions and OAuth flows
   =================================================================== */

/**
 * AuthenticationManager Class
 * Manages authentication flows and API calls
 *
 * @class
 */
class AuthenticationManager {
  /**
   * Creates an AuthenticationManager instance
   */
  constructor() {
    this.emailForm = document.getElementById("emailForm");
    this.phoneForm = document.getElementById("phoneForm");
    this.authTabs = document.querySelectorAll(".auth-tab");

    this.init();
  }

  /**
   * Initialize authentication manager
   *
   * @private
   */
  init() {
    this.attachFormListeners();
    this.attachTabListeners();
    this.attachSocialAuthListeners();
    this.attachPasswordToggle();
    this.attachPhoneFormatting();
  }

  /**
   * Attach form submission listeners
   *
   * @private
   */
  attachFormListeners() {
    // Email form
    this.emailForm.addEventListener("submit", (e) => this.handleEmailSubmit(e));

    // Phone form
    this.phoneForm.addEventListener("submit", (e) => this.handlePhoneSubmit(e));

    // Real-time validation
    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");
    const phoneInput = document.getElementById("phoneInput");

    emailInput.addEventListener("blur", () =>
      this.validateEmailInput(emailInput),
    );
    passwordInput.addEventListener("blur", () =>
      this.validatePasswordInput(passwordInput),
    );
    phoneInput.addEventListener("blur", () =>
      this.validatePhoneInput(phoneInput),
    );

    // Clear errors on input
    emailInput.addEventListener("input", () =>
      FormValidator.clearError(emailInput),
    );
    passwordInput.addEventListener("input", () =>
      FormValidator.clearError(passwordInput),
    );
    phoneInput.addEventListener("input", () =>
      FormValidator.clearError(phoneInput),
    );
  }

  /**
   * Attach tab switching listeners
   *
   * @private
   */
  attachTabListeners() {
    this.authTabs.forEach((tab) => {
      tab.addEventListener("click", (e) => this.switchTab(e.currentTarget));
    });
  }

  /**
   * Attach social authentication button listeners
   *
   * @private
   */
  attachSocialAuthListeners() {
    const googleBtn = document.getElementById("googleSignIn");
    const facebookBtn = document.getElementById("facebookSignIn");
    const appleBtn = document.getElementById("appleSignIn");
    const microsoftBtn = document.getElementById("microsoftSignIn");

    googleBtn.addEventListener("click", () => this.handleGoogleAuth());
    facebookBtn.addEventListener("click", () => this.handleFacebookAuth());
    appleBtn.addEventListener("click", () => this.handleAppleAuth());
    microsoftBtn.addEventListener("click", () => this.handleMicrosoftAuth());
  }

  /**
   * Attach password visibility toggle
   *
   * @private
   */
  attachPasswordToggle() {
    const passwordToggle = document.getElementById("passwordToggle");
    const passwordInput = document.getElementById("passwordInput");
    const eyeIcon = passwordToggle.querySelector(".eye-icon");
    const eyeOffIcon = passwordToggle.querySelector(".eye-off-icon");

    passwordToggle.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";

      passwordInput.type = isPassword ? "text" : "password";
      eyeIcon.classList.toggle("hidden");
      eyeOffIcon.classList.toggle("hidden");

      passwordToggle.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password",
      );
    });
  }

  /**
   * Attach phone number auto-formatting
   *
   * @private
   */
  attachPhoneFormatting() {
    const phoneInput = document.getElementById("phoneInput");

    phoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");

      // Format as (XXX) XXX-XXXX
      if (value.length > 0) {
        if (value.length <= 3) {
          value = `(${value}`;
        } else if (value.length <= 6) {
          value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
          value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
      }

      e.target.value = value;
    });
  }

  /**
   * Switch between email and phone tabs
   *
   * @param {HTMLElement} tab - Clicked tab element
   * @private
   */
  switchTab(tab) {
    const targetForm = tab.dataset.tab;

    // Update tab states
    this.authTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    // Switch forms
    document.querySelectorAll(".auth-form").forEach((form) => {
      form.classList.remove("active");
    });

    const formToShow = document.querySelector(`[data-form="${targetForm}"]`);
    if (formToShow) {
      formToShow.classList.add("active");
    }
  }

  /**
   * Validate email input
   *
   * @param {HTMLElement} input - Email input element
   * @private
   */
  validateEmailInput(input) {
    const result = FormValidator.validateEmail(input.value);

    if (!result.isValid) {
      FormValidator.showError(input, result.message);
    }

    return result.isValid;
  }

  /**
   * Validate password input
   *
   * @param {HTMLElement} input - Password input element
   * @private
   */
  validatePasswordInput(input) {
    const result = FormValidator.validatePassword(input.value);

    if (!result.isValid) {
      FormValidator.showError(input, result.message);
    }

    return result.isValid;
  }

  /**
   * Validate phone input
   *
   * @param {HTMLElement} input - Phone input element
   * @private
   */
  validatePhoneInput(input) {
    const result = FormValidator.validatePhone(input.value);

    if (!result.isValid) {
      FormValidator.showError(input, result.message);
    }

    return result.isValid;
  }

  /**
   * Handle email form submission
   *
   * @param {Event} e - Submit event
   * @private
   */
  async handleEmailSubmit(e) {
    e.preventDefault();

    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");
    const submitBtn = e.target.querySelector(".submit-btn");

    // Validate inputs
    const emailValid = this.validateEmailInput(emailInput);
    const passwordValid = this.validatePasswordInput(passwordInput);

    if (!emailValid || !passwordValid) {
      return;
    }

    // Show loading state
    this.setLoadingState(submitBtn, true);

    try {
      // Simulate API call
      await this.authenticateWithEmail(emailInput.value, passwordInput.value);

      // Success
      ToastManager.show("Successfully signed in!", "success");

      // Redirect after short delay
      setTimeout(() => {
        window.location.href = "dashboard.html"; // Redirect to dashboard
      }, 1500);
    } catch (error) {
      // Error handling
      ToastManager.show(
        error.message || "Sign in failed. Please try again.",
        "error",
      );
      this.setLoadingState(submitBtn, false);
    }
  }

  /**
   * Handle phone form submission
   *
   * @param {Event} e - Submit event
   * @private
   */
  async handlePhoneSubmit(e) {
    e.preventDefault();

    const phoneInput = document.getElementById("phoneInput");
    const countryCode = document.getElementById("countryCode").value;
    const submitBtn = e.target.querySelector(".submit-btn");

    // Validate phone
    const phoneValid = this.validatePhoneInput(phoneInput);

    if (!phoneValid) {
      return;
    }

    // Show loading state
    this.setLoadingState(submitBtn, true);

    try {
      // Simulate sending SMS code
      await this.sendVerificationCode(countryCode + phoneInput.value);

      // Success
      ToastManager.show("Verification code sent!", "success");

      // Here you would typically show a code input field
      // For now, just reset the button
      setTimeout(() => {
        this.setLoadingState(submitBtn, false);
      }, 2000);
    } catch (error) {
      ToastManager.show(
        error.message || "Failed to send code. Please try again.",
        "error",
      );
      this.setLoadingState(submitBtn, false);
    }
  }

  /**
   * Handle Google OAuth
   *
   * @private
   */
  handleGoogleAuth() {
    ToastManager.show("Redirecting to Google...", "info");

    // TODO: Implement Google OAuth flow
    // window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?...';

    console.log("Google OAuth initiated");
  }

  /**
   * Handle Facebook OAuth
   *
   * @private
   */
  handleFacebookAuth() {
    ToastManager.show("Redirecting to Facebook...", "info");

    // TODO: Implement Facebook OAuth flow
    console.log("Facebook OAuth initiated");
  }

  /**
   * Handle Apple OAuth
   *
   * @private
   */
  handleAppleAuth() {
    ToastManager.show("Redirecting to Apple...", "info");

    // TODO: Implement Apple OAuth flow
    console.log("Apple OAuth initiated");
  }

  /**
   * Handle Microsoft OAuth
   *
   * @private
   */
  handleMicrosoftAuth() {
    ToastManager.show("Redirecting to Microsoft...", "info");

    // TODO: Implement Microsoft OAuth flow
    console.log("Microsoft OAuth initiated");
  }

  /**
   * Set button loading state
   *
   * @param {HTMLElement} button - Submit button
   * @param {boolean} loading - Loading state
   * @private
   */
  setLoadingState(button, loading) {
    const btnText = button.querySelector(".btn-text");
    const btnLoader = button.querySelector(".btn-loader");

    if (loading) {
      button.disabled = true;
      btnText.classList.add("hidden");
      btnLoader.classList.remove("hidden");
    } else {
      button.disabled = false;
      btnText.classList.remove("hidden");
      btnLoader.classList.add("hidden");
    }
  }

  /**
   * Authenticate with email (API call simulation)
   *
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Authentication promise
   * @private
   */
  authenticateWithEmail(email, password) {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        // TODO: Replace with actual API call
        // For demo purposes, accept any email/password
        if (email && password.length >= 8) {
          resolve({ success: true });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 1500);
    });
  }

  /**
   * Send SMS verification code (API call simulation)
   *
   * @param {string} phoneNumber - Full phone number with country code
   * @returns {Promise} Send code promise
   * @private
   */
  sendVerificationCode(phoneNumber) {
    return new Promise((resolve, reject) => {
      // Simulate API delay
      setTimeout(() => {
        // TODO: Replace with actual SMS API call
        resolve({ success: true });
      }, 1500);
    });
  }
}

/* ===================================================================
   4. UI COMPONENTS
   ===================================================================
   Toast notifications and other UI elements
   =================================================================== */

/**
 * ToastManager Class
 * Displays temporary notification messages
 *
 * @class
 */
class ToastManager {
  /**
   * Show a toast notification
   *
   * @param {string} message - Message to display
   * @param {string} type - Toast type (success, error, info)
   * @param {number} duration - Display duration in ms (default: 4000)
   * @static
   */
  static show(message, type = "info", duration = 4000) {
    const container = document.getElementById("toastContainer");

    // Create toast element
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    // Icon based on type
    let icon = "";
    if (type === "success") {
      icon = `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--success-color);">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>`;
    } else if (type === "error") {
      icon = `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--error-color);">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>`;
    } else {
      icon = `<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--info-color);">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>`;
    }

    toast.innerHTML = `
            ${icon}
            <div class="toast-message">${message}</div>
        `;

    // Add to container
    container.appendChild(toast);

    // Auto-remove after duration
    setTimeout(() => {
      toast.style.animation = "slideOutDown 0.3s ease-out";
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  }
}

/* ===================================================================
   5. UTILITY FUNCTIONS
   ===================================================================
   Helper functions and utilities
   =================================================================== */

/**
 * Debounce function
 * Limits the rate at which a function can fire
 *
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
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

/**
 * Check if user prefers reduced motion
 *
 * @returns {boolean} True if prefers reduced motion
 */
function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Format phone number for display
 *
 * @param {string} phone - Raw phone number
 * @returns {string} Formatted phone number
 */
function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phone;
}

/* ===================================================================
   6. INITIALIZATION
   ===================================================================
   Initialize all components when DOM is ready
   =================================================================== */

/**
 * Initialize application
 * Called when DOM is fully loaded
 */
function initializeApp() {
  console.log("🎓 StudyFlow Sign-In initialized");

  // Initialize components
  const themeManager = new ThemeManager();
  const authManager = new AuthenticationManager();

  // Handle sign-up link
  const signupLink = document.getElementById("signupLink");
  if (signupLink) {
    signupLink.addEventListener("click", (e) => {
      e.preventDefault();
      ToastManager.show("Sign up page coming soon!", "info");
      // window.location.href = 'signup.html';
    });
  }

  // Add smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#") {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  // Disable animations if user prefers reduced motion
  if (prefersReducedMotion()) {
    document.documentElement.style.setProperty("--transition-fast", "0s");
    document.documentElement.style.setProperty("--transition-base", "0s");
    document.documentElement.style.setProperty("--transition-slow", "0s");
  }

  // Log browser info for debugging
  console.log("Browser:", navigator.userAgent);
  console.log("Theme loaded:", localStorage.getItem("studyflow-theme"));
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

// Export for module use if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ThemeManager,
    FormValidator,
    AuthenticationManager,
    ToastManager,
  };
}
