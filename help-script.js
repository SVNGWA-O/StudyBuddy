/**
 * ====================================================================
 * STUDYFLOW HELP CENTER JAVASCRIPT
 * ====================================================================
 * @file help-script.js
 * @description Interactive support center with ticket system
 * @author StudyFlow Team
 * @version 2.0.0
 *
 * FEATURES:
 * - Support ticket submission with validation
 * - FAQ accordion interactions
 * - Toast notification system
 * - File upload handling
 * - Form validation and error handling
 * - Character counting
 * - Email and phone link tracking (optional)
 *
 * TABLE OF CONTENTS:
 * 1. Ticket System Manager
 * 2. Form Validation
 * 3. FAQ Manager
 * 4. Toast Notifications
 * 5. Utility Functions
 * 6. Event Listeners & Initialization
 * ====================================================================
 */

"use strict";

/* ===================================================================
   1. TICKET SYSTEM MANAGER
   ===================================================================
   Handles ticket modal, form submission, and tracking
   =================================================================== */

/**
 * TicketManager Class
 * Manages support ticket creation and submission
 *
 * @class
 * @example
 * const ticketManager = new TicketManager();
 */
class TicketManager {
  /**
   * Creates a TicketManager instance
   * Initializes form elements and event listeners
   */
  constructor() {
    // DOM Elements
    this.modal = document.getElementById("ticketModal");
    this.form = document.getElementById("ticketForm");
    this.closeBtn = document.querySelector(".modal-close");

    // Form fields
    this.nameInput = document.getElementById("ticketName");
    this.emailInput = document.getElementById("ticketEmail");
    this.categorySelect = document.getElementById("ticketCategory");
    this.prioritySelect = document.getElementById("ticketPriority");
    this.subjectInput = document.getElementById("ticketSubject");
    this.descriptionTextarea = document.getElementById("ticketDescription");
    this.fileInput = document.getElementById("ticketAttachment");

    // Character counter
    this.charCount = document.getElementById("charCount");

    this.init();
  }

  /**
   * Initialize ticket manager
   * Sets up all event listeners
   *
   * @private
   */
  init() {
    // Form submission
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Character counting for description
    this.descriptionTextarea.addEventListener("input", () =>
      this.updateCharCount(),
    );

    // File upload handling
    this.fileInput.addEventListener("change", () => this.handleFileUpload());

    // Real-time validation
    this.nameInput.addEventListener("blur", () => this.validateName());
    this.emailInput.addEventListener("blur", () => this.validateEmail());
    this.categorySelect.addEventListener("change", () =>
      this.validateCategory(),
    );
    this.prioritySelect.addEventListener("change", () =>
      this.validatePriority(),
    );
    this.subjectInput.addEventListener("blur", () => this.validateSubject());
    this.descriptionTextarea.addEventListener("blur", () =>
      this.validateDescription(),
    );

    // Clear errors on input
    [
      this.nameInput,
      this.emailInput,
      this.subjectInput,
      this.descriptionTextarea,
    ].forEach((input) => {
      input.addEventListener("input", () => this.clearError(input));
    });

    [this.categorySelect, this.prioritySelect].forEach((select) => {
      select.addEventListener("change", () => this.clearError(select));
    });

    // Close modal on outside click
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("active")) {
        this.close();
      }
    });
  }

  /**
   * Open ticket modal
   *
   * @public
   */
  open() {
    this.modal.classList.add("active");
    document.body.style.overflow = "hidden";
    // Focus first input for accessibility
    setTimeout(() => this.nameInput.focus(), 300);
  }

  /**
   * Close ticket modal
   *
   * @public
   */
  close() {
    this.modal.classList.remove("active");
    document.body.style.overflow = "";
  }

  /**
   * Update character count for description
   *
   * @private
   */
  updateCharCount() {
    const count = this.descriptionTextarea.value.length;
    this.charCount.textContent = count;

    // Warning color if approaching limit
    if (count > 900) {
      this.charCount.style.color = "var(--warning-color)";
    } else if (count >= 1000) {
      this.charCount.style.color = "var(--error-color)";
    } else {
      this.charCount.style.color = "";
    }
  }

  /**
   * Handle file upload
   * Display selected file info
   *
   * @private
   */
  handleFileUpload() {
    const file = this.fileInput.files[0];
    const fileInfo = document.getElementById("fileInfo");

    if (file) {
      const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
      fileInfo.textContent = `Selected: ${file.name} (${sizeInMB} MB)`;
      fileInfo.style.color = "var(--success-color)";
    } else {
      fileInfo.textContent = "";
    }
  }

  /**
   * Validate name field
   *
   * @returns {boolean} Validation result
   * @private
   */
  validateName() {
    const value = this.nameInput.value.trim();

    if (!value) {
      this.showError(this.nameInput, "nameError", "Please enter your name");
      return false;
    }

    if (value.length < 2) {
      this.showError(
        this.nameInput,
        "nameError",
        "Name must be at least 2 characters",
      );
      return false;
    }

    return true;
  }

  /**
   * Validate email field
   *
   * @returns {boolean} Validation result
   * @private
   */
  validateEmail() {
    const value = this.emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      this.showError(
        this.emailInput,
        "ticketEmailError",
        "Please enter your email",
      );
      return false;
    }

    if (!emailPattern.test(value)) {
      this.showError(
        this.emailInput,
        "ticketEmailError",
        "Please enter a valid email address",
      );
      return false;
    }

    return true;
  }

  /**
   * Validate category selection
   *
   * @returns {boolean} Validation result
   * @private
   */
  validateCategory() {
    if (!this.categorySelect.value) {
      this.showError(
        this.categorySelect,
        "categoryError",
        "Please select a category",
      );
      return false;
    }

    return true;
  }

  /**
   * Validate priority selection
   *
   * @returns {boolean} Validation result
   * @private
   */
  validatePriority() {
    if (!this.prioritySelect.value) {
      this.showError(
        this.prioritySelect,
        "priorityError",
        "Please select a priority level",
      );
      return false;
    }

    return true;
  }

  /**
   * Validate subject field
   *
   * @returns {boolean} Validation result
   * @private
   */
  validateSubject() {
    const value = this.subjectInput.value.trim();

    if (!value) {
      this.showError(
        this.subjectInput,
        "subjectError",
        "Please enter a subject",
      );
      return false;
    }

    if (value.length < 5) {
      this.showError(
        this.subjectInput,
        "subjectError",
        "Subject must be at least 5 characters",
      );
      return false;
    }

    return true;
  }

  /**
   * Validate description field
   *
   * @returns {boolean} Validation result
   * @private
   */
  validateDescription() {
    const value = this.descriptionTextarea.value.trim();

    if (!value) {
      this.showError(
        this.descriptionTextarea,
        "descriptionError",
        "Please describe your issue",
      );
      return false;
    }

    if (value.length < 20) {
      this.showError(
        this.descriptionTextarea,
        "descriptionError",
        "Please provide more details (at least 20 characters)",
      );
      return false;
    }

    if (value.length > 1000) {
      this.showError(
        this.descriptionTextarea,
        "descriptionError",
        "Description is too long (max 1000 characters)",
      );
      return false;
    }

    return true;
  }

  /**
   * Show validation error
   *
   * @param {HTMLElement} input - Input element
   * @param {string} errorId - Error message element ID
   * @param {string} message - Error message
   * @private
   */
  showError(input, errorId, message) {
    const errorElement = document.getElementById(errorId);

    input.classList.add("error");
    input.setAttribute("aria-invalid", "true");

    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  /**
   * Clear validation error
   *
   * @param {HTMLElement} input - Input element
   * @private
   */
  clearError(input) {
    const errorId = input.id + "Error";
    const errorElement = document.getElementById(errorId);

    input.classList.remove("error");
    input.removeAttribute("aria-invalid");

    if (errorElement) {
      errorElement.textContent = "";
    }
  }

  /**
   * Handle form submission
   *
   * @param {Event} e - Submit event
   * @private
   */
  async handleSubmit(e) {
    e.preventDefault();

    // Validate all fields
    const isValid = [
      this.validateName(),
      this.validateEmail(),
      this.validateCategory(),
      this.validatePriority(),
      this.validateSubject(),
      this.validateDescription(),
    ].every((result) => result === true);

    if (!isValid) {
      ToastManager.show("Please fix the errors in the form", "error");
      return;
    }

    // Get form data
    const ticketData = {
      name: this.nameInput.value.trim(),
      email: this.emailInput.value.trim(),
      category: this.categorySelect.value,
      priority: this.prioritySelect.value,
      subject: this.subjectInput.value.trim(),
      description: this.descriptionTextarea.value.trim(),
      file: this.fileInput.files[0] || null,
      timestamp: new Date().toISOString(),
    };

    // Show loading state
    const submitBtn = this.form.querySelector(".btn-primary");
    this.setLoadingState(submitBtn, true);

    try {
      // Simulate API call (replace with actual endpoint)
      await this.submitTicket(ticketData);

      // Generate ticket number
      const ticketNumber = this.generateTicketNumber();

      // Success
      ToastManager.show(
        `Ticket #${ticketNumber} created! We'll email you soon at ${ticketData.email}`,
        "success",
        6000,
      );

      // Reset form and close modal
      this.form.reset();
      this.updateCharCount();
      document.getElementById("fileInfo").textContent = "";

      setTimeout(() => {
        this.close();
        this.setLoadingState(submitBtn, false);
      }, 1500);
    } catch (error) {
      ToastManager.show(
        "Failed to submit ticket. Please try again or email us directly.",
        "error",
      );
      this.setLoadingState(submitBtn, false);
    }
  }

  /**
   * Submit ticket to server
   *
   * @param {Object} ticketData - Ticket information
   * @returns {Promise} Submission promise
   * @private
   */
  async submitTicket(ticketData) {
    // Simulate API delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // TODO: Replace with actual API call
        console.log("Ticket submitted:", ticketData);

        // Log to console for demo (remove in production)
        console.log("---SUPPORT TICKET---");
        console.log(`From: ${ticketData.name} <${ticketData.email}>`);
        console.log(`Category: ${ticketData.category}`);
        console.log(`Priority: ${ticketData.priority}`);
        console.log(`Subject: ${ticketData.subject}`);
        console.log(`Description: ${ticketData.description}`);
        console.log(`File: ${ticketData.file ? ticketData.file.name : "None"}`);
        console.log("-------------------");

        // Simulate success
        resolve({ success: true });
      }, 1500);
    });
  }

  /**
   * Generate random ticket number
   *
   * @returns {string} Ticket number
   * @private
   */
  generateTicketNumber() {
    const prefix = "SF";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Set button loading state
   *
   * @param {HTMLElement} button - Button element
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
}

/* ===================================================================
   2. FAQ MANAGER
   ===================================================================
   Handles FAQ accordion interactions
   =================================================================== */

/**
 * FAQ Manager
 * Controls FAQ expand/collapse behavior
 *
 * @class
 */
class FAQManager {
  /**
   * Creates an FAQManager instance
   */
  constructor() {
    this.faqItems = document.querySelectorAll(".faq-item");
    this.init();
  }

  /**
   * Initialize FAQ manager
   *
   * @private
   */
  init() {
    // Add click handlers to all FAQ questions
    this.faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
      question.addEventListener("click", () => this.toggleFAQ(item));
    });
  }

  /**
   * Toggle FAQ item
   *
   * @param {HTMLElement} item - FAQ item element
   * @public
   */
  toggleFAQ(item) {
    const isActive = item.classList.contains("active");

    // Close all other items (optional - remove if you want multiple open)
    this.faqItems.forEach((faq) => {
      if (faq !== item) {
        faq.classList.remove("active");
      }
    });

    // Toggle current item
    if (isActive) {
      item.classList.remove("active");
    } else {
      item.classList.add("active");
    }
  }
}

/* ===================================================================
   3. TOAST NOTIFICATIONS
   ===================================================================
   Display temporary notification messages
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
      icon = `<svg class="toast-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--success-color);">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>`;
    } else if (type === "error") {
      icon = `<svg class="toast-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--error-color);">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>`;
    } else {
      icon = `<svg class="toast-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--primary-color);">
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
   4. UTILITY FUNCTIONS
   ===================================================================
   Helper functions
   =================================================================== */

/**
 * Track phone calls (optional analytics)
 *
 * @param {string} phoneNumber - Phone number
 */
function trackPhoneCall(phoneNumber) {
  console.log(`Phone call initiated: ${phoneNumber}`);
  // TODO: Add analytics tracking if needed
  // Example: gtag('event', 'phone_call', { phone_number: phoneNumber });
}

/**
 * Track email clicks (optional analytics)
 *
 * @param {string} email - Email address
 */
function trackEmailClick(email) {
  console.log(`Email link clicked: ${email}`);
  // TODO: Add analytics tracking if needed
  // Example: gtag('event', 'email_click', { email: email });
}

/**
 * Scroll to section smoothly
 *
 * @param {string} elementId - Element ID to scroll to
 */
function scrollToSection(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* ===================================================================
   5. GLOBAL FUNCTIONS (Called from HTML)
   ===================================================================
   Functions accessible from inline event handlers
   =================================================================== */

/**
 * Open ticket form modal
 * Called from button onclick
 *
 * @global
 */
function openTicketForm() {
  if (window.ticketManager) {
    window.ticketManager.open();
  }
}

/**
 * Close ticket form modal
 * Called from button onclick
 *
 * @global
 */
function closeTicketForm() {
  if (window.ticketManager) {
    window.ticketManager.close();
  }
}

/**
 * Toggle FAQ item
 * Called from button onclick
 *
 * @param {HTMLElement} button - FAQ question button
 * @global
 */
function toggleFaq(button) {
  const faqItem = button.closest(".faq-item");
  if (faqItem && window.faqManager) {
    window.faqManager.toggleFAQ(faqItem);
  }
}

/* ===================================================================
   6. EVENT LISTENERS & INITIALIZATION
   ===================================================================
   Initialize all components when DOM is ready
   =================================================================== */

/**
 * Initialize help center
 * Called when DOM is fully loaded
 */
function initializeHelpCenter() {
  console.log("💙 StudyFlow Help Center initialized");

  // Initialize managers (expose globally for inline handlers)
  window.ticketManager = new TicketManager();
  window.faqManager = new FAQManager();

  // Add analytics to contact links (optional)
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const phone = link.getAttribute("href").replace("tel:", "");
      trackPhoneCall(phone);
    });
  });

  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const email = link.getAttribute("href").replace("mailto:", "");
      trackEmailClick(email);
    });
  });

  // Add smooth scrolling to anchor links
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

  // Add entrance animations to cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe contact cards
  document.querySelectorAll(".contact-card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });

  // Show welcome message after short delay
  setTimeout(() => {
    ToastManager.show(
      "Welcome! We're here to help you succeed 💙",
      "info",
      5000,
    );
  }, 1000);

  console.log("✨ All components loaded successfully");
}

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeHelpCenter);
} else {
  initializeHelpCenter();
}

// Export for module use if needed
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    TicketManager,
    FAQManager,
    ToastManager,
  };
}
