(() => {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const searchButton = document.querySelector(".search-button");
  const searchPanel = document.querySelector(".header-search-panel");
  const searchInput = document.querySelector("#site-search");
  const toTop = document.querySelector(".to-top");
  const progress = document.querySelector(".scroll-progress");

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

  const revealTargets = document.querySelectorAll(".about-intro, .value-card, .history-layout, .global-vision-copy");
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