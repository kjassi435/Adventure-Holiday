/* =====================================================================
   HOTELS — Listing page: fetch, filter pills, render cards
   ===================================================================== */
(function () {
  "use strict";

  var API_BASE = "";
  var grid = document.getElementById("hotelGrid");
  var pills = document.querySelectorAll(".filter-pill");
  var hotels = [];
  var currentFilter = "all";

  function parseJSON(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { return JSON.parse(val); } catch (e) { return []; }
  }

  function getStartingPrice(h) {
    var rooms = parseJSON(h.room_types);
    if (rooms.length && rooms[0].price) return rooms[0].price;
    return "\u20B9—";
  }

  function renderHotels(filter) {
    if (!grid) return;
    var filtered;
    if (filter === "all") {
      filtered = hotels;
    } else {
      filtered = hotels.filter(function (h) {
        return (h.type || "").toLowerCase() === filter.toLowerCase();
      });
    }
    if (filtered.length === 0) {
      grid.innerHTML = '<p style="text-align:center;color:var(--muted);grid-column:1/-1;padding:3rem 0;font-size:1.05rem;">No hotels found for this filter.</p>';
      return;
    }
    grid.innerHTML = filtered.map(function (h) {
      var amenities = parseJSON(h.amenities).slice(0, 4).join(" \u2022 ");
      var price = getStartingPrice(h);
      var featuredBadge = h.featured ? '<span class="hotel-card__featured">Featured</span>' : '';
      return (
        '<a href="hotel-detail.html?uid=' + h.uid + '" class="hotel-card">' +
          '<div class="hotel-card__media">' +
            '<img src="' + (h.image || "") + '" alt="' + (h.name || "") + '" loading="lazy" />' +
            '<span class="hotel-card__badge">' + (h.type === "resort" ? "Resort" : "Hotel") + '</span>' +
            '<span class="hotel-card__rating">\u2605 ' + (h.rating || "4.5") + '</span>' +
            featuredBadge +
          '</div>' +
          '<div class="hotel-card__body">' +
            '<h3>' + (h.name || "") + '</h3>' +
            '<p class="hotel-card__location"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ' + (h.location || "") + '</p>' +
            '<p class="hotel-card__amenities">' + amenities + '</p>' +
            '<div class="hotel-card__price">' +
              '<span>Starting from</span>' +
              '<strong>' + price + '/night</strong>' +
            '</div>' +
          '</div>' +
        '</a>'
      );
    }).join("");
  }

  pills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      pills.forEach(function (p) { p.classList.remove("active"); });
      pill.classList.add("active");
      currentFilter = pill.dataset.filter;
      renderHotels(currentFilter);
    });
  });

  fetch(API_BASE + "/api/hotels?t=" + Date.now())
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (Array.isArray(data)) {
        hotels = data;
        renderHotels("all");
      }
    })
    .catch(function (e) {
      console.error("Hotel fetch error:", e);
      if (grid) grid.innerHTML = '<p style="text-align:center;color:var(--muted);grid-column:1/-1;padding:3rem 0;">Unable to load hotels. Please try again later.</p>';
    });


})();
