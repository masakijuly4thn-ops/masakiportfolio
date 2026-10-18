<?php
require_once __DIR__ . '/config.php';

// 人気の旅先
$destinations = [
  ['slug' => 'italy', 'name' => 'イタリア', 'catch' => '街を歩くだけで、映画の世界。', 'img' => 'dest-italy.jpg', 'w' => 900, 'h' => 960, 'alt' => '岩山の斜面に色とりどりの家々が建ち並ぶイタリアの海辺の街'],
  ['slug' => 'kyoto', 'name' => '京都', 'catch' => '四季が彩る、特別な時間。', 'img' => 'dest-kyoto.jpg', 'w' => 900, 'h' => 960, 'alt' => '夕暮れの石畳の路地の先に建つ京都・八坂の塔'],
  ['slug' => 'hokkaido', 'name' => '北海道', 'catch' => '広がる大地と、食のしあわせ。', 'img' => 'dest-hokkaido.jpg', 'w' => 900, 'h' => 960, 'alt' => '一面に咲く北海道のラベンダー畑'],
  ['slug' => 'okinawa', 'name' => '沖縄', 'catch' => '青い海と、ゆるやかな時間。', 'img' => 'dest-okinawa.jpg', 'w' => 900, 'h' => 960, 'alt' => '透明度の高いエメラルドグリーンの沖縄の海と緑の島'],
  ['slug' => 'switzerland', 'name' => 'スイス', 'catch' => '湖と山がつくる、澄んだ景色。', 'img' => 'gallery04.jpg', 'w' => 1000, 'h' => 834, 'alt' => '山々に囲まれたスイスの湖に浮かぶ小舟'],
  ['slug' => 'south-france', 'name' => '南フランス', 'catch' => '石畳の路地に、花がこぼれる。', 'img' => 'gallery03.jpg', 'w' => 1000, 'h' => 834, 'alt' => '花の鉢植えが並ぶ石造りの細い路地'],
];

// ギャラリー
$gallery = [
  ['img' => 'gallery01.jpg', 'w' => 1000, 'h' => 834, 'alt' => 'カラフルな家並みと教会のドームの先に広がるポジターノの海'],
  ['img' => 'gallery02.jpg', 'w' => 1000, 'h' => 834, 'alt' => '焼き菓子と花が並ぶ朝食のテーブル'],
  ['img' => 'gallery03.jpg', 'w' => 1000, 'h' => 834, 'alt' => '花の鉢植えが並ぶ石造りの細い路地'],
  ['img' => 'gallery04.jpg', 'w' => 1000, 'h' => 834, 'alt' => '山々を映す静かな湖に浮かぶ小舟'],
];

// お客様の声
$voices = [
  ['title' => '一生の思い出になりました。', 'text' => '初めてのヨーロッパ旅行でしたが、安心して楽しめました。また利用したいです！', 'meta' => '20代・女性', 'img' => 'voice01.jpg'],
  ['title' => '想像以上の体験ができた。', 'text' => '現地の文化や食事を深く知ることができて、本当に充実した旅になりました。', 'meta' => '30代・男性', 'img' => 'voice02.jpg'],
  ['title' => '丁寧なサポートで安心。', 'text' => '出発前から帰国まで、丁寧に対応していただき、安心して旅を楽しめました。', 'meta' => '20代・女性', 'img' => 'voice03.jpg'],
  ['title' => '家族みんなの宝物に。', 'text' => '子ども連れでも無理のない旅程を提案してもらえて、家族全員が笑顔で過ごせました。', 'meta' => '40代・女性', 'img' => 'voice01.jpg'],
  ['title' => '一人旅の不安が消えました。', 'text' => '現地での過ごし方まで相談にのってもらえたので、初めての一人旅でも心強かったです。', 'meta' => '30代・女性', 'img' => 'voice03.jpg'],
];

// ページ固有の構造化データ（人気の旅先一覧）
$dest_items = [];
foreach ($destinations as $i => $d) {
  $dest_items[] = [
    '@type' => 'ListItem',
    'position' => $i + 1,
    'item' => [
      '@type' => 'TouristDestination',
      'name' => $d['name'],
      'description' => $d['catch'],
      'url' => SITE_URL . '/destinations/' . $d['slug'] . '/',
      'image' => SITE_URL . '/assets/images/top/' . $d['img'],
    ],
  ];
}

$page_meta = [
  'title' => 'Tabito（タビト）｜旅で、日常を少し、好きになる。国内・海外の旅先さがし',
  'description' => SITE_DESCRIPTION,
  'path' => '/',
  'ld' => [
    [
      '@type' => 'ItemList',
      'name' => '人気の旅先',
      'itemListElement' => $dest_items,
    ],
  ],
];

function h($str)
{
  return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}

require 'header.php';
?>
<main class="l-main" id="main">

  <!-- ============ FV ============ -->
  <section class="p-fv" id="js-mv" aria-labelledby="fv-title">
    <div class="p-fv__bg">
      <img src="./assets/images/top/fv.jpg" alt="夕日に染まるイタリア・ポジターノの海と、断崖に建ち並ぶ街並み" width="2000" height="1500" fetchpriority="high" decoding="async">
    </div>
    <div class="p-fv__content">
      <h1 class="p-fv__title" id="fv-title">
        <span class="p-fv__line"><span>旅で、</span></span>
        <span class="p-fv__line"><span>日常を少し、</span></span>
        <span class="p-fv__line"><span>好きになる。</span></span>
      </h1>
      <p class="p-fv__lead">まだ見たことのない景色、まだ知らない食べもの。<br>旅は、いつもの毎日をちょっとだけ特別にしてくれる。</p>
      <a href="#destinations" class="c-linkLine p-fv__link">旅をさがす</a>
    </div>
    <div class="p-fv__scroll" aria-hidden="true">
      <span class="p-fv__scrollText">Scroll</span>
      <span class="p-fv__scrollLine"></span>
    </div>
  </section>

  <!-- ============ 人気の旅先 ============ -->
  <section class="p-dest" id="destinations" aria-labelledby="dest-title">
    <div class="p-dest__side">
      <img src="./assets/images/top/destinations-side.jpg" alt="ツタに覆われた建物が並ぶヨーロッパの細い路地" width="1000" height="1508" loading="lazy" decoding="async">
    </div>
    <div class="p-dest__body">
      <div class="p-dest__head">
        <hgroup class="c-secTitle js-reveal">
          <p class="c-secTitle__en" lang="en">Destinations</p>
          <h2 class="c-secTitle__ja" id="dest-title">人気の旅先</h2>
        </hgroup>
        <a href="#destinations" class="c-linkArrow js-reveal">すべての旅先を見る</a>
      </div>
      <div class="splide p-dest__slider" id="js-destSlider" aria-label="人気の旅先一覧">
        <div class="splide__arrows">
          <button class="splide__arrow splide__arrow--prev c-arrowCircle -prev" type="button" aria-label="前の旅先へ">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 12h15m-5-5 5 5-5 5" /></svg>
          </button>
          <button class="splide__arrow splide__arrow--next c-arrowCircle" type="button" aria-label="次の旅先へ">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M4 12h15m-5-5 5 5-5 5" /></svg>
          </button>
        </div>
        <div class="splide__track">
          <ul class="splide__list">
            <?php foreach ($destinations as $d) : ?>
              <li class="splide__slide">
                <article class="p-destCard">
                  <a href="./destinations/<?php echo h($d['slug']); ?>/" class="p-destCard__link">
                    <figure class="p-destCard__img">
                      <img src="./assets/images/top/<?php echo h($d['img']); ?>" alt="<?php echo h($d['alt']); ?>" width="<?php echo $d['w']; ?>" height="<?php echo $d['h']; ?>" loading="lazy" decoding="async">
                    </figure>
                    <h3 class="p-destCard__name"><?php echo h($d['name']); ?></h3>
                    <p class="p-destCard__text"><?php echo h($d['catch']); ?></p>
                  </a>
                </article>
              </li>
            <?php endforeach; ?>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ 旅がくれる3つのこと ============ -->
  <section class="p-why" id="why" aria-labelledby="why-title">
    <div class="p-why__inner">
      <div class="p-why__head">
        <hgroup class="c-secTitle">
          <p class="c-secTitle__en js-reveal" lang="en">Why Travel</p>
          <h2 class="c-secTitle__ja js-reveal" id="why-title" data-delay="0.15">旅がくれる<br>3つのこと</h2>
        </hgroup>
        <p class="p-why__lead js-reveal" data-delay="0.3">旅は、ただの観光じゃない。<br>知らない景色や人との出会いが、<br>いつもの毎日に新しい視点をくれます。</p>
      </div>
      <ol class="p-why__list">
        <li class="p-why__item js-reveal">
          <span class="p-why__num" aria-hidden="true">01</span>
          <div class="p-why__body">
            <h3 class="p-why__title">新しい価値観に出会える</h3>
            <p class="p-why__text">まだ知らない文化や暮らしに触れることで、世界の見え方が少し変わります。</p>
          </div>
        </li>
        <li class="p-why__item js-reveal">
          <span class="p-why__num" aria-hidden="true">02</span>
          <div class="p-why__body">
            <h3 class="p-why__title">心がリフレッシュする</h3>
            <p class="p-why__text">日常から離れて、自然や街の空気を感じることで、気持ちが軽くなります。</p>
          </div>
        </li>
        <li class="p-why__item js-reveal">
          <span class="p-why__num" aria-hidden="true">03</span>
          <div class="p-why__body">
            <h3 class="p-why__title">自分らしさを見つけられる</h3>
            <p class="p-why__text">さまざまな体験を通して、新しい自分に出会えるきっかけになります。</p>
          </div>
        </li>
      </ol>
    </div>
    <figure class="p-why__img js-reveal -fade">
      <img src="./assets/images/top/why.jpg" alt="窓から差し込む光と影が落ちる白いテーブルとティーカップ" width="1200" height="1380" loading="lazy" decoding="async">
    </figure>
  </section>

  <!-- ============ EXPERIENCE ============ -->
  <section class="p-exp" id="experience" aria-labelledby="exp-title">
    <div class="p-exp__bg" data-parallax="0.12">
      <img src="./assets/images/top/experience.jpg" alt="麦わら帽子をかぶり、夕暮れの海を眺める女性" width="2400" height="1266" loading="lazy" decoding="async">
    </div>
    <div class="p-exp__content">
      <p class="c-secTitle__en -white js-reveal" lang="en">Experience</p>
      <h2 class="p-exp__title js-reveal" id="exp-title" data-delay="0.15">旅の体験が、<br>人生を豊かにする。</h2>
      <p class="p-exp__text js-reveal" data-delay="0.3">美しい景色、現地の人との出会い、美味しい食事。<br>すべてが、かけがえのない思い出になります。</p>
      <button class="c-play js-reveal" type="button" id="js-movieOpen" aria-haspopup="dialog" aria-controls="js-movieModal" data-delay="0.45">
        <span class="c-play__icon" aria-hidden="true"></span>
        <span class="c-play__text">動画で見る</span>
      </button>
    </div>
  </section>

  <!-- ============ GALLERY ============ -->
  <section class="p-gallery" id="gallery" aria-labelledby="gallery-title">
    <div class="p-gallery__head">
      <hgroup class="c-secTitle js-reveal">
        <p class="c-secTitle__en" lang="en">Gallery</p>
        <h2 class="c-secTitle__ja" id="gallery-title">旅のひとコマ</h2>
      </hgroup>
      <p class="p-gallery__lead js-reveal" data-delay="0.15">何気ない瞬間が、特別な思い出に変わる。<br>旅先で出会った、心に残る風景たち。</p>
      <a href="#gallery" class="c-linkArrow js-reveal" data-delay="0.3">ギャラリーを見る</a>
    </div>
    <ul class="p-gallery__list">
      <?php foreach ($gallery as $i => $g) : ?>
        <li class="p-gallery__item js-mask" style="--i: <?php echo $i; ?>">
          <figure class="p-gallery__img">
            <img src="./assets/images/top/<?php echo h($g['img']); ?>" alt="<?php echo h($g['alt']); ?>" width="<?php echo $g['w']; ?>" height="<?php echo $g['h']; ?>" loading="lazy" decoding="async">
          </figure>
        </li>
      <?php endforeach; ?>
    </ul>
  </section>

  <!-- ============ お客様の声 ============ -->
  <section class="p-voice" id="voice" aria-labelledby="voice-title">
    <span class="p-voice__deco c-fontScript" aria-hidden="true">Voice</span>
    <div class="p-voice__inner">
      <div class="p-voice__head">
        <hgroup class="c-secTitle js-reveal">
          <p class="c-secTitle__en" lang="en">Voice</p>
          <h2 class="c-secTitle__ja" id="voice-title">お客様の声</h2>
        </hgroup>
        <p class="p-voice__lead js-reveal" data-delay="0.15">実際に旅をされた方から、<br>たくさんの嬉しい声をいただいています。</p>
        <div class="p-voice__arrows js-reveal" data-delay="0.3">
          <button class="p-voice__arrow" type="button" id="js-voicePrev" aria-label="前のお客様の声へ">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M20 12H5m5-5-5 5 5 5" /></svg>
          </button>
          <button class="p-voice__arrow" type="button" id="js-voiceNext" aria-label="次のお客様の声へ">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 12h15m-5-5 5 5-5 5" /></svg>
          </button>
        </div>
      </div>
      <div class="splide p-voice__slider js-reveal" id="js-voiceSlider" aria-label="お客様の声一覧" data-delay="0.2">
        <div class="splide__track">
          <ul class="splide__list">
            <?php foreach ($voices as $v) : ?>
              <li class="splide__slide">
                <article class="p-voiceCard">
                  <img class="p-voiceCard__avatar" src="./assets/images/top/<?php echo h($v['img']); ?>" alt="" width="200" height="200" loading="lazy" decoding="async">
                  <h3 class="p-voiceCard__title">「<?php echo h($v['title']); ?>」</h3>
                  <blockquote class="p-voiceCard__text">
                    <p><?php echo h($v['text']); ?></p>
                  </blockquote>
                  <p class="p-voiceCard__meta"><?php echo h($v['meta']); ?></p>
                </article>
              </li>
            <?php endforeach; ?>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ CTA ============ -->
  <section class="p-cta" id="cta" aria-labelledby="cta-title">
    <div class="p-cta__bg">
      <img src="./assets/images/top/cta.jpg" alt="夕暮れの海辺で明かりが灯り始めたポジターノの街並み" width="2000" height="1336" loading="lazy" decoding="async">
    </div>
    <div class="p-cta__content">
      <h2 class="p-cta__title" id="cta-title">
        <span class="p-cta__script c-fontScript js-reveal" lang="en">Let's Travel</span>
        <span class="p-cta__ja js-reveal" data-delay="0.2">さあ、次はどこへ行こう。</span>
      </h2>
      <a href="#destinations" class="c-button p-cta__button js-reveal" data-delay="0.35">旅をさがす</a>
    </div>
  </section>

</main>

<!-- 動画モーダル -->
<dialog class="c-modal" id="js-movieModal" aria-label="旅の体験ムービー">
  <div class="c-modal__inner">
    <video class="c-modal__video" controls playsinline preload="none" poster="./assets/images/top/experience.jpg">
      <source src="./assets/video/experience.mp4" type="video/mp4">
    </video>
    <button class="c-modal__close" type="button" id="js-movieClose" aria-label="動画を閉じる"></button>
  </div>
</dialog>

<?php require 'footer.php'; ?>
