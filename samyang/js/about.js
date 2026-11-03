(() => {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const searchButton = document.querySelector(".search-button");
  const searchPanel = document.querySelector(".header-search-panel");
  const searchInput = document.querySelector("#site-search");
  const toTop = document.querySelector(".to-top");
  const progress = document.querySelector(".scroll-progress");
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = [...document.querySelectorAll('[role="tabpanel"]')];
  let productSwiper;

  const closeMenu = () => {
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "메뉴 열기");
    nav?.classList.remove("is-open");
  };

  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    menuButton.setAttribute("aria-label", open ? "메뉴 열기" : "메뉴 닫기");
    nav?.classList.toggle("is-open", !open);
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 760) closeMenu();
    });
  });

  searchButton?.addEventListener("click", () => {
    const open = searchButton.getAttribute("aria-expanded") === "true";
    searchButton.setAttribute("aria-expanded", String(!open));
    searchButton.setAttribute("aria-label", open ? "통합검색 열기" : "통합검색 닫기");
    if (searchPanel) searchPanel.hidden = open;
    if (!open) searchInput?.focus();
  });
  searchPanel?.addEventListener("submit", (event) => {
    event.preventDefault();
    searchInput?.focus();
  });

  const initProductSwiper = () => {
    const element = document.querySelector(".sub-product-swiper");
    if (!element || typeof Swiper === "undefined" || productSwiper) return;
    productSwiper = new Swiper(element, {
      slidesPerView: 3,
      spaceBetween: 28,
      speed: 600,
      watchOverflow: true,
      navigation: { nextEl: ".sub-product-next", prevEl: ".sub-product-prev" },
      pagination: { el: ".sub-product-pagination", type: "fraction" },
      breakpoints: {
        0: { slidesPerView: 1.15, spaceBetween: 14 },
        560: { slidesPerView: 2, spaceBetween: 18 },
        1051: { slidesPerView: 3, spaceBetween: 28 }
      }
    });
  };

  const activateTab = (tab, updateHash = true) => {
    const targetId = tab.getAttribute("aria-controls");
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => {
      const active = panel.id === targetId;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    if (updateHash) history.replaceState(null, "", "#" + tab.id);
    if (targetId === "panel-products") {
      initProductSwiper();
      requestAnimationFrame(() => productSwiper?.update());
    }
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", (event) => { event.preventDefault(); activateTab(tab); });
    tab.addEventListener("keydown", (event) => {
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus();
      activateTab(tabs[next]);
    });
  });

  const syncTabFromHash = () => {
    const hashId = location.hash.slice(1);
    const directTab = tabs.find((tab) => tab.id === hashId);
    const panelTab = tabs.find((tab) => tab.getAttribute("aria-controls") === hashId);
    const targetTab = directTab || panelTab;
    if (targetTab) activateTab(targetTab, false);
  };
  syncTabFromHash();
  window.addEventListener("hashchange", syncTabFromHash);

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) closeMenu();
  });

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header?.classList.toggle("is-scrolled", y > 10);
    toTop?.classList.toggle("is-show", y > 600);
    if (progress && max > 0) progress.style.transform = "scaleX(" + Math.min(y / max, 1) + ")";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const revealTargets = document.querySelectorAll(".about-intro, .value-card, .history-layout, .global-vision-copy, .news-card, .esg-topic, .brand-tile");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((item) => observer.observe(item));
  } else {
    revealTargets.forEach((item) => item.classList.add("is-visible"));
  }
})();