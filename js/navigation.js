// ========================================
// navigation.js - ナビゲーション機能
// ナビゲーションバーとスクロール関連の処理
// ========================================

/**
 * ナビゲーション機能の初期化
 */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const heroPrimaryBtn = document.querySelector('.hero .primary-btn');
    const heroSecondaryBtn = document.querySelector('.hero .secondary-btn');
    
    // ========================================
    // スクロール時のナビゲーションバー効果
    // ========================================
    
    /**
     * スクロール位置に応じてナビゲーションバーの見た目を変更
     */
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // 初回実行
    handleNavbarScroll();
    
    // スクロールイベントにリスナーを追加
    window.addEventListener('scroll', handleNavbarScroll);
    
    // ========================================
    // スムーススクロール機能
    // ========================================
    
    /**
     * 指定されたセクションまでスムーズにスクロール
     * @param {string} targetId - スクロール先のセクションID
     */
    function smoothScrollTo(targetId) {
        const targetSection = document.querySelector(targetId);
        
        if (!targetSection) {
            console.warn(`セクション ${targetId} が見つかりません`);
            return;
        }
        
        // ナビゲーションバーの高さを考慮
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetSection.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    /**
     * ナビゲーションリンクのクリックイベント
     */
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // デフォルトのジャンプを防止
            
            const targetId = this.getAttribute('href');
            smoothScrollTo(targetId);
        });
    });
    
    // ========================================
    // ヒーローセクションのボタンイベント
    // ========================================
    
    /**
     * 「無料で始める」ボタン - 投稿セクションへスクロール
     */
    if (heroPrimaryBtn) {
        heroPrimaryBtn.addEventListener('click', function() {
            smoothScrollTo('#upload');
            
            if (typeof showNotification === 'function') {
                showNotification('🎨 作品を投稿しましょう！');
            }
        });
    }
    
    /**
     * 「作品を見る」ボタン - 人気作品セクションへスクロール
     */
    if (heroSecondaryBtn) {
        heroSecondaryBtn.addEventListener('click', function() {
            smoothScrollTo('#popular');
        });
    }
    
    // ========================================
    // アップロードボタンのイベント
    // ========================================
    
    const uploadButton = document.querySelector('.upload-button');
    
    if (uploadButton) {
        uploadButton.addEventListener('click', function() {
            smoothScrollTo('#upload');
            
            if (typeof showNotification === 'function') {
                showNotification('📤 作品を投稿する準備ができました');
            }
        });
    }
}


// ========================================
// この関数はグローバルスコープで定義されているため、
// main.jsから直接呼び出せます