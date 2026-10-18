<?php
require_once __DIR__ . '/config.php';

// ページごとのメタ情報（各ページで require 前に $page_meta を定義）
$page_meta = isset($page_meta) ? $page_meta : [];
$meta_title = isset($page_meta['title']) ? $page_meta['title'] : SITE_NAME;
$meta_description = isset($page_meta['description']) ? $page_meta['description'] : SITE_DESCRIPTION;
$meta_path = isset($page_meta['path']) ? $page_meta['path'] : '/';
$meta_image = isset($page_meta['image']) ? $page_meta['image'] : '/assets/images/top/fv.jpg';
$canonical = SITE_URL . $meta_path;
?>
<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?php echo htmlspecialchars($meta_title, ENT_QUOTES, 'UTF-8'); ?></title>
  <meta name="description" content="<?php echo htmlspecialchars($meta_description, ENT_QUOTES, 'UTF-8'); ?>">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="<?php echo $canonical; ?>">
  <meta name="theme-color" content="#f4f1ec">
  <meta name="format-detection" content="telephone=no">

  <!-- OGP -->
  <meta property="og:type" content="<?php echo $meta_path === '/' ? 'website' : 'article'; ?>">
  <meta property="og:site_name" content="<?php echo SITE_NAME; ?>">
  <meta property="og:title" content="<?php echo htmlspecialchars($meta_title, ENT_QUOTES, 'UTF-8'); ?>">
  <meta property="og:description" content="<?php echo htmlspecialchars($meta_description, ENT_QUOTES, 'UTF-8'); ?>">
  <meta property="og:url" content="<?php echo $canonical; ?>">
  <meta property="og:image" content="<?php echo SITE_URL . $meta_image; ?>">
  <meta property="og:locale" content="ja_JP">
  <meta name="twitter:card" content="summary_large_image">

  <!-- JSが有効な場合のみアニメーション用の初期状態を適用 -->
  <script>document.documentElement.classList.add('js');</script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Klee+One&family=Mrs+Saint+Delafield&family=Shippori+Mincho:wght@400;500&family=Zen+Kaku+Gothic+New:wght@400;500&display=swap">
  <link rel="preload" as="image" href="./assets/images/top/fv.jpg" fetchpriority="high">
  <link rel="stylesheet" href="./assets/css/splide-core.min.css">
  <link rel="stylesheet" href="./assets/css/style.min.css?<?php echo date('YmdHis') ?>">

  <?php
  // 今いるページのファイル名
  $self_name = basename($_SERVER['PHP_SELF']);

  // プロジェクトディレクトリ内の.phpファイル一覧を取得
  $php_files = glob('./*.php');

  // php_filesのファイル名の部分を取得
  $php_files = array_map('basename', $php_files);

  // 必要なファイル名のパターンのみフィルタリング
  $pages = array_filter($php_files, function ($file) {
    return preg_match('/^(index|page-|archive-|single-).*\.php$/', $file);
  });

  if (in_array($self_name, $pages)) {
    // 'page-', 'archive-', 'single-' などの接頭辞を削除して、ディレクトリ名を生成
    $page_base = preg_replace('/^(page-|archive-|single-)/', '', basename($self_name, '.php'));
    // 'archive-' や 'single-' の接頭辞に応じたCSSファイル名を決定
    if (strpos($self_name, 'archive') !== false) {
      $css_suffix = 'archive.min.css';
      $js_suffix = 'archive.min.js';
    } elseif (strpos($self_name, 'single') !== false) {
      $css_suffix = 'single.min.css';
      $js_suffix = 'single.min.js';
    } else {
      $css_suffix = 'index.min.css';
      $js_suffix = 'index.min.js';
    }
    // ディレクトリ名はハイフンをそのまま使用
    $directory = $self_name === 'index.php'
      ? 'top'
      : $page_base;
    // CSSファイルを出力
    echo '<link rel="stylesheet" href="./assets/css/pages/' . $directory . '/' . $css_suffix . '?' . date('YmdHis') . '">';
    // JSファイルが存在する場合のみ出力
    if (file_exists('./assets/js/pages/' . $directory . '/' . $js_suffix)) {
      echo '<script src="./assets/js/pages/' . $directory . '/' . $js_suffix . '?' . date('YmdHis') . '" defer></script>';
    }
  }
  ?>

  <!-- 構造化データ -->
  <script type="application/ld+json">
    <?php
    $ld = [
      '@context' => 'https://schema.org',
      '@graph' => [
        [
          '@type' => 'TravelAgency',
          '@id' => SITE_URL . '/#organization',
          'name' => SITE_NAME,
          'alternateName' => SITE_NAME_JA,
          'url' => SITE_URL . '/',
          'description' => SITE_DESCRIPTION,
          'sameAs' => [
            'https://www.instagram.com/',
            'https://www.youtube.com/',
          ],
        ],
        [
          '@type' => 'WebSite',
          '@id' => SITE_URL . '/#website',
          'url' => SITE_URL . '/',
          'name' => SITE_NAME,
          'inLanguage' => 'ja',
          'publisher' => ['@id' => SITE_URL . '/#organization'],
        ],
        [
          '@type' => 'WebPage',
          '@id' => $canonical . '#webpage',
          'url' => $canonical,
          'name' => $meta_title,
          'description' => $meta_description,
          'inLanguage' => 'ja',
          'isPartOf' => ['@id' => SITE_URL . '/#website'],
          'about' => ['@id' => SITE_URL . '/#organization'],
          'primaryImageOfPage' => SITE_URL . $meta_image,
        ],
      ],
    ];
    if (!empty($page_meta['ld'])) {
      $ld['@graph'] = array_merge($ld['@graph'], $page_meta['ld']);
    }
    echo json_encode($ld, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    ?>
  </script>
</head>

<body>
  <a class="u-skipLink" href="#main">本文へスキップ</a>
  <header class="l-header" id="js-header">
    <div class="l-header__inner">
      <a href="./" class="l-header__logo c-fontScript" aria-label="Tabito トップページ">Tabito</a>
      <nav class="l-header__nav" aria-label="グローバルナビゲーション">
        <ul class="l-header__navList">
          <li><a href="#destinations">旅先をさがす</a></li>
          <li><a href="#experience">特集</a></li>
          <li><a href="#why">私たちについて</a></li>
          <li><a href="#voice">お客様の声</a></li>
        </ul>
      </nav>
      <div class="l-header__right">
        <button class="l-headerNavButton" type="button" id="js-hamburgerButton" aria-controls="js-headerNav" aria-expanded="false" aria-label="メニューを開く">
          <span class="lineIcon" aria-hidden="true">
            <span class="line"></span>
            <span class="line"></span>
            <span class="line"></span>
          </span>
        </button>
        <a href="#cta" class="l-header__contact">旅の相談をする</a>
      </div>
    </div>
    <nav class="l-headerNav" id="js-headerNav" aria-label="メニュー">
      <ul class="l-headerNav__list">
        <li class="l-headerNav__item">
          <a href="#destinations" class="l-headerNav__link"><span class="l-headerNav__en">Destinations</span>旅先をさがす</a>
        </li>
        <li class="l-headerNav__item">
          <a href="#experience" class="l-headerNav__link"><span class="l-headerNav__en">Experience</span>特集</a>
        </li>
        <li class="l-headerNav__item">
          <a href="#why" class="l-headerNav__link"><span class="l-headerNav__en">About</span>私たちについて</a>
        </li>
        <li class="l-headerNav__item">
          <a href="#gallery" class="l-headerNav__link"><span class="l-headerNav__en">Gallery</span>旅のひとコマ</a>
        </li>
        <li class="l-headerNav__item">
          <a href="#voice" class="l-headerNav__link"><span class="l-headerNav__en">Voice</span>お客様の声</a>
        </li>
        <li class="l-headerNav__item">
          <a href="#cta" class="l-headerNav__link"><span class="l-headerNav__en">Contact</span>旅の相談をする</a>
        </li>
      </ul>
    </nav>
  </header>
