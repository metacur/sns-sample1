// ========================================
// modal.js - モーダルウィンドウ機能
// 検索モーダルの開閉とサジェスト機能
// ========================================

/**
 * モーダル機能の初期化
 */
function initModal() {
    const searchButton = document.querySelector('.search-button');
    const searchModal = document.getElementById('searchModal');
    const closeModal = document.querySelector('.close-modal');
    const searchInput = document.querySelector('.search-input');
    const suggestionTags = document.querySelectorAll('.suggestion-tag');
    
    // 要素の存在チェック
    if (!searchModal) {
        console.warn('検索モーダルが見つかりません');
        return;
    }
    
    // ========================================
    // モーダルの開閉機能
    // ========================================
    
    /**
     * モーダルを開く
     */
    function openModal() {
        searchModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // 背景のスクロールを無効化
        
        // 検索入力欄にフォーカス
        if (searchInput) {
            setTimeout(() => {
                searchInput.focus();
            }, 300); // アニメーション完了後にフォーカス
        }
    }
    
    /**
     * モーダルを閉じる
     */
    function closeModalWindow() {
        searchModal.classList.remove('active');
        document.body.style.overflow = ''; // 背景のスクロールを有効化
        
        // 検索入力をクリア
        if (searchInput) {
            searchInput.value = '';
        }
    }
    
    // ========================================
    // イベントリスナーの設定
    // ========================================
    
    /**
     * 検索ボタンクリック - モーダルを開く
     */
    if (searchButton) {
        searchButton.addEventListener('click', openModal);
    }
    
    /**
     * 閉じるボタンクリック - モーダルを閉じる
     */
    if (closeModal) {
        closeModal.addEventListener('click', closeModalWindow);
    }
    
    /**
     * モーダルの背景クリック - モーダルを閉じる
     */
    searchModal.addEventListener('click', function(e) {
        // モーダルの背景部分（searchModal自体）がクリックされた場合のみ閉じる
        if (e.target === searchModal) {
            closeModalWindow();
        }
    });
    
    /**
     * Escキー押下 - モーダルを閉じる
     */
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
            closeModalWindow();
        }
    });
    
    // ========================================
    // 検索機能
    // ========================================
    
    /**
     * 検索実行
     * @param {string} query - 検索クエリ
     */
    function executeSearch(query) {
        if (!query || query.trim() === '') {
            if (typeof showNotification === 'function') {
                showNotification('🔍 検索キーワードを入力してください');
            }
            return;
        }
        
        console.log('検索実行:', query);
        
        // 実際のアプリケーションではここでAPI呼び出し
        if (typeof showNotification === 'function') {
            showNotification(`🔍 「${query}」を検索中...`);
        }
        
        // モーダルを閉じる
        closeModalWindow();
        
        // 検索結果ページへの遷移など（実装例）
        // window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
    
    /**
     * 検索ボタンのクリックイベント
     */
    const searchSubmit = document.querySelector('.search-submit');
    if (searchSubmit) {
        searchSubmit.addEventListener('click', function() {
            const query = searchInput ? searchInput.value : '';
            executeSearch(query);
        });
    }
    
    /**
     * 検索入力欄でEnterキー押下時
     */
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                executeSearch(this.value);
            }
        });
    }
    
    // ========================================
    // サジェストタグの機能
    // ========================================
    
    /**
     * サジェストタグクリック - 検索入力欄に自動入力
     */
    suggestionTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagText = this.textContent;
            
            if (searchInput) {
                searchInput.value = tagText;
                searchInput.focus();
            }
            
            if (typeof showNotification === 'function') {
                showNotification(`🏷️ 「${tagText}」を選択しました`);
            }
        });
    });
}


// ========================================
// この関数はグローバルスコープで定義されているため、
// main.jsから直接呼び出せます