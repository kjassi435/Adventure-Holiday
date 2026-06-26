/* =====================================================================
   ADVENTURE HOLIDAY DESTINATION — main.js (Premium Edition)
   GSAP scroll reveals · parallax · counters · nav state · marquee
   Google-reviews render · contact form validation + prefill
   ===================================================================== */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";
  if (hasGSAP && typeof window.ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------- Active nav link ---------- */
  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav__links a[data-nav]").forEach((a) => {
    if ((a.getAttribute("href") || "").toLowerCase() === here) a.classList.add("active");
  });

  /* ---------- Navbar scrolled state ---------- */
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (toggle && links) {
    const close = () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  /* ---------- Scroll reveals (GSAP) ---------- */
  if (hasGSAP && !reduceMotion) {
    // generic up+fade
    gsap.utils.toArray("[data-animate='up']").forEach((el) => {
      gsap.fromTo(el, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.85, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 86%" }
      });
    });

    // staggered groups (children with data-animate='stagger')
    gsap.utils.toArray("[data-animate-group]").forEach((group) => {
      const kids = group.querySelectorAll("[data-animate='stagger']");
      if (!kids.length) return;
      gsap.fromTo(kids, { opacity: 0, y: 46 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: group, start: "top 82%" }
      });
    });

    // hero timeline
    const heroBits = gsap.utils.toArray("[data-animate='hero']");
    if (heroBits.length) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroBits.forEach((el, i) => tl.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, i * 0.12));
    }

    // parallax on split / cta media
    gsap.utils.toArray("[data-parallax]").forEach((el) => {
      const img = el.querySelector("img");
      if (!img) return;
      gsap.fromTo(img, { yPercent: -8, scale: 1.08 }, {
        yPercent: 8, ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
      });
    });
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    const run = (el) => {
      const end = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const dur = reduceMotion ? 0 : 1700;
      if (dur === 0) { el.textContent = end.toLocaleString() + suffix; return; }
      const obj = { v: 0 };
      const tween = (hasGSAP ? gsap.to(obj, {
        v: end, duration: dur / 1000, ease: "power2.out",
        onUpdate: () => { el.textContent = Math.round(obj.v).toLocaleString() + suffix; }
      }) : null);
      if (!hasGSAP) {
        const start = performance.now();
        const step = (t) => {
          const p = Math.min((t - start) / dur, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    };
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => { if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } });
      }, { threshold: 0.6 });
      counters.forEach((c) => io.observe(c));
    } else { counters.forEach(run); }
  } else if (reduceMotion) {
    counters.forEach((c) => (c.textContent = (c.dataset.count || "0") + (c.dataset.suffix || "")));
  }

  /* ---------- Marquee duplication safety ---------- */
  document.querySelectorAll(".marquee__track").forEach((track) => {
    // ensure seamless loop: track should contain two identical sets
    if (track.dataset.duped) return;
    track.dataset.duped = "1";
    track.innerHTML += track.innerHTML;
  });

  /* ---------- Smooth in-page anchors ---------- */
  const scrollOff = 90;
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    const id = a.getAttribute("href");
    if (id.length > 1) {
      a.addEventListener("click", (e) => {
        const t = document.querySelector(id);
        if (t) {
          e.preventDefault();
          window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - scrollOff, behavior: reduceMotion ? "auto" : "smooth" });
        }
      });
    }
  });

  /* ---------- Contact form ---------- */
  const form = document.querySelector("#contactForm");
  if (form) {
    const success = form.querySelector(".form__success");
    const validators = {
      name: (v) => v.trim().length >= 2 || "Please enter your full name.",
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Enter a valid email address.",
      phone: (v) => v.trim() === "" || /^[+]?[\d\s\-()]{7,}$/.test(v.trim()) || "Enter a valid phone number.",
      message: (v) => v.trim().length >= 10 || "Please add a little more detail (min 10 characters).",
    };

    const setErr = (field, on, msg) => {
      field.classList.toggle("invalid", on);
      if (on && msg) { const e = field.querySelector(".field__error"); if (e) e.textContent = msg; }
    };

    // prefill from ?package= / ?tour=
    const params = new URLSearchParams(location.search);
    const pkg = params.get("package") || params.get("tour");
    if (pkg) {
      const sel = form.querySelector("[name='destination']");
      const msg = form.querySelector("[name='message']");
      if (sel) sel.value = pkg;
      if (msg && !msg.value) msg.value = "I'm interested in the " + pkg + " package. Please share the itinerary and pricing.";
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      const data = {};
      Object.keys(validators).forEach((name) => {
        const input = form.querySelector(`[name="${name}"]`);
        if (!input) return;
        const field = input.closest(".field");
        const res = validators[name](input.value);
        if (res !== true) { setErr(field, true, res); if (ok) input.focus(); ok = false; }
        else { setErr(field, false); data[name] = input.value.trim(); }
      });
      ["destination", "date"].forEach((n) => {
        const el = form.querySelector(`[name="${n}"]`);
        if (el) data[n] = el.value;
      });
      if (!ok) return;

      if (success) {
        success.classList.add("show");
        success.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      }
      form.reset();

      // mailto fallback so enquiries actually reach the team
      const to = "info@adventureholidaydestination.com";
      const subject = encodeURIComponent("Enquiry: " + (data.destination || "Holiday Package") + " — " + (data.name || "Website Visitor"));
      const body = encodeURIComponent(
        "Name: " + (data.name || "-") +
        "\nEmail: " + (data.email || "-") +
        "\nPhone: " + (data.phone || "-") +
        "\nInterested in: " + (data.destination || "-") +
        "\nTravel Date: " + (data.date || "-") +
        "\n\nMessage:\n" + (data.message || "-")
      );
      setTimeout(() => window.open("mailto:" + to + "?subject=" + subject + "&body=" + body, "_blank"), 400);
    });

    form.querySelectorAll("input, select, textarea").forEach((el) =>
      el.addEventListener("input", () => el.closest(".field") && el.closest(".field").classList.remove("invalid"))
    );
  }

  /* ---------- 3D Carousel (homepage) ---------- */
  function buildCarouselCard(item) {
    var div = document.createElement("div");
    div.className = "carousel3d__card";
    if (item.data_dest) div.setAttribute("data-dest", item.data_dest);
    div.innerHTML =
      '<div class="carousel3d__img"><img src="' + (item.image || "") + '" alt="' + (item.name || "") + '" loading="lazy" /></div>' +
      '<div class="carousel3d__overlay">' +
        '<span class="carousel3d__tag">' + (item.tag || "") + '</span>' +
        '<h3 class="carousel3d__name">' + (item.name || "") + '</h3>' +
        '<span class="carousel3d__meta">' + (item.meta || "") + '</span>' +
        '<div class="carousel3d__actions">' +
          '<a href="' + (item.link || "#") + '" class="c3d-btn c3d-btn--outline">View Details</a>' +
          '<a href="' + (item.link || "#") + '" class="c3d-btn c3d-btn--gold">Book Now</a>' +
        '</div>' +
      '</div>';
    return div;
  }

  function populateCarousel(trackId, items) {
    var track = document.getElementById(trackId);
    if (!track || !items || !items.length) return;
    track.innerHTML = "";
    items.forEach(function(item) {
      track.appendChild(buildCarouselCard(item));
    });
  }

  function initCarousel3D(carouselId, trackId, prevId, nextId) {
    var carousel = document.getElementById(carouselId);
    if (!carousel) return;
    var track = document.getElementById(trackId);
    if (!track) return;
    var prevBtn = document.getElementById(prevId);
    var nextBtn = document.getElementById(nextId);

    var isMobile = window.innerWidth <= 768;
    var cards = Array.from(track.querySelectorAll(".carousel3d__card"));
    if (!cards.length) return;

    /* --- DESKTOP: CSS-animation infinite marquee --- */
    function setupDesktop() {
      track.classList.remove("auto-scroll", "touching", "dragging");
      track.style.transform = "";
      track.style.scrollSnapType = "";

      // Clone cards for seamless loop
      track.querySelectorAll(".carousel3d__clone").forEach(function(c) { c.remove(); });
      cards.forEach(function(card) {
        var clone = card.cloneNode(true);
        clone.classList.add("carousel3d__clone");
        track.appendChild(clone);
      });

      // Start auto-scroll via CSS animation
      requestAnimationFrame(function() {
        track.classList.add("auto-scroll");
      });

      // Pause on hover
      carousel.addEventListener("mouseenter", function() { track.classList.add("touching"); });
      carousel.addEventListener("mouseleave", function() { track.classList.remove("touching"); });

      // Pause on touch
      track.addEventListener("touchstart", function() { track.classList.add("touching"); }, { passive: true });
      track.addEventListener("touchend", function() {
        setTimeout(function() { track.classList.remove("touching"); }, 2000);
      });

      // Prev/Next buttons
      if (prevBtn) prevBtn.addEventListener("click", function() {
        track.classList.add("touching");
        var cardW = cards[0].offsetWidth + 28;
        var cur = Math.abs(parseFloat(getComputedStyle(track).transform.split(",")[4] || "0"));
        var newPos = Math.max(0, cur - cardW * 2);
        track.style.transform = "translateX(-" + newPos + "px)";
        setTimeout(function() { track.classList.remove("touching"); }, 3000);
      });
      if (nextBtn) nextBtn.addEventListener("click", function() {
        track.classList.add("touching");
        var cardW = cards[0].offsetWidth + 28;
        var cur = Math.abs(parseFloat(getComputedStyle(track).transform.split(",")[4] || "0"));
        var newPos = cur + cardW * 2;
        track.style.transform = "translateX(-" + newPos + "px)";
        setTimeout(function() { track.classList.remove("touching"); }, 3000);
      });
    }

    /* --- MOBILE: native scroll-snap --- */
    function setupMobile() {
      track.classList.remove("auto-scroll", "touching", "dragging");
      track.style.transform = "";
      track.querySelectorAll(".carousel3d__clone").forEach(function(c) { c.remove(); });
      track.style.scrollSnapType = "x mandatory";

      // Auto-scroll on mobile using JS
      var scrollDir = 1;
      var autoTimer = null;

      function startMobileAuto() {
        stopMobileAuto();
        autoTimer = setInterval(function() {
          var maxScroll = track.scrollWidth - track.clientWidth;
          if (track.scrollLeft >= maxScroll - 5) scrollDir = -1;
          if (track.scrollLeft <= 5) scrollDir = 1;
          track.scrollBy({ left: scrollDir * track.clientWidth, behavior: "smooth" });
        }, 3500);
      }

      function stopMobileAuto() {
        if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
      }

      track.addEventListener("touchstart", stopMobileAuto, { passive: true });
      track.addEventListener("touchend", function() { setTimeout(startMobileAuto, 3000); });

      startMobileAuto();

      // Prev/Next for mobile
      if (prevBtn) prevBtn.addEventListener("click", function() { track.scrollBy({ left: -track.clientWidth, behavior: "smooth" }); });
      if (nextBtn) nextBtn.addEventListener("click", function() { track.scrollBy({ left: track.clientWidth, behavior: "smooth" }); });
    }

    if (isMobile) setupMobile(); else setupDesktop();

    // Handle resize
    var resizeTimer;
    window.addEventListener("resize", function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        var nowMobile = window.innerWidth <= 768;
        if (nowMobile !== isMobile) {
          isMobile = nowMobile;
          if (isMobile) setupMobile(); else setupDesktop();
        }
      }, 200);
    });
  }

  /* ---------- Load carousel content from API and initialize ---------- */
  fetch("/api/carousel-content")
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var h = data.headings || {};
      var popularHeading = document.querySelector("#popularHeading");
      var popularSub = document.querySelector("#popularSub");
      var spirHeading = document.querySelector("#spirHeading");
      var spirSub = document.querySelector("#spirSub");
      if (popularHeading && h.popular_heading) popularHeading.textContent = h.popular_heading;
      if (popularSub && h.popular_subtitle) popularSub.textContent = h.popular_subtitle;
      if (spirHeading && h.spiritual_heading) spirHeading.textContent = h.spiritual_heading;
      if (spirSub && h.spiritual_subtitle) spirSub.textContent = h.spiritual_subtitle;

      if (data.items) {
        if (data.items.popular && data.items.popular.length) populateCarousel("carouselTrack", data.items.popular);
        if (data.items.spiritual && data.items.spiritual.length) populateCarousel("carouselTrackSpir", data.items.spiritual);
      }

      initCarousel3D("carousel3d", "carouselTrack", "c3dPrev", "c3dNext");
      initCarousel3D("carousel3dSpir", "carouselTrackSpir", "c3dSpirPrev", "c3dSpirNext");
    })
    .catch(function() {
      // fallback: initialize with hardcoded HTML cards
      initCarousel3D("carousel3d", "carouselTrack", "c3dPrev", "c3dNext");
      initCarousel3D("carousel3dSpir", "carouselTrackSpir", "c3dSpirPrev", "c3dSpirNext");
    });

  /* ---------- Footer year ---------- */
  const yr = document.querySelector("#year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
