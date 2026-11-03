(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const header = $(".site-header"), menuBtn = $(".menu-toggle"), nav = $(".primary-nav");
  const sBtn = $(".search-button"), sPanel = $(".header-search-panel"), sInput = $("#site-search");
  const progress = $(".scroll-progress"), toTop = $(".to-top");

  /* 헤더 / 모바일 메뉴 / 검색 */
  const closeMenu = () => { menuBtn.setAttribute("aria-expanded", "false"); menuBtn.setAttribute("aria-label", "메뉴 열기"); nav.classList.remove("is-open"); };
  menuBtn.addEventListener("click", () => {
    const open = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!open));
    menuBtn.setAttribute("aria-label", open ? "메뉴 열기" : "메뉴 닫기");
    nav.classList.toggle("is-open", !open);
  });
  $$("a", nav).forEach((a) => a.addEventListener("click", () => { if (innerWidth <= 760) closeMenu(); }));
  addEventListener("resize", () => { if (innerWidth > 760) closeMenu(); });
  sBtn.addEventListener("click", () => {
    const open = sBtn.getAttribute("aria-expanded") === "true";
    sBtn.setAttribute("aria-expanded", String(!open));
    sBtn.setAttribute("aria-label", open ? "통합검색 열기" : "통합검색 닫기");
    sPanel.hidden = open;
    if (!open) sInput.focus();
  });
  /* 검색: 메뉴 이름이 일치하는 페이지로 이동 (외부 사이트 연결 없음) */
  const keys = { "연혁": "company.html#history", "보도자료": "media.html#press", "esg": "esg.html" };
  sPanel.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = sInput.value.trim().toLowerCase();
    if (!q) return sInput.focus();
    const tab = $$(".sub-tab").find((t) => t.textContent.toLowerCase().includes(q));
    const target = keys[q] || (tab && tab.getAttribute("href"));
    if (target) location.href = target;
    else { sInput.value = ""; sInput.placeholder = "검색 결과가 없습니다"; sInput.focus(); }
  });

  /* Swiper */
  if (typeof Swiper !== "undefined") {
    const h = $(".history-swiper");
    if (h) new Swiper(h, {
      speed: 600, grabCursor: true,
      pagination: { el: ".history-pagination", type: "progressbar" },
      breakpoints: { 0: { slidesPerView: 1.15, spaceBetween: 16 }, 761: { slidesPerView: 2.4, spaceBetween: 20 }, 1051: { slidesPerView: 4, spaceBetween: 28 } }
    });
    const p = $(".prod-swiper");
    if (p) new Swiper(p, {
      speed: 600, allowTouchMove: true,
      navigation: { nextEl: ".best-btn-next", prevEl: ".best-btn-prev" },
      breakpoints: { 0: { slidesPerView: "auto", spaceBetween: 16 }, 761: { slidesPerView: 3, spaceBetween: 20 }, 1051: { slidesPerView: 4, spaceBetween: 28 }, 1501: { slidesPerView: 4, spaceBetween: 55.56 } }
    });
  }

  /* 스크롤: 헤더 그림자 / 진행바 / TOP */
  const onScroll = () => {
    header.classList.toggle("is-scrolled", scrollY > 10);
    const max = document.documentElement.scrollHeight - innerHeight;
    if (max > 0) progress.style.transform = "scaleX(" + Math.min(scrollY / max, 1) + ")";
    toTop.classList.toggle("is-show", scrollY > 600);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 등장 효과 + 숫자 카운트업 */
  const targets = $$(".section-title, .story-card, .esg-card, .stat, .history-swiper, .press-row, .intro-grid > *, .best-products-container");
  targets.forEach((el) => {
    el.classList.add("reveal");
    const sibs = Array.from(el.parentElement.children).filter((n) => n.matches(".story-card, .esg-card, .stat, .press-row"));
    const i = sibs.indexOf(el);
    if (i > 0) el.style.transitionDelay = i * 0.12 + "s";
  });
  const io = new IntersectionObserver((es) => es.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  targets.forEach((el) => io.observe(el));

  const count = (el) => {
    const end = Number(el.dataset.count), suf = el.dataset.suffix || "", t0 = performance.now();
    const tick = (now) => {
      const t = Math.min((now - t0) / 1800, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3))) + suf;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const cio = new IntersectionObserver((es) => es.forEach((en) => {
    if (en.isIntersecting) { count(en.target); cio.unobserve(en.target); }
  }), { threshold: 0.6 });
  $$(".stat-num[data-count]").forEach((el) => { el.textContent = "0" + (el.dataset.suffix || ""); cio.observe(el); });
})();

/* 제품 목록: 카테고리 필터 + 페이지 이동 */
(() => {
  const list = document.querySelector(".prod-grid");
  if (!list) return;
  const items = Array.from(list.children), pager = document.querySelector(".prod-pager");
  const filters = Array.from(document.querySelectorAll(".prod-filter button")), PER = 12;
  let cat = "전체보기", page = 1;
  const render = () => {
    const shown = items.filter((i) => cat === "전체보기" || i.dataset.cat === cat);
    const pages = Math.max(Math.ceil(shown.length / PER), 1);
    page = Math.min(page, pages);
    items.forEach((i) => { i.hidden = true; });
    shown.slice((page - 1) * PER, page * PER).forEach((i) => { i.hidden = false; });
    pager.innerHTML = pages < 2 ? "" :
      '<button data-p="' + (page - 1) + '"' + (page === 1 ? " disabled" : "") + ">&lt; Prev</button>" +
      Array.from({ length: pages }, (_, k) => '<button data-p="' + (k + 1) + '"' + (k + 1 === page ? ' aria-current="page"' : "") + ">" + (k + 1) + "</button>").join("") +
      '<button data-p="' + (page + 1) + '"' + (page === pages ? " disabled" : "") + ">Next &gt;</button>";
  };
  filters.forEach((b) => b.addEventListener("click", () => {
    cat = b.textContent; page = 1;
    filters.forEach((f) => f.setAttribute("aria-pressed", String(f === b)));
    render();
  }));
  pager.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-p]");
    if (!b || b.disabled) return;
    page = Number(b.dataset.p);
    render();
    document.querySelector(".prod-filter").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  render();
})();
