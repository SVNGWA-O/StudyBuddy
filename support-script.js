/**
 * ====================================================================
 * STUDYFLOW SUPPORT/DONATION PAGE JAVASCRIPT
 * ====================================================================
 * @file support-script.js
 * @description Interactive donation page with multiple contribution methods
 * @author StudyFlow Team
 * @version 2.0.0
 *
 * FEATURES:
 * - Counter animations for impact statistics
 * - Donation form with validation
 * - Social sharing tracking with gamification
 * - Recognition tier system
 * - Payment method switching
 * - Toast notifications
 * - Community Champion status
 * - Anonymous/Featured donation options
 *
 * TABLE OF CONTENTS:
 * 1. Counter Animations
 * 2. Donation Management
 * 3. Social Sharing System
 * 4. Form Validation
 * 5. Toast Notifications
 * 6. Recognition System
 * 7. Utility Functions
 * 8. Initialization
 * ====================================================================
 */

"use strict";

/* ===================================================================
   1. COUNTER ANIMATIONS
   ===================================================================
   Animate statistics on page load
   =================================================================== */

/**
 * CounterAnimation Class
 * Animates numerical statistics for emotional impact
 *
 * @class
 */
class CounterAnimation {
  /**
   * Creates a CounterAnimation instance
   */
  constructor() {
    this.counters = document.querySelectorAll(".stat-number");
    this.init();
  }

  /**
   * Initialize counter animations
   *
   * @private
   */
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

  /**
   * Animate a single counter
   *
   * @param {HTMLElement} element - Counter element
   * @private
   */
  animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = this.formatNumber(target);
        clearInterval(timer);
      } else {
        element.textContent = this.formatNumber(Math.floor(current));
      }
    }, duration / steps);
  }

  /**
   * Format number with commas and prefix
   *
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   * @private
   */
  formatNumber(num) {
    if (num >= 1000000) {
      return "$" + (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K+";
    }
    return num.toLocaleString();
  }
}

/* ===================================================================
   2. DONATION MANAGEMENT
   ===================================================================
   Handle donation panel switching and form submission
   =================================================================== */

/**
 * DonationManager Class
 * Manages donation options, forms, and submission
 *
 * @class
 */
class DonationManager {
  /**
   * Creates a DonationManager instance
   */
  constructor() {
    this.toggleBtns = document.querySelectorAll(".toggle-btn");
    this.panels = document.querySelectorAll(".donation-panel");
    this.frequencyBtns = document.querySelectorAll(".frequency-btn");
    this.amountBtns = document.querySelectorAll(".amount-btn");
    this.donationForm = document.getElementById("donationForm");
    this.customAmountSection = document.querySelector(".custom-amount-section");
    this.anonymousCheckbox = document.getElementById("anonymousDonor");
    this.featuredCheckbox = document.getElementById("featuredDonor");

    this.selectedAmount = 25;
    this.selectedFrequency = "monthly";

    this.init();
  }

  /**
   * Initialize donation manager
   *
   * @private
   */
  init() {
    // Panel switching
    this.toggleBtns.forEach((btn) => {
      btn.addEventListener("click", () => this.switchPanel(btn));
    });

    // Frequency selection
    this.frequencyBtns.forEach((btn) => {
      btn.addEventListener("click", () => this.selectFrequency(btn));
    });

    // Amount selection
    this.amountBtns.forEach((btn) => {
      btn.addEventListener("click", () => this.selectAmount(btn));
    });

    // Anonymous/Featured mutual exclusivity
    if (this.anonymousCheckbox && this.featuredCheckbox) {
      this.anonymousCheckbox.addEventListener("change", () => {
        if (this.anonymousCheckbox.checked) {
          this.featuredCheckbox.checked = false;
        }
      });

      this.featuredCheckbox.addEventListener("change", () => {
        if (this.featuredCheckbox.checked) {
          this.anonymousCheckbox.checked = false;
        }
      });
    }

    // Form submission
    if (this.donationForm) {
      this.donationForm.addEventListener("submit", (e) => this.handleSubmit(e));
    }
  }

  /**
   * Switch between financial and social panels
   *
   * @param {HTMLElement} btn - Clicked toggle button
   * @private
   */
  switchPanel(btn) {
    const type = btn.dataset.type;

    // Update buttons
    this.toggleBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Update panels
    this.panels.forEach((panel) => {
      panel.classList.remove("active");
      if (
        (type === "financial" && panel.id === "financialPanel") ||
        (type === "social" && panel.id === "socialPanel")
      ) {
        panel.classList.add("active");
      }
    });
  }

  /**
   * Select donation frequency
   *
   * @param {HTMLElement} btn - Clicked frequency button
   * @private
   */
  selectFrequency(btn) {
    this.selectedFrequency = btn.dataset.frequency;

    this.frequencyBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }

  /**
   * Select donation amount
   *
   * @param {HTMLElement} btn - Clicked amount button
   * @private
   */
  selectAmount(btn) {
    const amount = btn.dataset.amount;

    this.amountBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    if (amount === "custom") {
      this.customAmountSection.classList.remove("hidden");
      this.selectedAmount = null;
    } else {
      this.customAmountSection.classList.add("hidden");
      this.selectedAmount = parseInt(amount);
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

    const formData = new FormData(this.donationForm);
    const donorName = document.getElementById("donorName").value;
    const donorEmail = document.getElementById("donorEmail").value;
    const customAmount = document.getElementById("customAmount")?.value;

    // Validate
    if (!donorName || !donorEmail) {
      ToastManager.show("Please fill in all required fields", "error");
      return;
    }

    // Get final amount
    const finalAmount = customAmount || this.selectedAmount;

    if (!finalAmount || finalAmount <= 0) {
      ToastManager.show("Please select or enter a donation amount", "error");
      return;
    }

    // Show loading
    const submitBtn = this.donationForm.querySelector(".submit-btn");
    this.setLoadingState(submitBtn, true);

    try {
      // Simulate API call
      await this.processDonation({
        name: donorName,
        email: donorEmail,
        amount: finalAmount,
        frequency: this.selectedFrequency,
        anonymous: this.anonymousCheckbox?.checked || false,
        featured: this.featuredCheckbox?.checked || false,
        partner: document.getElementById("partnerProgram")?.checked || false,
      });

      // Success
      ToastManager.show(
        `Thank you for your ${this.selectedFrequency} donation of $${finalAmount}! You're changing lives. 💙`,
        "success",
        6000,
      );

      // Reset form
      this.donationForm.reset();
      this.setLoadingState(submitBtn, false);
    } catch (error) {
      ToastManager.show("Payment failed. Please try again.", "error");
      this.setLoadingState(submitBtn, false);
    }
  }

  /**
   * Process donation (API simulation)
   *
   * @param {Object} data - Donation data
   * @returns {Promise}
   * @private
   */
  async processDonation(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Donation processed:", data);
        resolve({ success: true });
      }, 2000);
    });
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
}

/* ===================================================================
   3. SOCIAL SHARING SYSTEM
   ===================================================================
   Track shares and implement gamification
   =================================================================== */

/**
 * SocialSharingManager Class
 * Manages social sharing, tracking, and recognition
 *
 * @class
 */
class SocialSharingManager {
  /**
   * Creates a SocialSharingManager instance
   */
  constructor() {
    this.shareCount = 0;
    this.sharedPlatforms = new Set();
    this.progressFill = document.getElementById("progressFill");
    this.progressMessage = document.getElementById("progressMessage");
    this.shareCountElement = document.getElementById("shareCount");
    this.championSection = document.getElementById("championSection");
    this.championForm = document.getElementById("championForm");

    this.init();
  }

  /**
   * Initialize social sharing
   *
   * @private
   */
  init() {
    // Load saved progress
    this.loadProgress();

    // Champion form submission
    if (this.championForm) {
      this.championForm.addEventListener("submit", (e) =>
        this.submitChampion(e),
      );
    }
  }

  /**
   * Register a share
   *
   * @param {string} platform - Platform name
   * @public
   */
  registerShare(platform) {
    if (this.sharedPlatforms.has(platform)) {
      ToastManager.show("You already shared on this platform!", "info");
      return;
    }

    this.sharedPlatforms.add(platform);
    this.shareCount++;

    // Update UI
    this.updateProgress();
    this.markPlatformShared(platform);

    // Save progress
    this.saveProgress();

    // Check for champion status
    if (
      this.shareCount >= 3 &&
      !this.championSection.classList.contains("hidden")
    ) {
      this.unlockChampionStatus();
    }

    ToastManager.show(`Shared on ${platform}! 🎉`, "success");
  }

  /**
   * Update progress bar and message
   *
   * @private
   */
  updateProgress() {
    const percentage = Math.min((this.shareCount / 3) * 100, 100);

    this.progressFill.style.width = `${percentage}%`;
    this.shareCountElement.textContent = this.shareCount;

    if (this.shareCount >= 3) {
      this.progressMessage.textContent = "🎉 You're a Community Champion!";
      this.progressMessage.style.color = "var(--success-color)";
    } else {
      const remaining = 3 - this.shareCount;
      this.progressMessage.textContent = `Share on ${remaining} more ${remaining === 1 ? "platform" : "platforms"} to become a Community Champion!`;
    }
  }

  /**
   * Mark platform as shared visually
   *
   * @param {string} platform - Platform name
   * @private
   */
  markPlatformShared(platform) {
    const statusId = `${platform}Status`;
    const statusElement = document.getElementById(statusId);
    const btn = statusElement?.closest(".social-share-btn");

    if (statusElement) {
      statusElement.textContent = "✓";
    }

    if (btn) {
      btn.classList.add("shared");
    }
  }

  /**
   * Unlock champion status
   *
   * @private
   */
  unlockChampionStatus() {
    if (this.championSection.classList.contains("hidden")) {
      this.championSection.classList.remove("hidden");

      // Scroll to champion section
      setTimeout(() => {
        this.championSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 500);
    }
  }

  /**
   * Submit champion form
   *
   * @param {Event} e - Submit event
   * @private
   */
  async submitChampion(e) {
    e.preventDefault();

    const name = document.getElementById("championName").value;
    const email = document.getElementById("championEmail").value;

    if (!name || !email) {
      ToastManager.show("Please fill in all fields", "error");
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      ToastManager.show(
        `Welcome to the Community Champions, ${name}! Check your email for exclusive updates. 🌟`,
        "success",
        6000,
      );

      this.championForm.reset();
    } catch (error) {
      ToastManager.show("Failed to submit. Please try again.", "error");
    }
  }

  /**
   * Save progress to localStorage
   *
   * @private
   */
  saveProgress() {
    localStorage.setItem(
      "studyflow-share-progress",
      JSON.stringify({
        count: this.shareCount,
        platforms: Array.from(this.sharedPlatforms),
      }),
    );
  }

  /**
   * Load progress from localStorage
   *
   * @private
   */
  loadProgress() {
    const saved = localStorage.getItem("studyflow-share-progress");

    if (saved) {
      const data = JSON.parse(saved);
      this.shareCount = data.count || 0;
      this.sharedPlatforms = new Set(data.platforms || []);

      // Update UI
      this.updateProgress();
      data.platforms.forEach((platform) => this.markPlatformShared(platform));

      // Unlock champion if qualified
      if (this.shareCount >= 3) {
        this.unlockChampionStatus();
      }
    }
  }
}

/* ===================================================================
   4. GLOBAL SHARING FUNCTIONS
   ===================================================================
   Called from HTML onclick attributes
   =================================================================== */

let sharingManager;

/**
 * Share on Twitter
 *
 * @global
 */
function shareOnTwitter() {
  const text =
    "I'm supporting @StudyFlow to keep education free for all students! Join me in making a difference. 💙";
  const url = window.location.origin;

  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    "_blank",
  );

  sharingManager.registerShare("twitter");
}

/**
 * Share on Facebook
 *
 * @global
 */
function shareOnFacebook() {
  const url = window.location.origin;

  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    "_blank",
  );

  sharingManager.registerShare("facebook");
}

/**
 * Share on LinkedIn
 *
 * @global
 */
function shareOnLinkedIn() {
  const url = window.location.origin;
  const title = "Support StudyFlow - Free Education for All";
  const summary =
    "Help keep education free and accessible for students worldwide";

  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    "_blank",
  );

  sharingManager.registerShare("linkedin");
}

/**
 * Copy Instagram message
 *
 * @global
 */
function copyInstagramMessage() {
  const message =
    "Supporting @studyflow to keep education free! 💙 Every student deserves a chance to succeed. Link in bio! #Education #StudyFlow #FreeEducation";

  navigator.clipboard.writeText(message).then(() => {
    ToastManager.show(
      "Message copied! Paste in your Instagram story",
      "success",
    );
    sharingManager.registerShare("instagram");
  });
}

/**
 * Copy TikTok message
 *
 * @global
 */
function copyTikTokMessage() {
  const message =
    "Making education free for students! 💙 Check out StudyFlow - no subscriptions, just learning. #Education #StudyTok #FreeEducation";

  navigator.clipboard.writeText(message).then(() => {
    ToastManager.show("Message copied! Use it in your TikTok video", "success");
    sharingManager.registerShare("tiktok");
  });
}

/**
 * Share on WhatsApp
 *
 * @global
 */
function shareOnWhatsApp() {
  const text =
    "I'm supporting StudyFlow to help keep education free for all students! Join me: " +
    window.location.origin;

  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");

  sharingManager.registerShare("whatsapp");
}

/**
 * Scroll to top of page
 *
 * @global
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ===================================================================
   5. TOAST NOTIFICATIONS
   =================================================================== */

/**
 * ToastManager Class
 * Display temporary notification messages
 *
 * @class
 */
class ToastManager {
  /**
   * Show a toast notification
   *
   * @param {string} message - Message to display
   * @param {string} type - Toast type (success, error, info)
   * @param {number} duration - Display duration in ms
   * @static
   */
  static show(message, type = "info", duration = 4000) {
    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let icon = "";
    if (type === "success") {
      icon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--success-color);">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>`;
    } else if (type === "error") {
      icon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--error-color);">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>`;
    } else {
      icon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--primary-color);">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>`;
    }

    toast.innerHTML = `
            ${icon}
            <div class="toast-message">${message}</div>
        `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = "slideOutDown 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
}

/* ===================================================================
   6. INITIALIZATION
   ===================================================================
   Initialize all components when DOM is ready
   =================================================================== */

/**
 * Initialize support page
 */
function initializeSupportPage() {
  console.log("💙 StudyFlow Support Page initialized");

  // Initialize managers
  new CounterAnimation();
  new DonationManager();
  sharingManager = new SocialSharingManager();

  // Add entrance animations
  const hero = document.querySelector(".hero-content");
  if (hero) {
    hero.style.opacity = "0";
    hero.style.transform = "translateY(30px)";

    setTimeout(() => {
      hero.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      hero.style.opacity = "1";
      hero.style.transform = "translateY(0)";
    }, 100);
  }

  // Animate story cards on scroll
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

  document.querySelectorAll(".story-card, .cost-item").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });

  console.log("✨ All components loaded successfully");
}

// Wait for DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSupportPage);
} else {
  initializeSupportPage();
}

// Export for module use
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CounterAnimation,
    DonationManager,
    SocialSharingManager,
    ToastManager,
  };
}
