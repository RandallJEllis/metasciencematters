// Tab navigation
const navLinks = document.querySelectorAll(".nav-link");
const contentSections = document.querySelectorAll(".content-section");

// Also allow hero button to switch to Episodes
const sectionLinkButtons = document.querySelectorAll("[data-section-link]");

function showSection(id) {
  contentSections.forEach((section) => {
    section.classList.toggle("active", section.id === id);
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === id);
  });

  // Scroll to top of main content for better UX
  const main = document.querySelector(".main-content");
  if (main) {
    const offset = main.getBoundingClientRect().top + window.scrollY - 40;
    window.scrollTo({ top: offset, behavior: "smooth" });
  }
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const target = link.dataset.section;
    if (target) {
      showSection(target);
      closeMobileNav();
    }
  });
});

sectionLinkButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const target = btn.dataset.sectionLink;
    if (target) {
      showSection(target);
    }
  });
});

// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

function closeMobileNav() {
  if (siteNav && siteNav.classList.contains("open")) {
    siteNav.classList.remove("open");
  }
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    siteNav.classList.toggle("open");
  });
}

// Episodes search + filter
const searchInput = document.getElementById("episode-search");
const filterButtons = document.querySelectorAll(".filter-btn");
const episodeCards = document.querySelectorAll(".episode-card");

function normalize(str) {
  return (str || "").toLowerCase();
}

function updateEpisodeVisibility() {
  const query = normalize(searchInput ? searchInput.value : "");
  const activeFilterBtn = document.querySelector(".filter-btn.active");
  const filter = activeFilterBtn ? activeFilterBtn.dataset.filter : "all";

  episodeCards.forEach((card) => {
    const title = normalize(
      card.querySelector(".episode-title")?.textContent || ""
    );
    const description = normalize(
      card.querySelector(".episode-description")?.textContent || ""
    );
    const tags = normalize(card.dataset.tags || "");

    const matchesSearch =
      !query || title.includes(query) || description.includes(query);

    let matchesFilter = true;
    if (filter && filter !== "all") {
      matchesFilter = tags.includes(filter);
    }

    const visible = matchesSearch && matchesFilter;
    card.style.display = visible ? "grid" : "none";
  });
}

if (searchInput) {
  searchInput.addEventListener("input", updateEpisodeVisibility);
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    updateEpisodeVisibility();
  });
});

// Newsletter form (front-end only demo)
const newsletterForm = document.getElementById("newsletter-form");
const newsletterMessage = document.getElementById("newsletter-message");

if (newsletterForm && newsletterMessage) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletter-email").value.trim();
    const consent = document.getElementById("newsletter-consent").checked;

    if (!email || !consent) {
      newsletterMessage.textContent =
        "Please enter your email and agree to receive updates.";
      newsletterMessage.classList.remove("success");
      newsletterMessage.classList.add("error");
      return;
    }

    // Replace this with your real newsletter API call (e.g., Mailchimp, ConvertKit)
    newsletterMessage.textContent =
      "Thanks for subscribing! Check your inbox for a confirmation email.";
    newsletterMessage.classList.remove("error");
    newsletterMessage.classList.add("success");
    newsletterForm.reset();
  });
}

// Contact form (front-end only demo)
const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-message-status");

if (contactForm && contactStatus) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const message = document
      .getElementById("contact-message")
      .value.trim();

    if (!name || !email || !message) {
      contactStatus.textContent =
        "Please fill out all required fields before sending.";
      contactStatus.classList.remove("success");
      contactStatus.classList.add("error");
      return;
    }

    // Replace this with your real backend or email service call.
    contactStatus.textContent =
      "Thanks for reaching out! Your message has been recorded.";
    contactStatus.classList.remove("error");
    contactStatus.classList.add("success");
    contactForm.reset();
  });
}

// Footer year
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Show About by default (in case JS initializes after DOM)
showSection("about");
