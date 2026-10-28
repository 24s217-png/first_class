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
    if (link.closest(".nav-dropdown")) {
      event.preventDefault();
      return;
    }
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
        slidesPerView: "auto",
        spaceBetween: 55.56,
        loop: true,
        loopAdditionalSlides: 8,
        speed: 9000,
        allowTouchMove: true,
        freeMode: {
          enabled: true,
          momentum: false,
          sticky: false
        },
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          waitForTransition: false
        },
        navigation: {
          nextEl: ".best-btn-next",
          prevEl: ".best-btn-prev"
        },
        breakpoints: {
          0: { spaceBetween: 16 },
          761: { spaceBetween: 28 },
          1501: { spaceBetween: 55.56 }
        }
      });
    }

    const mediaElement = document.querySelector(".media-swiper");
    if (mediaElement) {
      new Swiper(mediaElement, {
        slidesPerView: "auto",
        spaceBetween: 56.38,
        loop: true,
        loopAdditionalSlides: 10,
        speed: 9000,
        allowTouchMove: true,
        freeMode: {
          enabled: true,
          momentum: false,
          sticky: false
        },
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          waitForTransition: false
        },
        breakpoints: {
          0: { spaceBetween: 14 },
          761: { spaceBetween: 24 },
          1501: { spaceBetween: 56.38 }
        }
      });
    }
  }
})();