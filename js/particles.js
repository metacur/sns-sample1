// ========================================
// particles.js - パーティクル背景アニメーション
// Canvas APIを使用した視覚効果
// ========================================

/**
 * パーティクルアニメーションの初期化
 */
function initParticles() {
    const canvas = document.getElementById('particles');
    
    if (!canvas) {
        console.warn('パーティクルcanvasが見つかりません');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // パーティクルの配列
    const particles = [];
    const particleCount = 40; // パーティクル数
    
    // かわいいパステルカラーパレット
    const colors = [
        'rgba(255, 182, 217, 0.6)', // ピンク
        'rgba(230, 184, 255, 0.6)', // パープル
        'rgba(184, 230, 255, 0.6)', // ブルー
        'rgba(255, 244, 184, 0.6)', // イエロー
        'rgba(184, 255, 217, 0.6)', // グリーン
        'rgba(255, 205, 184, 0.6)'  // ピーチ
    ];
    
    // ========================================
    // Canvasサイズ設定
    // ========================================
    
    /**
     * Canvasサイズをウィンドウサイズに合わせる
     */
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        console.log('Canvas リサイズ:', canvas.width, 'x', canvas.height);
    }
    
    // 初期サイズ設定
    resizeCanvas();
    
    // ウィンドウリサイズ時にCanvasサイズも変更
    window.addEventListener('resize', resizeCanvas);
    
    // ========================================
    // パーティクルクラス
    // ========================================
    
    /**
     * 個々のパーティクルを表すクラス
     */
    class Particle {
        constructor() {
            // ランダムな位置に配置
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            
            // ランダムなサイズ（2〜5px）
            this.size = Math.random() * 3 + 2;
            
            // ランダムな移動速度
            this.speedX = Math.random() * 0.5 - 0.25; // -0.25 〜 0.25
            this.speedY = Math.random() * 0.5 - 0.25;
            
            // ランダムな色
            this.color = colors[Math.floor(Math.random() * colors.length)];
            
            // ランダムな透明度（0.3〜0.8）
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        
        /**
         * パーティクルの位置を更新
         */
        update() {
            // 現在の速度で移動
            this.x += this.speedX;
            this.y += this.speedY;
            
            // 画面外に出たら反対側から出現（トーラス状の空間）
            if (this.x > canvas.width) {
                this.x = 0;
            } else if (this.x < 0) {
                this.x = canvas.width;
            }
            
            if (this.y > canvas.height) {
                this.y = 0;
            } else if (this.y < 0) {
                this.y = canvas.height;
            }
        }
        
        /**
         * パーティクルを描画
         */
        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            
            // 円を描画
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            
            // 透明度を元に戻す
            ctx.globalAlpha = 1;
        }
    }
    
    // ========================================
    // パーティクルの初期化
    // ========================================
    
    /**
     * 指定数のパーティクルを生成
     */
    function initParticleArray() {
        particles.length = 0; // 配列をクリア
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        console.log(`${particleCount}個のパーティクルを生成しました`);
    }
    
    // ========================================
    // パーティクル間の接続線描画
    // ========================================
    
    /**
     * 近くのパーティクル同士を線で接続
     */
    function connectParticles() {
        const maxDistance = 200; // 接続する最大距離（px）
        
        // 全てのパーティクルのペアをチェック
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                // 2点間の距離を計算
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // 距離が閾値以内なら線を描画
                if (distance < maxDistance) {
                    // 距離に応じて透明度を変化（近いほど濃い）
                    const opacity = 0.15 - (distance / maxDistance) * 0.15;
                    
                    ctx.strokeStyle = `rgba(255, 182, 217, ${opacity})`;
                    ctx.lineWidth = 1;
                    
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // ========================================
    // アニメーションループ
    // ========================================
    
    /**
     * 毎フレーム実行されるアニメーション関数
     */
    function animateParticles() {
        // Canvasをクリア
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 全パーティクルを更新・描画
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // パーティクル間の接続線を描画
        connectParticles();
        
        // 次のフレームをリクエスト（約60FPS）
        requestAnimationFrame(animateParticles);
    }
    
    // ========================================
    // アニメーション開始
    // ========================================
    
    // パーティクルを生成
    initParticleArray();
    
    // アニメーションを開始
    animateParticles();
    
    console.log('パーティクルアニメーションを開始しました');
}


// ========================================
// この関数はグローバルスコープで定義されているため、
// main.jsから直接呼び出せます