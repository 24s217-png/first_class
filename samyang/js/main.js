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

  // 헤더: 스크롤하면 그림자
  const progress = document.querySelector(".scroll-progress");
  const toTop = document.querySelector(".to-top");
  // BRAND STORY: 스크롤 위치에 따라 한 장씩 전환
  const storySec = document.querySelector(".brand-story-sec");
  const storyCards = storySec ? Array.from(storySec.querySelectorAll(".story-card")) : [];
  const storyBars = storySec ? Array.from(storySec.querySelectorAll(".story-bars i")) : [];
  const storyCount = storySec?.querySelector(".story-count b");
  let storyIndex = -1;
  const updateStory = () => {
    if (!storySec || !storyCards.length) return;
    const headerH = header ? header.offsetHeight : 90;
    const travel = storySec.offsetHeight - (window.innerHeight - headerH);
    const progress = (headerH - storySec.getBoundingClientRect().top) / travel;
    const index = Math.max(0, Math.min(storyCards.length - 1, Math.floor(Math.max(0, Math.min(progress, 0.9999)) * storyCards.length)));
    if (index === storyIndex) return;
    storyIndex = index;
    storyCards.forEach((card, i) => {
      card.classList.toggle("is-active", i === index);
      card.classList.toggle("is-past", i < index);
    });
    storyBars.forEach((bar, i) => bar.classList.toggle("is-active", i === index));
    if (storyCount) storyCount.textContent = "0" + (index + 1);
  };
  window.addEventListener("resize", updateStory);

  const onScroll = () => {
    updateStory();
    header?.classList.toggle("is-scrolled", window.scrollY > 10);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress && max > 0) progress.style.transform = "scaleX(" + Math.min(window.scrollY / max, 1) + ")";
    toTop?.classList.toggle("is-show", window.scrollY > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 스크롤 등장 효과
  const groups = [
    ".section-title", ".media-header .media-more-btn", ".best-products-container",
    ".esg-card", ".stat", ".media-marquee", ".support-title", ".support-actions"
  ];
  const targets = document.querySelectorAll(groups.join(","));
  targets.forEach((el) => {
    el.classList.add("reveal");
    const siblings = el.parentElement ? Array.from(el.parentElement.children).filter((n) => n.matches(".story-card, .esg-card, .stat")) : [];
    const index = siblings.indexOf(el);
    if (index > 0) el.style.transitionDelay = index * 0.12 + "s";
  });
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach((el) => io.observe(el));
  } else {
    targets.forEach((el) => el.classList.add("is-visible"));
  }

  // 숫자 카운트업
  const counters = document.querySelectorAll(".stat-num[data-count]");
  const runCount = (el) => {
    const end = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const start = performance.now();
    const duration = 1800;
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3))) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCount(entry.target);
          countIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => { el.textContent = "0" + (el.dataset.suffix || ""); countIO.observe(el); });
  }

  // 흐르는 줄(MEDIA, 텍스트 띠): 한 번 복제해 끊김 없이 반복
  document.querySelectorAll(".media-track, .text-band-track").forEach((track) => {
    Array.from(track.children).forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("a").forEach((a) => a.setAttribute("tabindex", "-1"));
      track.appendChild(clone);
    });
  });
})();
