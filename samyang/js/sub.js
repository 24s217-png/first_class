(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const header = $(".site-header"), menuBtn = $(".menu-toggle"), nav = $(".primary-nav");
  const sBtn = $(".search-button"), sPanel = $(".header-search-panel"), sInput = $("#site-search");
  const progress = $(".scroll-progress"), toTop = $(".to-top");

  /* 헤더 / 모바일 메뉴 / 검색 (공통 동작은 main.js와 동일) */
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

  /* 탭 */
  const tabs = $$(".sub-tab"), panels = $$(".tab-panel");
  const swipers = new Set();
  const initSwipers = (panel) => {
    if (typeof Swiper === "undefined" || swipers.has(panel.id)) return;
    swipers.add(panel.id);
    const h = $(".history-swiper", panel);
    if (h) new Swiper(h, {
      speed: 600, grabCursor: true,
      pagination: { el: ".history-pagination", type: "progressbar" },
      breakpoints: { 0: { slidesPerView: 1.15, spaceBetween: 16 }, 761: { slidesPerView: 2.4, spaceBetween: 20 }, 1051: { slidesPerView: 4, spaceBetween: 28 } }
    });
    const p = $(".prod-swiper", panel);
    if (p) new Swiper(p, {
      speed: 600, allowTouchMove: true,
      navigation: { nextEl: ".best-btn-next", prevEl: ".best-btn-prev" },
      breakpoints: { 0: { slidesPerView: "auto", spaceBetween: 16 }, 761: { slidesPerView: 3, spaceBetween: 20 }, 1051: { slidesPerView: 4, spaceBetween: 28 }, 1501: { slidesPerView: 4, spaceBetween: 55.56 } }
    });
  };
  const activate = (id) => {
    const panel = panels.find((p) => p.id === id) || panels[0];
    panels.forEach((p) => { p.hidden = p !== panel; });
    tabs.forEach((t) => {
      const on = t.dataset.tab === panel.id;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on) t.scrollIntoView({ block: "nearest", inline: "center" });
    });
    initSwipers(panel);
    return panel;
  };
  const route = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const el = id && document.getElementById(id);
    const panel = activate(el ? (el.closest(".tab-panel") || el).id : "about");
    if (el && el !== panel) el.scrollIntoView();
    else if (scrollY > $(".sub-hero").offsetHeight) scrollTo({ top: $(".sub-hero").offsetHeight });
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => { location.hash = t.dataset.tab; });
    t.addEventListener("keydown", (e) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      const n = tabs[(i + d + tabs.length) % tabs.length];
      n.focus(); location.hash = n.dataset.tab;
    });
  });
  addEventListener("hashchange", route);

  /* 검색: 페이지 내부 탭/내용에서 찾아 이동 (외부 사이트 연결 없음) */
  sPanel.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = sInput.value.trim().toLowerCase();
    if (!q) return sInput.focus();
    const hit = panels.find((p) => p.textContent.toLowerCase().includes(q) || $(`.sub-tab[data-tab="${p.id}"]`).textContent.toLowerCase().includes(q));
    if (hit) { location.hash = hit.id; sBtn.click(); }
    else { sInput.value = ""; sInput.placeholder = "검색 결과가 없습니다"; sInput.focus(); }
  });

  /* 스크롤: 헤더 그림자 / 진행바 / TOP */
  const onScroll = () => {
    header.classList.toggle("is-scrolled", scrollY > 10);
    const max = document.documentElement.scrollHeight - innerHeight;
    if (max > 0) progress.style.transform = "scaleX(" + Math.min(scrollY / max, 1) + ")";
    toTop.classList.toggle("is-show", scrollY > 600);
  };
  addEventListener("scroll", onScroll, { passive: true });

  /* 등장 효과 + 숫자 카운트업 (탭이 열릴 때 실행됨) */
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

  route();
  onScroll();
})();
