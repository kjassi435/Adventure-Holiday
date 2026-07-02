/* =====================================================================
   HOTEL DETAIL — Dynamically builds page from API data
   ===================================================================== */
(function () {
  "use strict";

  var uid = new URLSearchParams(window.location.search).get("uid");
  var container = document.getElementById("hotelContent");

  if (!uid || !container) {
    container.innerHTML = errorHTML("No hotel specified.", "Please select a hotel from the hotels listing.");
    return;
  }

  fetch("/api/hotels/" + uid + "?t=" + Date.now())
    .then(function (r) { if (!r.ok) throw new Error("Not found"); return r.json(); })
    .then(function (h) {
      if (!h || h.error) throw new Error("Not found");
      buildPage(h);
      setupForm(h);
    })
    .catch(function () {
      container.innerHTML = errorHTML("Hotel not found.", "The hotel you are looking for does not exist or has been removed.");
    });

  function errorHTML(title, desc) {
    return '<div style="text-align:center;padding:200px 20px;color:var(--muted);">' +
      '<h2>' + title + '</h2><p>' + desc + '</p>' +
      '<p><a href="hotels.html" style="color:var(--gold-deep);font-weight:600;">Browse all hotels</a></p></div>';
  }

  function buildPage(h) {
    var rooms = parseJSON(h.room_types);
    var startPrice = (rooms.length && rooms[0].price) ? rooms[0].price : "\u20B9\u2014";

    container.innerHTML =
      // HERO
      '<div class="hotel-hero">' +
        '<img id="heroImg" src="' + esc(h.image) + '" alt="' + esc(h.name) + '" />' +
        '<div class="hotel-hero__content">' +
          '<div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;">' +
            '<span class="hotel-hero__badge">' + (h.type === "resort" ? "Resort" : "Hotel") + '</span>' +
            (h.featured ? '<span class="hotel-hero__badge" style="background:var(--gold);color:#2a2008;">Featured</span>' : '') +
          '</div>' +
          '<h1>' + esc(h.name) + '</h1>' +
          '<div class="hotel-hero__meta">' +
            '<span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ' + esc(h.location) + '</span>' +
            '<span class="rating">\u2605 ' + (h.rating || "4.5") + '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // CONTENT LAYOUT (CSS class handles grid)
      '<div class="container hotel-content">' +

        // LEFT COLUMN
        '<div class="hotel-content__main">' +

          // Description
          '<div class="hotel-section">' +
            '<h2>About This Property</h2>' +
            '<p>' + esc(h.description) + '</p>' +
          '</div>' +

          // Highlights
          buildListSection("Highlights", parseJSON(h.highlights), "hotel-highlights") +

          // Amenities
          '<div class="hotel-section">' +
            '<h2>Amenities</h2>' +
            '<div class="hotel-amenities-grid" id="amenitiesGrid"></div>' +
          '</div>' +

          // Room Types
          (rooms.length ?
            '<div class="hotel-section">' +
              '<h2>Room Types</h2>' +
              // Desktop table
              '<div class="hotel-rooms-table-wrap" style="overflow-x:auto;">' +
                '<table class="hotel-rooms-table">' +
                  '<thead><tr><th>Room Type</th><th>Price/Night</th><th>Plan</th><th>Guests</th><th>Bed</th><th>Size</th></tr></thead>' +
                  '<tbody>' + rooms.map(function (r) {
                    return '<tr><td>' + esc(r.name) + '</td><td class="room-price">' + esc(r.price) + '</td><td>' + esc(r.plan) + '</td><td>' + esc(r.guests) + '</td><td>' + esc(r.bed) + '</td><td>' + esc(r.size) + '</td></tr>';
                  }).join("") +
                '</tbody></table>' +
              '</div>' +
              // Mobile cards
              '<div class="hotel-room-cards">' +
                rooms.map(function (r, i) {
                  return '<div class="hotel-room-card">' +
                    '<div class="hotel-room-card__name">' + esc(r.name) + '</div>' +
                    '<div class="hotel-room-card__price">' + esc(r.price) + ' <span style="font-size:0.75rem;font-weight:400;color:var(--muted);">/ night</span></div>' +
                    '<dl class="hotel-room-card__details">' +
                      '<div><dt>Plan</dt><dd>' + esc(r.plan) + '</dd></div>' +
                      '<div><dt>Guests</dt><dd>' + esc(r.guests) + '</dd></div>' +
                      '<div><dt>Bed</dt><dd>' + esc(r.bed) + '</dd></div>' +
                      '<div><dt>Size</dt><dd>' + esc(r.size) + '</dd></div>' +
                    '</dl>' +
                  '</div>';
                }).join("") +
              '</div>' +
            '</div>' : '') +

          // Meal Plans
          buildMealPlans(parseJSON(h.meal_plans)) +

          // Gallery
          buildGallery(parseJSON(h.gallery)) +

          // Policies
          (h.policies ? '<div class="hotel-section"><h2>Hotel Policies</h2><p>' + esc(h.policies) + '</p></div>' : '') +

          // How to Reach
          (h.how_to_reach ? '<div class="hotel-section"><h2>How to Reach</h2><p>' + esc(h.how_to_reach) + '</p></div>' : '') +

        '</div>' +

        // RIGHT SIDEBAR
        '<div class="hotel-sidebar">' +
          '<div class="hotel-sidebar__card">' +
            '<div class="hotel-sidebar__price">' +
              '<small>Starting from</small>' +
              '<strong id="sidebarPrice">' + startPrice + '</strong>' +
              '<small>per night</small>' +
            '</div>' +
            '<button class="btn btn-gold hotel-sidebar__cta" onclick="document.getElementById(\'bookingModal\').classList.add(\'active\')">Book Now</button>' +
            '<div style="margin-top:16px;text-align:center;">' +
              '<a href="https://wa.me/918448919300?text=Hi%2C%20I%27m%20interested%20in%20' + encodeURIComponent(h.name) + '" target="_blank" class="btn btn-outline" style="width:100%;justify-content:center;">WhatsApp Enquiry</a>' +
            '</div>' +
            '<div class="hotel-sidebar__help">' +
              '<p>Need help? Call us</p>' +
              '<a href="tel:+918448919300" style="font-weight:700;color:var(--emerald);font-size:1.1rem;">+91 84489 19300</a>' +
            '</div>' +
          '</div>' +
        '</div>' +

      '</div>' +

      // MOBILE FIXED BOOKING BAR
      '<div class="hotel-mobile-bar">' +
        '<div class="hotel-mobile-bar__inner">' +
          '<div class="hotel-mobile-bar__price">' +
            '<small>Starting from</small>' +
            '<strong>' + startPrice + '</strong>' +
          '</div>' +
          '<div class="hotel-mobile-bar__actions">' +
            '<a href="https://wa.me/918448919300?text=Hi%2C%20I%27m%20interested%20in%20' + encodeURIComponent(h.name) + '" target="_blank" class="btn btn-outline">WhatsApp</a>' +
            '<button class="btn btn-gold" onclick="document.getElementById(\'bookingModal\').classList.add(\'active\')">Book Now</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    // Fill amenities grid
    var amenitiesGrid = document.getElementById("amenitiesGrid");
    var amenities = parseJSON(h.amenities);
    if (amenitiesGrid && amenities.length) {
      amenitiesGrid.innerHTML = amenities.map(function (a) {
        return '<div class="hotel-amenity"><span>' + getIcon(a) + '</span><span>' + esc(a) + '</span></div>';
      }).join("");
    }

    // Set hotel name in enquiry form
    var hotelInput = document.getElementById("enquiryHotel");
    if (hotelInput) hotelInput.value = h.name;

    // Show CTA
    var cta = document.getElementById("detailCta");
    if (cta) cta.style.display = "";

    // Set page title
    document.title = esc(h.name) + " — Adventure Holiday Destination";
  }

  function buildListSection(title, items, className) {
    if (!items.length) return "";
    return '<div class="hotel-section">' +
      '<h2>' + title + '</h2>' +
      '<ul class="' + className + '">' +
        items.map(function (item) {
          return '<li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-deep)" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg> ' + esc(item) + '</li>';
        }).join("") +
      '</ul></div>';
  }

  function buildMealPlans(plans) {
    if (!plans.length) return "";
    return '<div class="hotel-section">' +
      '<h2>Meal Plans</h2>' +
      '<div class="hotel-meal-plans">' +
        plans.map(function (m) {
          return '<div class="hotel-meal-card"><h4>' + esc(m.name) + '</h4><p>' + esc(m.description) + '</p>' +
            (m.price ? '<p class="price">' + esc(m.price) + '</p>' : '') + '</div>';
        }).join("") +
      '</div></div>';
  }

  function buildGallery(images) {
    if (!images.length) return "";
    return '<div class="hotel-section">' +
      '<h2>Gallery</h2>' +
      '<div class="hotel-gallery">' +
        images.map(function (img) {
          return '<img src="' + esc(img) + '" alt="Hotel gallery" loading="lazy" />';
        }).join("") +
      '</div></div>';
  }

  function setupForm(h) {
    var form = document.getElementById("hotelBookingForm");
    if (!form) return;

    var roomSelect = document.getElementById("roomTypeSelect");
    var rooms = parseJSON(h.room_types);
    if (roomSelect && rooms.length) {
      roomSelect.innerHTML = '<option value="">Select room type</option>' +
        rooms.map(function (r) {
          return '<option value="' + esc(r.name) + '">' + esc(r.name) + ' \u2014 ' + esc(r.price) + '/night</option>';
        }).join("");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      data.hotel_uid = h.uid;
      data.hotel = h.name;

      fetch("/api/hotel-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json(); })
        .then(function () {
          var ref = "AHD-H" + Math.random().toString(36).substring(2, 8).toUpperCase();
          form.style.display = "none";
          var success = document.getElementById("bookingSuccess");
          if (success) {
            success.style.display = "";
            var refEl = success.querySelector(".ref-number");
            if (refEl) refEl.textContent = ref;
          }
        })
        .catch(function () { alert("Something went wrong. Please try again."); });
    });
  }

  function parseJSON(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === "string") { try { var p = JSON.parse(val); return Array.isArray(p) ? p : []; } catch (e) { return []; } }
    return [];
  }

  function esc(s) {
    if (!s) return "";
    var div = document.createElement("div");
    div.textContent = String(s);
    return div.innerHTML;
  }

  function getIcon(name) {
    var n = (name || "").toLowerCase();
    if (n.indexOf("wifi") > -1) return "\uD83D\uDCF6";
    if (n.indexOf("pool") > -1) return "\uD83C\uDFCA";
    if (n.indexOf("spa") > -1) return "\uD83D\uDC86";
    if (n.indexOf("restaurant") > -1 || n.indexOf("dining") > -1) return "\uD83C\uDF7D";
    if (n.indexOf("parking") > -1) return "\uD83D\uDE97";
    if (n.indexOf("gym") > -1) return "\uD83C\uDFCB";
    if (n.indexOf("room service") > -1) return "\uD83D\uDCE6";
    if (n.indexOf("bar") > -1) return "\uD83C\uDF78";
    if (n.indexOf("yoga") > -1) return "\uD83E\uDDD8";
    if (n.indexOf("raft") > -1) return "\uD83C\uDFD4";
    if (n.indexOf("safari") > -1 || n.indexOf("jungle") > -1) return "\uD83E\uDD81";
    if (n.indexOf("bonfire") > -1) return "\uD83D\uDD25";
    if (n.indexOf("conference") > -1) return "\uD83D\uDCBC";
    if (n.indexOf("kids") > -1) return "\uD83C\uDF88";
    if (n.indexOf("travel desk") > -1) return "\uD83D\uDDFA";
    if (n.indexOf("ganga") > -1 || n.indexOf("river") > -1) return "\uD83C\uDF0A";
    if (n.indexOf("valley") > -1 || n.indexOf("view") > -1) return "\uD83C\uDFD4";
    if (n.indexOf("minibar") > -1 || n.indexOf("mini bar") > -1) return "\uD83C\uDF7E";
    if (n.indexOf("library") > -1) return "\uD83D\uDCDA";
    return "\u2714";
  }

  // Nav

})();
