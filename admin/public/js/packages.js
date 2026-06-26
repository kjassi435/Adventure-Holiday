/* =====================================================================
   PACKAGES — fetches from /api/packages (live DB data)
   ===================================================================== */
(function () {
  "use strict";

  const PAGE = document.body.dataset.page || "packages";
  const grid = document.getElementById("pkgGrid");
  const noResults = document.getElementById("noResults");
  const pills = document.querySelectorAll(".filter-pill");

  let allPackages = [];
  let currentFilter = "all";

  function mapPkg(row) {
    return {
      id: row.uid || row.id,
      title: row.title || "",
      region: row.region || "",
      price: row.price || "",
      origPrice: row.orig_price || "",
      duration: row.duration || "",
      guests: row.guests || "2",
      img: row.img || "",
      rating: row.rating || 4.5,
      reviews: row.reviews || 0,
      tag: row.tag || "",
      description: row.description || "",
      highlights: typeof row.highlights === "string" ? JSON.parse(row.highlights || "[]") : (row.highlights || []),
      inclusions: typeof row.inclusions === "string" ? JSON.parse(row.inclusions || "[]") : (row.inclusions || []),
      exclusions: typeof row.exclusions === "string" ? JSON.parse(row.exclusions || "[]") : (row.exclusions || []),
      itinerary: typeof row.itinerary === "string" ? JSON.parse(row.itinerary || "[]") : (row.itinerary || []),
      howToReach: row.how_to_reach || "",
      thingsToCarry: row.things_to_carry || "",
      importantInfo: row.important_info || "",
      eligibility: row.eligibility || "",
      location: row.location || "",
      cancellation: row.cancellation || "",
    };
  }

  function getType() {
    if (PAGE === "domestic") return "domestic";
    if (PAGE === "spiritual") return "spiritual";
    return "all";
  }

  async function loadPackages() {
    try {
      const type = getType();
      const url = type === "all" ? "/api/packages" : `/api/packages?type=${type}`;
      const res = await fetch(url);
      const data = await res.json();
      allPackages = data.map(mapPkg);
      renderPackages(currentFilter);
    } catch (err) {
      console.error("Failed to load packages:", err);
      allPackages = [];
      renderPackages(currentFilter);
    }
  }

  function renderPackages(filter) {
    if (!grid) return;
    let filtered;
    if (filter === "all") {
      filtered = allPackages;
    } else {
      filtered = allPackages.filter(p =>
        p.region === filter || p.tag.toLowerCase().replace(/\s+/g, "") === filter.toLowerCase().replace(/\s+/g, "")
      );
    }
    if (filtered.length === 0) {
      grid.innerHTML = "";
      if (noResults) noResults.style.display = "block";
      return;
    }
    if (noResults) noResults.style.display = "none";
    grid.innerHTML = filtered.map(pkg => `
      <article class="pkg-card" data-category="${pkg.tag}" data-id="${pkg.id}">
        <div class="pkg-card__media" onclick="window.location.href='detail.html?id=${pkg.id}'">
          <span class="pkg-card__tag">${pkg.tag}</span>
          ${pkg.rating ? `<span class="pkg-card__rating"><svg width="12" height="12" viewBox="0 0 24 24" fill="var(--gold)" stroke="none"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg> ${pkg.rating}</span>` : ""}
          <img src="${pkg.img}" alt="${pkg.title}" loading="lazy" />
        </div>
        <div class="pkg-card__body">
          <span class="pkg-card__loc">${pkg.region}</span>
          <h3 class="pkg-card__title">${pkg.title}</h3>
          <p class="pkg-card__desc">${pkg.description ? pkg.description.slice(0, 90) + "..." : ""}</p>
          <div class="pkg-card__meta">
            <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> ${pkg.duration}</span>
            <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> ${pkg.guests}</span>
          </div>
          <div class="pkg-card__incl">${(pkg.highlights || []).slice(0, 3).map(h => `<span>${h}</span>`).join("")}</div>
          <div class="pkg-card__foot">
            <div class="pkg-card__price">
              <small>Starting from</small>
              <strong>${pkg.price}</strong>
            </div>
            <div class="pkg-card__actions">
              <a href="detail.html?id=${pkg.id}" class="pkg-btn-info" title="View Details">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                Details
              </a>
              <button type="button" class="pkg-btn-book booking-trigger" data-destination="${pkg.title}">Book Now</button>
            </div>
          </div>
        </div>
      </article>
    `).join("");
  }

  if (pills.length) {
    pills.forEach(pill => {
      pill.addEventListener("click", () => {
        pills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        currentFilter = pill.dataset.filter || "all";
        renderPackages(currentFilter);
      });
    });
  }

  loadPackages();
})();
