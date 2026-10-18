/***********************************************
 * TOPページ
 * - アニメーション：GSAP + ScrollTrigger
 * - スライダー：Splide
 * ********************************************/
const hasGsap = typeof gsap !== 'undefined' && document.documentElement.classList.contains('js');

/* ------------------------------------------------
 * アニメーション（GSAP）
 * ---------------------------------------------- */
if (hasGsap) {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // ---------- FV：写真がゆっくり拡大しながら、文字が1行ずつ表示
    const fv = document.getElementById('js-mv');
    if (fv) {
      const fvImg = fv.querySelector('.p-fv__bg img');
      const play = () => {
        const tl = gsap.timeline();
        tl.fromTo(fvImg, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.8, ease: 'sine.out' })
          .fromTo(fvImg, { scale: 1 }, { scale: 1.12, duration: 18, ease: 'sine.out' }, 0)
          .fromTo(
            '.p-fv__line > span',
            { autoAlpha: 0, y: 18, filter: 'blur(6px)' },
            { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.6, ease: 'power3.out', stagger: 0.45 },
            0.5
          )
          .fromTo(
            ['.p-fv__lead', '.p-fv__link', '.p-fv__scroll'],
            { autoAlpha: 0, y: 18, filter: 'blur(6px)' },
            { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out', stagger: 0.3 },
            2
          );
      };
      // 写真とフォントの準備ができてから開始（最大1.5秒待つ）
      const imgReady = fvImg && fvImg.decode ? fvImg.decode().catch(() => {}) : Promise.resolve();
      const fontReady = document.fonts ? document.fonts.ready : Promise.resolve();
      const timeout = new Promise((resolve) => setTimeout(resolve, 1500));
      Promise.race([Promise.all([imgReady, fontReady]), timeout]).then(play);
    }

    // ---------- 旅がくれる3つのこと：スクロールに合わせて 番号 → 見出し → 本文 の順に表示
    gsap.utils.toArray('.p-why__item').forEach((item) => {
      gsap.fromTo(
        item.querySelectorAll('.p-why__num, .p-why__title, .p-why__text'),
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: { trigger: item, start: 'top 85%', once: true },
        }
      );
    });

    // ---------- EXPERIENCE：画像のパララックス
    const expBg = document.querySelector('.p-exp__bg');
    if (expBg) {
      gsap.fromTo(
        expBg,
        { yPercent: -9 },
        {
          yPercent: 9,
          ease: 'none',
          scrollTrigger: { trigger: '.p-exp', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        }
      );
    }

    // ---------- GALLERY：写真がマスクの内側から現れる
    const galleryItems = gsap.utils.toArray('.p-gallery__item');
    if (galleryItems.length) {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.p-gallery__list', start: 'top 80%', once: true },
      });
      tl.fromTo(
        galleryItems.map((el) => el.querySelector('figure')),
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'power4.inOut', stagger: 0.16 }
      ).fromTo(
        galleryItems.map((el) => el.querySelector('img')),
        { scale: 1.3 },
        { scale: 1, duration: 2.2, ease: 'power3.out', stagger: 0.16 },
        0.1
      );
    }

    // ---------- CTA：背景画像がゆっくり動く（画面内にあるときだけ再生）
    const ctaImg = document.querySelector('.p-cta__bg img');
    if (ctaImg) {
      const drift = gsap.fromTo(
        ctaImg,
        { scale: 1.02, xPercent: 0, yPercent: 0 },
        { scale: 1.12, xPercent: -2.5, yPercent: -1.5, duration: 26, ease: 'sine.inOut', repeat: -1, yoyo: true, paused: true }
      );
      ScrollTrigger.create({
        trigger: '.p-cta',
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? drift.play() : drift.pause()),
      });
    }
  });

  // 動きを減らす設定のときは、アニメーション対象をすべて表示状態にする
  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set(['.p-fv__bg img', '.p-fv__line > span', '.p-fv__lead', '.p-fv__link', '.p-fv__scroll', '.p-why__num', '.p-why__title', '.p-why__text'], {
      autoAlpha: 1,
    });
    gsap.set('.p-gallery__item figure', { clipPath: 'none' });
  });
}

/* ------------------------------------------------
 * スライダー（Splide）
 * ---------------------------------------------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- 人気の旅先：横スクロールで写真を切り替え
const destSlider = document.getElementById('js-destSlider');
if (destSlider && typeof Splide !== 'undefined') {
  // 端で止まらないようループさせる（右端から戻れない問題の回避）
  new Splide(destSlider, {
    type: 'loop',
    autoWidth: true,
    gap: '16px',
    pagination: false,
    speed: reduceMotion ? 0 : 1100,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    drag: 'free',
    snap: true,
    flickPower: 400,
    i18n: {
      prev: '前の旅先へ',
      next: '次の旅先へ',
      carousel: 'カルーセル',
      slide: 'スライド',
      slideLabel: '%s / %s',
    },
    breakpoints: {
      810: { gap: '12px' },
    },
  }).mount();
}

// ---------- お客様の声：スライダー（独自の矢印ボタンで操作）
const voiceSlider = document.getElementById('js-voiceSlider');
if (voiceSlider && typeof Splide !== 'undefined') {
  const voice = new Splide(voiceSlider, {
    type: 'loop',
    autoWidth: true,
    gap: '16px',
    arrows: false,
    pagination: false,
    speed: reduceMotion ? 0 : 1000,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    i18n: { slideLabel: '%s / %s' },
  }).mount();
  const prev = document.getElementById('js-voicePrev');
  const next = document.getElementById('js-voiceNext');
  if (prev) prev.addEventListener('click', () => voice.go('<'));
  if (next) next.addEventListener('click', () => voice.go('>'));
}

// スライダー生成で高さが変わるため、ScrollTrigger の位置を再計算
if (hasGsap) {
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ------------------------------------------------
 * 動画モーダル
 * ---------------------------------------------- */
const movieModal = document.getElementById('js-movieModal');
const movieOpen = document.getElementById('js-movieOpen');
const movieClose = document.getElementById('js-movieClose');
if (movieModal && movieOpen && typeof movieModal.showModal === 'function') {
  const video = movieModal.querySelector('video');
  movieOpen.addEventListener('click', () => {
    movieModal.showModal();
    if (video) video.play().catch(() => {});
  });
  if (movieClose) movieClose.addEventListener('click', () => movieModal.close());
  // 背景クリックで閉じる
  movieModal.addEventListener('click', (e) => {
    if (e.target === movieModal) movieModal.close();
  });
  movieModal.addEventListener('close', () => {
    if (video) video.pause();
  });
}
