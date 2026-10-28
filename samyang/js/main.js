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

  const track = document.querySelector(".product-track");
  const cards = Array.from(document.querySelectorAll(".product-card"));
  const progress = document.querySelector(".carousel-progress-bar");
  const controls = document.querySelectorAll(".carousel-btn");
  let activeIndex = 0;

  const visibleCards = () => {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 1200) return 3;
    return 4;
  };

  const renderCarousel = () => {
    if (!track || cards.length === 0) return;
    const visible = visibleCards();
    const maxIndex = Math.max(0, cards.length - visible);
    activeIndex = Math.min(activeIndex, maxIndex);
    const firstCard = cards[0];
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const offset = activeIndex * (firstCard.getBoundingClientRect().width + gap);
    track.style.transform = `translateX(-${offset}px)`;
    if (progress) {
      const progressWidth = ((activeIndex + visible) / cards.length) * 100;
      progress.style.width = `${Math.min(100, progressWidth)}%`;
    }
    controls.forEach((button) => {
      const direction = Number(button.dataset.direction);
      button.disabled = direction < 0 ? activeIndex === 0 : activeIndex === maxIndex;
      button.setAttribute("aria-disabled", String(button.disabled));
    });
  };

  controls.forEach((button) => {
    button.addEventListener("click", () => {
      const maxIndex = Math.max(0, cards.length - visibleCards());
      activeIndex = Math.max(0, Math.min(maxIndex, activeIndex + Number(button.dataset.direction)));
      renderCarousel();
    });
  });

  window.addEventListener("resize", renderCarousel);
  renderCarousel();
})();