(() => {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const searchButton = document.querySelector(".search-button");
  const searchPanel = document.querySelector(".header-search-panel");
  const searchInput = document.querySelector("#site-search");

  const closeMenu = () => {
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "메뉴 열기");
    nav?.classList.remove("is-open");
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "메뉴 열기" : "메뉴 닫기");
    nav?.classList.toggle("is-open", !isOpen);
  });

  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", (event) => {
    // Main navigation and submenu links are temporary placeholders for this design mockup.
    event.preventDefault();
    if (window.innerWidth <= 760) closeMenu();
  }));

  searchButton?.addEventListener("click", () => {
    const isOpen = searchButton.getAttribute("aria-expanded") === "true";
    searchButton.setAttribute("aria-expanded", String(!isOpen));
    searchButton.setAttribute("aria-label", isOpen ? "통합검색 열기" : "통합검색 닫기");
    if (searchPanel) searchPanel.hidden = isOpen;
    if (!isOpen) searchInput?.focus();
  });

  searchPanel?.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = searchInput?.value.trim();
    if (!query) {
      searchInput?.focus();
      return;
    }
    const target = "https://www.samyangfoods.com/kor/search/search.do?searchWord=" + encodeURIComponent(query);
    window.open(target, "_blank", "noopener,noreferrer");
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });

  if (typeof Swiper !== "undefined") {
    const bestElement = document.querySelector(".best-swiper");
    if (bestElement) {
      new Swiper(bestElement, {
        slidesPerView: 4,
        spaceBetween: 55.56,
        loop: true,
        speed: 600,
        allowTouchMove: true,
        navigation: {
          nextEl: ".best-btn-next",
          prevEl: ".best-btn-prev"
        },
        breakpoints: {
          0: { slidesPerView: "auto", spaceBetween: 16 },
          761: { slidesPerView: 3, spaceBetween: 20 },
          1051: { slidesPerView: 4, spaceBetween: 28 },
          1501: { slidesPerView: 4, spaceBetween: 55.56 }
        }
      });
    }
  }

  // MEDIA: 끊김 없는 무한 반복 (원본을 한 번 복제해 CSS 애니메이션으로 이동)
  const mediaTrack = document.querySelector(".media-track");
  if (mediaTrack) {
    Array.from(mediaTrack.children).forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("a").forEach((a) => a.setAttribute("tabindex", "-1"));
      mediaTrack.appendChild(clone);
    });
  }
})();
