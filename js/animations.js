// ========================================
// animations.js - 各種アニメーション機能
// Intersection Observer, マウス追従など
// ========================================

/**
 * アニメーション機能の初期化
 */
function initAnimations() {
    
    // ========================================
    // Intersection Observer - スクロールアニメーション
    // ========================================
    
    /**
     * 画面内に入った要素にアニメーションを適用
     */
    function setupScrollAnimations() {
        // Observerのオプション設定
        const observerOptions = {
            threshold: 0.1, // 要素の10%が見えたら発火
            rootMargin: '0px 0px -100px 0px' // 下から100px手前で発火
        };
        
        // コールバック関数
        const observerCallback = function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 画面内に入ったらアニメーションクラスを追加
                    entry.target.classList.add('fade-in');
                    
                    // 一度アニメーションしたら監視を解除（パフォーマンス向上）
                    observer.unobserve(entry.target);
                }
            });
        };
        
        // Observerを作成
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        // 監視対象の要素を取得
        const animatedElements = document.querySelectorAll(
            '.category-card, .work-card, .feature-section'
        );
        
        // 各要素を監視開始
        animatedElements.forEach(element => {
            observer.observe(element);
        });
        
        console.log(`${animatedElements.length}個の要素にスクロールアニメーションを設定しました`);
    }
    
    // ========================================
    // マウス追従パララックス効果
    // ========================================
    
    /**
     * ヒーローセクションのマウス追従アニメーション
     */
    function setupMouseParallax() {
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (!hero || !heroContent) {
            return;
        }
        
        // マウスの位置を保持
        let mouseX = 0;
        let mouseY = 0;
        
        // 現在の要素の位置を保持（スムーズな動きのため）
        let currentX = 0;
        let currentY = 0;
        
        /**
         * マウス移動イベント
         */
        hero.addEventListener('mousemove', function(e) {
            // マウス位置を正規化（-1〜1の範囲）
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            // 画面中央からの距離を計算（30で割って動きを小さくする）
            mouseX = (centerX - e.pageX) / 30;
            mouseY = (centerY - e.pageY) / 30;
        });
        
        /**
         * スムーズな追従アニメーション
         * requestAnimationFrameで毎フレーム実行
         */
        function animateHeroContent() {
            // イージング効果（現在位置とマウス位置の10%だけ移動）
            currentX += (mouseX - currentX) * 0.1;
            currentY += (mouseY - currentY) * 0.1;
            
            // transformで要素を移動
            heroContent.style.transform = `translate(${currentX}px, ${currentY}px)`;
            
            // 次のフレームをリクエスト
            requestAnimationFrame(animateHeroContent);
        }
        
        // アニメーション開始
        animateHeroContent();
        
        console.log('マウス追従パララックスを設定しました');
    }
    
    // ========================================
    // カードホバーエフェクトの強化
    // ========================================
    
    /**
     * カードに3D効果を追加
     */
    function setupCardEffects() {
        const cards = document.querySelectorAll('.category-card, .work-card');
        
        cards.forEach(card => {
            /**
             * マウスが入った時の処理
             */
            card.addEventListener('mouseenter', function() {
                // パルスアニメーションなどを追加可能
                this.style.transition = 'all 0.4s ease';
            });
            
            /**
             * マウスが動いている時の3D効果
             */
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left; // カード内のX座標
                const y = e.clientY - rect.top;  // カード内のY座標
                
                // カードの中心からの距離を計算
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // 傾きを計算（-10deg 〜 10deg）
                const rotateX = ((y - centerY) / centerY) * -5;
                const rotateY = ((x - centerX) / centerX) * 5;
                
                // 3D変形を適用
                this.style.transform = `
                    perspective(1000px) 
                    rotateX(${rotateX}deg) 
                    rotateY(${rotateY}deg) 
                    translateY(-10px) 
                    scale(1.02)
                `;
            });
            
            /**
             * マウスが離れた時の処理
             */
            card.addEventListener('mouseleave', function() {
                // 元の状態に戻す
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
            });
        });
        
        console.log(`${cards.length}個のカードに3Dエフェクトを設定しました`);
    }
    
    // ========================================
    // ローディングアニメーション
    // ========================================
    
    /**
     * ページ読み込み時のフェードイン
     */
    function setupPageTransition() {
        // ページ全体にフェードインクラスを追加
        document.body.classList.add('fade-in');
        
        // ナビゲーションバーを遅延表示
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.animation = 'slideDown 0.5s ease-out 0.3s backwards';
        }
        
        console.log('ページトランジションを設定しました');
    }
    
    // ========================================
    // スムーズスクロールの進捗バー（オプション）
    // ========================================
    
    /**
     * スクロール進捗バーを表示
     */
    function setupScrollProgress() {
        // 進捗バー要素を作成
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, #FFB6D9, #E6B8FF, #B8E6FF);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        /**
         * スクロールに応じて進捗バーの幅を更新
         */
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            
            progressBar.style.width = scrollPercentage + '%';
        });
        
        console.log('スクロール進捗バーを設定しました');
    }
    
    // ========================================
    // 要素の順次表示アニメーション
    // ========================================
    
    /**
     * リスト要素を順番にフェードイン
     */
    function setupStaggeredAnimation() {
        const staggeredElements = document.querySelectorAll('.work-card');
        
        staggeredElements.forEach((element, index) => {
            // 各要素に遅延を設定
            element.style.animationDelay = `${index * 0.1}s`;
        });
        
        console.log('順次表示アニメーションを設定しました');
    }
    
    // ========================================
    // 全アニメーションの初期化実行
    // ========================================
    
    setupScrollAnimations();
    setupMouseParallax();
    setupCardEffects();
    setupPageTransition();
    setupScrollProgress();
    setupStaggeredAnimation();
    
    console.log('全てのアニメーションを初期化しました');
}

// ========================================
// エクスポート
// ========================================
// この関数はグローバルスコープで定義されているため、
// main.jsから直接呼び出せます