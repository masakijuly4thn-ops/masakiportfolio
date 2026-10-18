/***********************************************
 * Const
 * ********************************************/
const html = document.documentElement;
const body = document.body;
// 動きを減らす設定
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// マウス操作の端末か
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ハンバーガーボタン
const hamburgerButton = document.getElementById('js-hamburgerButton');

// ハンバーガーメニュー
const header = document.getElementById('js-header');
const headerNav = document.getElementById('js-headerNav');
const mv = document.getElementById('js-mv');

/***********************************************
 * Method
 * ********************************************/
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const pad = (n) => String(n).padStart(2, '0');

// ------------------------ 文字分割
// .js-split の文字を <span class="char" style="--i:n"> に分割（<br> ごとに .line で包む）
const splitText = (elem) => {
  const lines = elem.innerHTML.split(/<br\s*\/?>/i);
  let index = 0;
  elem.innerHTML = lines.map((line) => {
    // 句読点は直前の文字とまとめ、行頭に来ないようにする（inline-block では禁則処理が効かないため）
    const units = [];
    Array.from(line.trim()).forEach((char) => {
      if (/[、。，．」』）！？]/.test(char) && units.length) {
        units[units.length - 1] += char;
      } else {
        units.push(char);
      }
    });
    const chars = units.map((char) => {
      const span = `<span class="char" style="--i:${index}">${char}</span>`;
      index++;
      return span;
    }).join('');
    return `<span class="line">${chars}</span>`;
  }).join('');
  elem.setAttribute('aria-label', lines.map((line) => line.trim()).join(''));
};
document.querySelectorAll('.js-split').forEach(splitText);

// ------------------------ ローディング
// ページ内画像の読み込み具合に合わせてバーを伸ばし、完了したら幕を上げる
const loaderBar = document.getElementById('js-loaderBar');
const loaderStart = performance.now();
const LOADER_MIN = reduceMotion ? 0 : 1800;
const LOADER_MAX = 6000;
let loaded = false;

const finishLoading = () => {
  if (loaded) return;
  loaded = true;
  if (loaderBar) loaderBar.style.setProperty('--progress', 1);
  const wait = Math.max(0, LOADER_MIN - (performance.now() - loaderStart));
  setTimeout(() => {
    body.classList.remove('is-loading');
    body.classList.add('is-loaded');
    document.dispatchEvent(new CustomEvent('opened'));
  }, wait + (reduceMotion ? 0 : 300));
};

(() => {
  const images = Array.from(document.images);
  let count = 0;
  const update = () => {
    count++;
    if (loaderBar) loaderBar.style.setProperty('--progress', count / images.length);
    if (count >= images.length) finishLoading();
  };
  if (!images.length) {
    finishLoading();
    return;
  }
  images.forEach((img) => {
    if (img.complete) {
      update();
    } else {
      img.addEventListener('load', update, { once: true });
      img.addEventListener('error', update, { once: true });
    }
  });
  // 読み込みが遅い場合でも待たせすぎない
  setTimeout(finishLoading, LOADER_MAX);
})();

// ------------------------ ページ内リンク
let scroll = new SmoothScroll('a[href*="#"]', {
  speed: 900, // スクロールする速さ
  speedAsDuration: true,
  easing: 'easeInOutCubic',
  header: '#js-header',
});

// ------------------------ ハンバーガーメニュー
const toggleHeaderNav = (open) => {
  body.classList.toggle('is-navOpen', open);
  html.style.overflow = open ? 'hidden' : '';
  hamburgerButton.setAttribute('aria-expanded', open);
  hamburgerButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
};
if (hamburgerButton) {
  hamburgerButton.addEventListener('click', () => {
    toggleHeaderNav(!body.classList.contains('is-navOpen'));
  });
}
// ハンバーガーメニュー内のリンクをクリックすると閉じる
if (headerNav) {
  headerNav.addEventListener('click', (e) => {
    if (e.target.closest('a') && body.classList.contains('is-navOpen')) {
      toggleHeaderNav(false);
    }
  });
}

// ------------------------ 現在地のナビをハイライト
(() => {
  const links = document.querySelectorAll('.l-headerNav__link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((link) => {
        link.classList.toggle('is-current', link.getAttribute('href') === `#${e.target.id}`);
      });
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  links.forEach((link) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) observer.observe(target);
  });
})();

// ------------------------ inview
// .iv が画面内に入ったら .view を付与（一度きり）
const inviewObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('view');
      observer.unobserve(e.target);
    }
  });
}, {
  rootMargin: '0px 0px -10% 0px', // 画面下10%手前で判定
  threshold: 0.15, // 縦長の要素（SPのカード一覧など）でも発火するよう15%で判定
});
// MVの演出が終わってから監視を始める（ローディング中に発火させない）
document.addEventListener('opened', () => {
  document.querySelectorAll('.iv').forEach((elem) => inviewObserver.observe(elem));
});

// ------------------------ 価格のカウントアップ
(() => {
  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const countUp = (elem) => {
    const to = Number(elem.dataset.to);
    const duration = 1800;
    let start = null;
    const step = (now) => {
      if (start === null) start = now;
      const t = clamp((now - start) / duration, 0, 1);
      elem.textContent = Math.round(to * easeOutExpo(t)).toLocaleString('ja-JP');
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const counts = document.querySelectorAll('.js-count');
  if (reduceMotion) {
    counts.forEach((elem) => { elem.textContent = Number(elem.dataset.to).toLocaleString('ja-JP'); });
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      observer.unobserve(e.target);
      // カードがせり上がるのを待ってから数え始める
      setTimeout(() => countUp(e.target), 600);
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  document.addEventListener('opened', () => {
    counts.forEach((elem) => observer.observe(elem));
  });
})();

// ------------------------ スクロール連動（ヘッダー / 進捗バー / パララックス / MV）
(() => {
  const progress = document.getElementById('js-progress');
  const parallaxes = Array.from(document.querySelectorAll('[data-parallax]'));
  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;

    // ヘッダー：MVを過ぎたら背景、下スクロールで隠し上スクロールで表示
    header.classList.toggle('is-scrolled', y > 80);
    if (Math.abs(y - lastY) > 6) {
      header.classList.toggle('is-hidden', y > lastY && y > vh * 0.6);
      lastY = y;
    }

    // ページ全体の進捗
    if (progress) progress.style.setProperty('--progress', max > 0 ? y / max : 0);

    if (!reduceMotion) {
      // MV：スクロール量 0〜1
      if (mv) mv.style.setProperty('--mv', clamp(y / mv.offsetHeight, 0, 1).toFixed(4));

      // パララックス：画面中央からの距離に比例して動かす
      parallaxes.forEach((elem) => {
        const rect = elem.parentElement.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        const speed = parseFloat(elem.dataset.parallax) || 0.1;
        const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
        const limit = rect.height * 0.11; // inset -12% の範囲内に収める
        elem.style.setProperty('--y', `${clamp(offset, -limit, limit).toFixed(2)}px`);
      });
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// ------------------------ スライダー
// 表示中に .is-active、1つ前に .is-prev。切り替え演出はCSS側
class FadeSlider {
  constructor({ root, prev, next, current, total, progress, interval = 6000, autoplay = true }) {
    this.slides = Array.from(root.children);
    this.root = root;
    this.current = current;
    this.progress = progress;
    this.interval = interval;
    this.autoplay = autoplay && !reduceMotion;
    this.index = 0;
    this.busy = false;
    this.timer = null;
    if (total) total.textContent = pad(this.slides.length);
    if (prev) prev.addEventListener('click', () => this.go(this.index - 1, true));
    if (next) next.addEventListener('click', () => this.go(this.index + 1));
    this.setCount(1, false);
    this.addSwipe();
  }

  start() {
    if (!this.autoplay) return;
    clearTimeout(this.timer);
    if (this.progress) {
      this.progress.style.setProperty('--duration', `${this.interval}ms`);
      this.progress.classList.remove('is-running');
      void this.progress.offsetWidth; // アニメーションを最初から再生させる
      this.progress.classList.add('is-running');
    }
    this.timer = setTimeout(() => this.go(this.index + 1), this.interval);
  }

  go(target, reverse = false) {
    if (this.busy) return;
    this.busy = true;
    const length = this.slides.length;
    const nextIndex = (target + length) % length;
    const prevSlide = this.slides[this.index];
    const nextSlide = this.slides[nextIndex];

    this.root.classList.toggle('is-reverse', reverse);
    void this.root.offsetWidth; // 向きを確定させてから切り替える
    this.slides.forEach((slide) => slide.classList.remove('is-prev'));
    prevSlide.classList.remove('is-active');
    prevSlide.classList.add('is-prev');
    nextSlide.classList.add('is-active');
    this.index = nextIndex;
    this.setCount(nextIndex + 1, true);

    setTimeout(() => { this.busy = false; }, 1000);
    this.start();
  }

  // 数字が上へ抜け、新しい数字が下から入る
  setCount(num, animate) {
    if (!this.current) return;
    if (!animate || reduceMotion) {
      this.current.textContent = pad(num);
      return;
    }
    this.current.classList.remove('is-in');
    this.current.classList.add('is-out');
    setTimeout(() => {
      this.current.textContent = pad(num);
      this.current.classList.remove('is-out');
      this.current.classList.add('is-in');
    }, 400);
  }

  addSwipe() {
    let startX = null;
    this.root.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
    this.root.addEventListener('touchend', (e) => {
      if (startX === null) return;
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 40) this.go(this.index + (diff < 0 ? 1 : -1), diff > 0);
      startX = null;
    });
  }
}

(() => {
  const mvRoot = document.getElementById('js-mvSlider');
  if (mvRoot) {
    const mvSlider = new FadeSlider({
      root: mvRoot,
      prev: document.getElementById('js-mvPrev'),
      next: document.getElementById('js-mvNext'),
      current: document.getElementById('js-mvCurrent'),
      total: document.getElementById('js-mvTotal'),
      progress: document.getElementById('js-mvProgress'),
      interval: 6500,
    });
    // ローディング明け、見出しが出揃ってから自動送りを始める
    document.addEventListener('opened', () => setTimeout(() => mvSlider.start(), 2000));
  }
  const spaceRoot = document.getElementById('js-spaceSlider');
  if (spaceRoot) {
    new FadeSlider({
      root: spaceRoot,
      prev: document.getElementById('js-spacePrev'),
      next: document.getElementById('js-spaceNext'),
      current: document.getElementById('js-spaceCurrent'),
      total: document.getElementById('js-spaceTotal'),
      autoplay: false,
    });
  }
})();

// ------------------------ カスタムカーソル
if (finePointer && !reduceMotion) {
  const cursor = document.getElementById('js-cursor');
  const dot = document.getElementById('js-cursorDot');
  if (cursor && dot) {
    html.classList.add('has-cursor');
    const mouse = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.style.setProperty('--x', `${mouse.x}px`);
      dot.style.setProperty('--y', `${mouse.y}px`);
    }, { passive: true });

    // リングは少し遅れてついてくる
    const render = () => {
      ring.x = lerp(ring.x, mouse.x, 0.16);
      ring.y = lerp(ring.y, mouse.y, 0.16);
      cursor.style.setProperty('--x', `${ring.x.toFixed(2)}px`);
      cursor.style.setProperty('--y', `${ring.y.toFixed(2)}px`);
      requestAnimationFrame(render);
    };
    render();

    document.addEventListener('mouseover', (e) => {
      const view = e.target.closest('[data-cursor="view"]');
      const link = e.target.closest('a, button');
      cursor.classList.toggle('is-view', !!view);
      cursor.classList.toggle('is-link', !view && !!link);
      dot.classList.toggle('is-hidden', !!view);
    });
    document.addEventListener('mouseleave', () => {
      cursor.classList.add('is-hidden');
      dot.classList.add('is-hidden');
    });
    document.addEventListener('mouseenter', () => {
      cursor.classList.remove('is-hidden');
      dot.classList.remove('is-hidden');
    });
  }
}

// ------------------------ マグネットボタン（カーソルに少し引き寄せられる）
if (finePointer && !reduceMotion) {
  document.querySelectorAll('.js-magnetic').forEach((button) => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      button.style.setProperty('--mx', `${(x * 0.25).toFixed(2)}px`);
      button.style.setProperty('--my', `${(y * 0.35).toFixed(2)}px`);
    });
    button.addEventListener('mouseleave', () => {
      button.style.setProperty('--mx', '0px');
      button.style.setProperty('--my', '0px');
    });
  });
}

// ------------------------ コースカードの3D傾き + 光沢
if (finePointer && !reduceMotion) {
  document.querySelectorAll('.js-tilt').forEach((card) => {
    const MAX = 7; // 最大傾き(deg)
    card.addEventListener('mouseenter', () => {
      card.classList.add('is-ready', 'is-tilting');
    });
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      card.style.setProperty('--ry', `${((px - 0.5) * MAX * 2).toFixed(2)}deg`);
      card.style.setProperty('--rx', `${((0.5 - py) * MAX * 2).toFixed(2)}deg`);
      card.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-tilting');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

// ------------------------ ギャラリーのライトボックス
(() => {
  const lightbox = document.getElementById('js-lightbox');
  const items = Array.from(document.querySelectorAll('.js-lightbox'));
  if (!lightbox || !items.length) return;
  const img = document.getElementById('js-lightboxImg');
  const caption = document.getElementById('js-lightboxCaption');
  const closeButton = document.getElementById('js-lightboxClose');
  let index = 0;
  let lastFocus = null;

  const set = (i) => {
    index = (i + items.length) % items.length;
    const source = items[index].querySelector('img');
    img.src = source.src;
    img.alt = source.alt;
    caption.textContent = source.alt;
  };
  // 写真を横にずらしながら差し替える
  const change = (dir) => {
    img.style.setProperty('--dir', `${dir * -24}px`);
    img.classList.add('is-changing');
    setTimeout(() => {
      set(index + dir);
      img.style.setProperty('--dir', `${dir * 24}px`);
      requestAnimationFrame(() => img.classList.remove('is-changing'));
    }, 300);
  };
  const open = (i) => {
    lastFocus = document.activeElement;
    set(i);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    html.style.overflow = 'hidden';
    closeButton.focus();
  };
  const close = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    html.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };

  items.forEach((item, i) => item.addEventListener('click', () => open(i)));
  closeButton.addEventListener('click', close);
  document.getElementById('js-lightboxPrev').addEventListener('click', () => change(-1));
  document.getElementById('js-lightboxNext').addEventListener('click', () => change(1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') change(-1);
    if (e.key === 'ArrowRight') change(1);
  });
})();

// ------------------------ ページ内のimg要素サイズを取得
const myFunc = function (src) {
  return new Promise(function (resolve, reject) {
    const image = new Image();
    image.src = src;
    image.onload = function () {
      resolve(image);
    };
    image.onerror = function (error) {
      reject(error);
    };
  });
};
const imgs = document.querySelectorAll('img[src]:not([src=""])');
for (const img of imgs) {
  const src = img.getAttribute('src');
  myFunc(src)
    .then(function (res) {
      if (!img.hasAttribute('width')) {
        img.setAttribute('width', res.width);
      }
      if (!img.hasAttribute('height')) {
        img.setAttribute('height', res.height);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
