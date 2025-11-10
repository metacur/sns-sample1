// ========================================
// main.js - エントリーポイント
// 全モジュールの初期化を管理
// ========================================

/**
 * アプリケーション全体の初期化
 * DOMContentLoadedイベントで実行される
 */
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('%c🎨 CreativeSNS 起動中...', 'color: #FFB6D9; font-size: 20px; font-weight: bold;');
    
    // ========================================
    // 各モジュールの初期化
    // ========================================
    
    // 1. ナビゲーション機能の初期化
    if (typeof initNavigation === 'function') {
        initNavigation();
        console.log('✅ ナビゲーション初期化完了');
    }
    
    // 2. モーダル機能の初期化
    if (typeof initModal === 'function') {
        initModal();
        console.log('✅ モーダル初期化完了');
    }
    
    // 3. フィルタリング機能の初期化
    if (typeof initFilter === 'function') {
        initFilter();
        console.log('✅ フィルター初期化完了');
    }
    
    // 4. アップロード機能の初期化
    if (typeof initUpload === 'function') {
        initUpload();
        console.log('✅ アップロード初期化完了');
    }
    
    // 5. パーティクルアニメーションの初期化
    if (typeof initParticles === 'function') {
        initParticles();
        console.log('✅ パーティクル初期化完了');
    }
    
    // 6. 各種アニメーションの初期化
    if (typeof initAnimations === 'function') {
        initAnimations();
        console.log('✅ アニメーション初期化完了');
    }
    
    // ========================================
    // 初期化完了後の処理
    // ========================================
    
    // ウェルカムメッセージを表示
    setTimeout(() => {
        if (typeof showNotification === 'function') {
            showNotification('✨ CreativeSNSへようこそ！');
        }
    }, 1000);
    
    // 開発者向けメッセージ
    console.log('%c全モジュール初期化完了', 'color: #E6B8FF; font-size: 16px; font-weight: bold;');
    console.log('%c使用技術: HTML5, CSS3, Vanilla JavaScript (モジュール分割)', 'color: #B8E6FF; font-size: 12px;');
    console.log('%cCanvas API, Intersection Observer API, File API', 'color: #B8FFD9; font-size: 12px;');
});

// ========================================
// グローバルエラーハンドラー
// 予期しないエラーをキャッチして通知
// ========================================
window.addEventListener('error', function(event) {
    console.error('グローバルエラー:', event.error);
    
    // 本番環境では詳細なエラーメッセージは表示しない
    if (typeof showNotification === 'function') {
        showNotification('エラーが発生しました');
    }
});

// ========================================
// ページビジビリティAPI
// タブの切り替えを検知
// ========================================
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('ページが非表示になりました');
    } else {
        console.log('おかえりなさい！');
    }
});