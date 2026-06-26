/* =====================================================================
   DETAIL PAGE — fetches package from /api/packages/[uid]
   ===================================================================== */
(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var uid = params.get("id");
  if (!uid) { window.location.href = "domestic.html"; return; }

  var heroSection = document.getElementById("detailHero");
  var heroImg = document.getElementById("detailHeroImg");
  var heroTag = document.getElementById("detailTag");
  var heroTitle = document.getElementById("detailTitle");
  var heroRegion = document.getElementById("detailRegion");
  var statsBar = document.getElementById("detailStats");
  var layout = document.getElementById("detailLayout");
  var contentEl = document.getElementById("detailContent");
  var sidebarEl = document.getElementById("detailSidebar");
  var loadingEl = document.getElementById("detailLoading");

  function parseArr(v) {
    if (Array.isArray(v)) return v;
    if (typeof v === "string") { try { return JSON.parse(v); } catch(e) { return []; } }
    return [];
  }

  function render(pkg) {
    if (loadingEl) loadingEl.style.display = "none";

    document.title = pkg.title + " — Adventure Holiday Destination";

    if (heroSection) heroSection.style.display = "";
    if (heroImg) { heroImg.src = pkg.img || ""; heroImg.alt = pkg.title || ""; }
    if (heroTag) heroTag.textContent = pkg.tag || pkg.type || "";
    if (heroTitle) heroTitle.textContent = pkg.title || "";
    if (heroRegion) heroRegion.textContent = pkg.region || "India";

    if (statsBar) {
      statsBar.style.display = "";
      statsBar.innerHTML =
        '<div class="detail-stat"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><div><strong>' + (pkg.duration || "N/A") + '</strong><small>Duration</small></div></div>' +
        '<div class="detail-stat"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg><div><strong>' + (pkg.guests || "2") + '</strong><small>Guests</small></div></div>' +
        '<div class="detail-stat"><svg width="18" height="18" viewBox="0 0 24 24" fill="var(--gold)" stroke="none"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg><div><strong>' + (pkg.rating || "4.5") + ' (' + (pkg.reviews || 0) + ')</strong><small>Rating</small></div></div>' +
        '<div class="detail-stat"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><div><strong>' + (pkg.region || "India") + '</strong><small>Region</small></div></div>';
    }

    if (layout) layout.style.display = "";
    if (!contentEl) return;

    var html = '<h2>' + (pkg.title || "") + '</h2>';

    html += '<div class="detail-section"><h3>About This Trip</h3><p>' + (pkg.description || "No description available.") + '</p></div>';

    var highlights = parseArr(pkg.highlights);
    if (highlights.length) {
      html += '<div class="detail-section"><h3>Highlights</h3><div class="detail-highlights">';
      highlights.forEach(function(h) {
        html += '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg> ' + h + '</li>';
      });
      html += '</div></div>';
    }

    var itinerary = parseArr(pkg.itinerary);
    if (itinerary.length) {
      html += '<div class="detail-section"><h3>Itinerary</h3><div class="detail-itinerary">';
      itinerary.forEach(function(d) {
        html += '<div class="detail-itinerary__day"><strong>' + (d.day || "") + '</strong><p>' + (d.desc || d.description || "") + '</p></div>';
      });
      html += '</div></div>';
    }

    var inclusions = parseArr(pkg.inclusions);
    if (inclusions.length) {
      html += '<div class="detail-section"><h3>Inclusions</h3><div class="detail-inclusions">';
      inclusions.forEach(function(i) {
        html += '<div class="detail-inclusion"><svg width="16" height="16" viewBox="0 0 24 24" fill="var(--emerald)"><path d="M20 6L9 17l-5-5"/></svg> ' + i + '</div>';
      });
      html += '</div></div>';
    }

    var exclusions = parseArr(pkg.exclusions);
    if (exclusions.length) {
      html += '<div class="detail-section"><h3>Exclusions</h3><div class="detail-inclusions">';
      exclusions.forEach(function(x) {
        html += '<div class="detail-inclusion" style="color:#c0392b;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392b" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> ' + x + '</div>';
      });
      html += '</div></div>';
    }

    if (pkg.howToReach) html += '<div class="detail-section"><h3>How To Reach</h3><p>' + pkg.howToReach + '</p></div>';
    if (pkg.thingsToCarry) html += '<div class="detail-section"><h3>Things To Carry</h3><p>' + pkg.thingsToCarry + '</p></div>';
    if (pkg.importantInfo) html += '<div class="detail-section"><h3>Important Info</h3><p>' + pkg.importantInfo + '</p></div>';
    if (pkg.eligibility) html += '<div class="detail-section"><h3>Eligibility</h3><p>' + pkg.eligibility + '</p></div>';
    if (pkg.cancellation) html += '<div class="detail-section"><h3>Cancellation Policy</h3><p>' + pkg.cancellation + '</p></div>';

    contentEl.innerHTML = html;

    if (sidebarEl) {
      sidebarEl.innerHTML =
        '<div class="booking-sidebar__price"><span class="booking-sidebar__orig">' + (pkg.origPrice || "") + '</span><span class="booking-sidebar__current">' + (pkg.price || "") + '</span><small>per person</small></div>' +
        '<button type="button" class="btn btn-gold booking-sidebar__cta booking-trigger" data-destination="' + (pkg.title || "") + '">Book This Package <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>' +
        '<div class="booking-sidebar__features"><h4>Why Book With Us?</h4><ul>' +
        '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg> 5000+ Happy Travellers</li>' +
        '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg> 11+ Years Experience</li>' +
        '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg> 24/7 On-Trip Support</li>' +
        '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg> Best Price Guarantee</li>' +
        '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg> Customisable Itinerary</li>' +
        '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--emerald)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg> Verified Accommodations</li>' +
        '</ul></div>' +
        '<div class="booking-sidebar__help"><p>Still have questions?</p><a href="tel:+918448919300" class="btn btn-outline" style="width:100%; justify-content:center; padding:12px 20px; font-size:0.9rem;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/></svg> Connect with Team</a></div>';
    }

    var cta = document.getElementById("detailCta");
    if (cta) cta.style.display = "";

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  fetch("/api/packages/" + uid)
    .then(function(r) { return r.json(); })
    .then(function(pkg) {
      if (!pkg || pkg.error) {
        if (loadingEl) loadingEl.innerHTML = '<h2>Package not found</h2><p style="margin-top:16px;"><a href="domestic.html" class="btn btn-gold">Browse Domestic Packages</a></p>';
        return;
      }
      render(pkg);
    })
    .catch(function() {
      if (loadingEl) loadingEl.innerHTML = '<h2>Something went wrong</h2><p style="margin-top:16px;"><a href="domestic.html" class="btn btn-gold">Browse Domestic Packages</a></p>';
    });
})();
