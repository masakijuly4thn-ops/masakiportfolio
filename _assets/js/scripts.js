/***********************************************
 * 共通スクリプト（全ページ）
 * - ヘッダー / ハンバーガーメニュー
 * - 汎用スクロールアニメーション（.js-reveal）
 * ********************************************/
const html = document.documentElement;
const body = document.body;
const header = document.getElementById('js-header');
const hamburgerButton = document.getElementById('js-hamburgerButton');
const headerNav = document.getElementById('js-headerNav');

// GSAP が読み込めなかった場合は、アニメーション用の非表示状態を解除して中身を必ず見せる
if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
  html.classList.remove('js');
} else {
  gsap.registerPlugin(ScrollTrigger);
}

window.addEventListener('load', () => {
  body.classList.add('is-loaded');
});

// ------------------------ mv以降 js-active付与
const updateHeader = () => {
  if (!header) return;
  const mv = document.getElementById('js-mv');
  const border = mv ? mv.clientHeight - header.clientHeight : 0;
  header.classList.toggle('js-active', window.scrollY > border);
};
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

// ------------------------ ハンバーガーメニュー
const setNav = (open) => {
  body.classList.toggle('is-navOpen', open);
  html.style.overflow = open ? 'hidden' : '';
  if (hamburgerButton) {
    hamburgerButton.setAttribute('aria-expanded', String(open));
    hamburgerButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  }
};
if (hamburgerButton) {
  hamburgerButton.addEventListener('click', () => {
    setNav(!body.classList.contains('is-navOpen'));
  });
}
// メニュー内のリンクをクリックすると閉じる
if (headerNav) {
  headerNav.addEventListener('click', (e) => {
    if (e.target.closest('a')) setNav(false);
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && body.classList.contains('is-navOpen')) {
    setNav(false);
    hamburgerButton.focus();
  }
});

// ------------------------ 汎用：スクロールでフェードイン（.js-reveal / data-delay で遅延）
if (typeof gsap !== 'undefined' && html.classList.contains('js')) {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.utils.toArray('.js-reveal').forEach((el) => {
      gsap.fromTo(
        el,
        { autoAlpha: 0, y: el.classList.contains('-fade') ? 0 : 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.4,
          delay: parseFloat(el.dataset.delay) || 0,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }
      );
    });
  });
  // 動きを減らす設定のときはアニメーションせずに表示
  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set('.js-reveal', { autoAlpha: 1 });
  });
}
