(() => {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");

  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const closeMenu = () => {
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "메뉴 열기");
    nav?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  menuButton?.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    menuButton.setAttribute("aria-label", expanded ? "메뉴 열기" : "메뉴 닫기");
    nav?.classList.toggle("is-open", !expanded);
    document.body.classList.toggle("menu-open", !expanded);
  });

  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });

  const sliderElement = document.querySelector(".b-slider");
  const previousButton = document.querySelector('.carousel-btn[data-direction="-1"]');
  const nextButton = document.querySelector('.carousel-btn[data-direction="1"]');
  const progressBar = document.querySelector(".carousel-progress-bar");
  const progressTrack = document.querySelector(".carousel-progress");

  if (sliderElement && typeof Swiper !== "undefined") {
    const bestSlider = new Swiper(sliderElement, {
      slidesPerView: 2.5,
      spaceBetween: 8,
      centeredSlides: true,
      loop: true,
      speed: 650,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      watchOverflow: true,
      breakpoints: {
        750: {
          slidesPerView: 3.5,
          spaceBetween: 16
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 22
        },
        1440: {
          slidesPerView: 4.5,
          spaceBetween: 22
        }
      },
      on: {
        init(swiper) {
          updateProgress(swiper);
        },
        slideChange(swiper) {
          updateProgress(swiper);
        },
        autoplayTimeLeft(swiper, time, progress) {
          if (progressBar) progressBar.style.width = `${(1 - progress) * 100}%`;
        }
      }
    });

    function updateProgress(swiper) {
      if (!progressTrack || !progressBar) return;
      const total = swiper.slides.length - (swiper.loopedSlides || 0) * 2;
      const current = swiper.realIndex + 1;
      const percentage = total > 0 ? (current / total) * 100 : 0;
      progressBar.style.width = `${percentage}%`;
      progressTrack.setAttribute("aria-valuenow", String(Math.round(percentage)));
    }

    previousButton?.addEventListener("click", () => bestSlider.slidePrev());
    nextButton?.addEventListener("click", () => bestSlider.slideNext());
  } else {
    // Fallback: controls remain safe if the Swiper CDN cannot load.
    previousButton?.setAttribute("disabled", "disabled");
    nextButton?.setAttribute("disabled", "disabled");
    if (progressBar) progressBar.style.width = "0";
  }
})();