// ========================================
// filter.js - フィルタリング機能
// カテゴリによる作品の絞り込み
// ========================================

/**
 * フィルタリング機能の初期化
 */
function initFilter() {
    const categoryCards = document.querySelectorAll('.category-card');
    const filterTabs = document.querySelectorAll('.tab-button');
    const workCards = document.querySelectorAll('.work-card');
    const loadMoreButton = document.querySelector('.load-more-button');
    
    // ========================================
    // カテゴリカードのクリックイベント
    // ========================================
    
    /**
     * カテゴリカードがクリックされた時の処理
     */
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            // カテゴリ情報を取得
            const category = this.dataset.category;
            const categoryName = this.querySelector('h3').textContent;
            
            // フィルターを適用
            filterWorks(category);
            
            // 対応するタブをアクティブにする
            activateTab(category);
            
            // 人気作品セクションにスクロール
            scrollToPopularSection();
            
            // 通知を表示
            if (typeof showNotification === 'function') {
                showNotification(`🎨 ${categoryName}の作品を表示中`);
            }
        });
    });
    
    // ========================================
    // フィルタータブのクリックイベント
    // ========================================
    
    /**
     * フィルタータブがクリックされた時の処理
     */
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // タブをアクティブにする
            activateTab(filter);
            
            // フィルターを適用
            filterWorks(filter);
        });
    });
    
    // ========================================
    // フィルタリング処理
    // ========================================
    
    /**
     * 指定されたカテゴリで作品をフィルタリング
     * @param {string} category - フィルターするカテゴリ（'all'は全て表示）
     */
    function filterWorks(category) {
        let visibleCount = 0;
        
        workCards.forEach((card, index) => {
            const cardCategory = card.dataset.category;
            
            // カテゴリが一致するか、'all'の場合は表示
            if (category === 'all' || cardCategory === category) {
                // カードを表示
                card.style.display = 'block';
                
                // フェードインアニメーションを適用
                card.style.animation = 'none';
                
                // リフローを強制（アニメーションをリセット）
                void card.offsetWidth;
                
                // アニメーションを再適用（遅延を付けて順番に表示）
                card.style.animation = `fadeInUp 0.5s ease-out ${visibleCount * 0.1}s backwards`;
                
                visibleCount++;
            } else {
                // カードを非表示
                card.style.display = 'none';
            }
        });
        
        // 表示された作品数をログ出力
        console.log(`フィルター適用: ${category} - ${visibleCount}件表示`);
        
        // 作品が0件の場合は通知
        if (visibleCount === 0 && typeof showNotification === 'function') {
            showNotification('😢 該当する作品が見つかりません');
        }
    }
    
    /**
     * 指定されたフィルターのタブをアクティブにする
     * @param {string} filter - アクティブにするタブのフィルター値
     */
    function activateTab(filter) {
        filterTabs.forEach(tab => {
            if (tab.dataset.filter === filter) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }
    
    /**
     * 人気作品セクションまでスムーズにスクロール
     */
    function scrollToPopularSection() {
        const popularSection = document.getElementById('popular');
        const navbar = document.querySelector('.navbar');
        
        if (popularSection && navbar) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = popularSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // ========================================
    // 作品カードのクリックイベント
    // ========================================
    
    /**
     * 作品カードがクリックされた時の処理
     */
    workCards.forEach(card => {
        card.addEventListener('click', function() {
            // 作品情報を取得
            const title = this.querySelector('.work-title').textContent;
            const category = this.querySelector('.category-label').textContent;
            const author = this.querySelector('.author').textContent;
            
            // 通知を表示
            if (typeof showNotification === 'function') {
                showNotification(`👀 「${title}」を開きます`);
            }
            
            // 開発者向けログ
            console.log('作品詳細:', {
                title,
                category,
                author,
                element: this
            });
            
            // 実際のアプリケーションでは以下のような処理を行う
            // - モーダルで詳細表示
            // - 詳細ページへ遷移
            // - API呼び出しで追加情報取得
            // 例: showWorkDetail(workId);
        });
    });
    
    // ========================================
    // もっと見るボタンの機能
    // ========================================
    
    /**
     * もっと見るボタンのクリックイベント
     */
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', function() {
            // ローディング状態に変更
            const originalText = this.innerHTML;
            this.innerHTML = '<span class="loading"></span> 読み込み中...';
            this.disabled = true;
            
            // APIから追加データを取得（模擬）
            setTimeout(() => {
                // 実際のアプリケーションでは以下のような処理を行う
                // - API呼び出し
                // - 取得したデータをDOMに追加
                // - フィルター状態を維持
                
                // ボタンを元に戻す
                this.innerHTML = originalText;
                this.disabled = false;
                
                // 通知を表示
                if (typeof showNotification === 'function') {
                    showNotification('✨ 新しい作品を読み込みました');
                }
                
                console.log('追加作品を読み込みました');
            }, 1500);
        });
    }
    
    // ========================================
    // 初期状態の設定
    // ========================================
    
    // ページ読み込み時は「すべて」のフィルターを適用
    filterWorks('all');
}


// ========================================
// この関数はグローバルスコープで定義されているため、
// main.jsから直接呼び出せます