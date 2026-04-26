(function () {
  "use strict";

  const header = document.getElementById("header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav__link");
  const contactForm = document.getElementById("contact-form");
  const yearEl = document.getElementById("year");
  const heroTyped = document.getElementById("hero-typed");
  const youtubeNotification = document.getElementById("youtube-notification");
  const youtubeClose = document.getElementById("youtube-close");

  // Footer year
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // YouTube notification
  function showYouTubeNotification() {
    if (youtubeNotification) {
      setTimeout(function() {
        youtubeNotification.classList.add("show");
        document.body.style.overflow = "hidden";
      }, 1000);
    }
  }

  function hideYouTubeNotification() {
    if (youtubeNotification) {
      youtubeNotification.classList.remove("show");
      document.body.style.overflow = "";
    }
  }

  if (youtubeClose) {
    youtubeClose.addEventListener("click", hideYouTubeNotification);
  }

  if (youtubeNotification) {
    youtubeNotification.addEventListener("click", function(e) {
      if (e.target === youtubeNotification || e.target.classList.contains("youtube-notification__overlay")) {
        hideYouTubeNotification();
      }
    });

    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && youtubeNotification.classList.contains("show")) {
        hideYouTubeNotification();
      }
    });
  }

  // Show notification on page load
  showYouTubeNotification();

  // Typing effect in hero
  if (heroTyped) {
    const words = ["Developer", "Designer", "Problem Solver", "Creator"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 80;
    const deleteSpeed = 50;
    const pauseEnd = 1500;
    const pauseStart = 400;

    function type() {
      const current = words[wordIndex];
      if (isDeleting) {
        heroTyped.textContent = current.slice(0, charIndex - 1);
        charIndex--;
      } else {
        heroTyped.textContent = current.slice(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? deleteSpeed : typeSpeed;
      if (!isDeleting && charIndex === current.length) {
        delay = pauseEnd;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = pauseStart;
      }
      setTimeout(type, delay);
    }
    setTimeout(type, 600);
  }

  // Scroll reveal
  function initReveal() {
    const reveals = document.querySelectorAll(".reveal, .reveal-left");
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }
  initReveal();

  // Count-up for stats (easing over 1.5s)
  function initCountUp() {
    const stats = document.querySelectorAll(".stat__value[data-count]");
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-count"), 10);
          const duration = 1500;
          const start = performance.now();
          function update(now) {
            const elapsed = now - start;
            const t = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - t, 2);
            const current = Math.floor(eased * target);
            el.textContent = current;
            if (t < 1) requestAnimationFrame(update);
            else el.textContent = target;
          }
          requestAnimationFrame(update);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    stats.forEach(function (el) {
      observer.observe(el);
    });
  }
  initCountUp();

  // Active nav link on scroll
  function setActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");
      if (id && scrollY >= top && scrollY < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + id) {
            link.classList.add("active");
          }
        });
      }
    });
  }
  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  // Mobile nav
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("open");
      navToggle.classList.toggle("active");
      navToggle.setAttribute(
        "aria-expanded",
        navMenu.classList.contains("open")
      );
      document.body.style.overflow = navMenu.classList.contains("open")
        ? "hidden"
        : "";
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("open");
        navToggle.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        navToggle.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  // Header scroll
  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Contact form
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = contactForm.querySelector("#name").value;
      const email = contactForm.querySelector("#email").value;
      const message = contactForm.querySelector("#message").value;
      console.log("Form submitted:", { name, email, message });
      alert("Thanks! In a real site this would send your message.");
      contactForm.reset();
    });
  }
})();
