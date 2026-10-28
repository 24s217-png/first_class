(() => {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");

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

  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
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
        speed: 650,
        watchOverflow: true,
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
        speed: 650,
        autoplay: {
          delay: 2800,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
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