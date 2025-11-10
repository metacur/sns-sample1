// ========================================
// utils.js - 共通ユーティリティ関数
// 複数のモジュールで使用される汎用関数
// ========================================

// ========================================
// 通知システム
// ========================================

/**
 * カスタム通知を表示
 * @param {string} message - 表示するメッセージ
 * @param {string} type - 通知タイプ（'success', 'error', 'info'）
 */
function showNotification(message, type = 'info') {
    // 既存の通知があれば削除
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 通知要素を作成
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.textContent = message;
    
    // タイプに応じて背景色を変更
    let backgroundColor;
    switch (type) {
        case 'success':
            backgroundColor = 'linear-gradient(135deg, #B8FFD9, #B8E6FF)';
            break;
        case 'error':
            backgroundColor = 'linear-gradient(135deg, #FFB6D9, #FFA6C9)';
            break;
        default:
            backgroundColor = 'linear-gradient(135deg, #FFB6D9, #E6B8FF)';
    }
    
    // スタイルを設定
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: backgroundColor,
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '50px',
        boxShadow: '0 10px 40px rgba(255, 182, 217, 0.4)',
        zIndex: '10000',
        animation: 'slideInRight 0.5s ease',
        fontWeight: 'bold',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // アニメーション用のスタイルを追加（初回のみ）
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // 3秒後に自動的に削除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// ========================================
// パフォーマンス最適化
// ========================================

/**
 * デバウンス関数
 * 連続して呼ばれる関数の実行を遅延させる
 * @param {Function} func - 実行する関数
 * @param {number} wait - 待機時間（ミリ秒）
 * @returns {Function} - デバウンスされた関数
 */
function debounce(func, wait = 300) {
    let timeout;
    
    return function executedFunction(...args) {
        // 前回のタイマーをクリア
        clearTimeout(timeout);
        
        // 新しいタイマーを設定
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, wait);
    };
}

/**
 * スロットル関数
 * 関数の実行頻度を制限する
 * @param {Function} func - 実行する関数
 * @param {number} limit - 実行間隔（ミリ秒）
 * @returns {Function} - スロットルされた関数
 */
function throttle(func, limit = 300) {
    let inThrottle;
    
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

// ========================================
// DOM操作ヘルパー
// ========================================

/**
 * 要素が存在するか確認
 * @param {string} selector - CSSセレクター
 * @returns {boolean} - 要素が存在するか
 */
function elementExists(selector) {
    return document.querySelector(selector) !== null;
}

/**
 * 複数の要素を取得（配列で返す）
 * @param {string} selector - CSSセレクター
 * @returns {Array} - 要素の配列
 */
function getElements(selector) {
    return Array.from(document.querySelectorAll(selector));
}

/**
 * 要素にクラスをトグル
 * @param {Element} element - 対象要素
 * @param {string} className - クラス名
 */
function toggleClass(element, className) {
    if (element) {
        element.classList.toggle(className);
    }
}

// ========================================
// データ処理ヘルパー
// ========================================

/**
 * ファイルサイズを人間が読みやすい形式に変換
 * @param {number} bytes - バイト数
 * @returns {string} - フォーマットされた文字列（例: "2.5 MB"）
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 日付を相対的な表現に変換
 * @param {Date} date - 日付オブジェクト
 * @returns {string} - 相対的な日付表現（例: "3時間前"）
 */
function timeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return `${diffInSeconds}秒前`;
    } else if (diffInSeconds < 3600) {
        return `${Math.floor(diffInSeconds / 60)}分前`;
    } else if (diffInSeconds < 86400) {
        return `${Math.floor(diffInSeconds / 3600)}時間前`;
    } else if (diffInSeconds < 2592000) {
        return `${Math.floor(diffInSeconds / 86400)}日前`;
    } else if (diffInSeconds < 31536000) {
        return `${Math.floor(diffInSeconds / 2592000)}ヶ月前`;
    } else {
        return `${Math.floor(diffInSeconds / 31536000)}年前`;
    }
}

/**
 * 配列をシャッフル（Fisher-Yatesアルゴリズム）
 * @param {Array} array - シャッフルする配列
 * @returns {Array} - シャッフルされた配列
 */
function shuffleArray(array) {
    const newArray = [...array];
    
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    
    return newArray;
}

// ========================================
// バリデーション
// ========================================

/**
 * メールアドレスの形式を検証
 * @param {string} email - メールアドレス
 * @returns {boolean} - 有効なメールアドレスか
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * URLの形式を検証
 * @param {string} url - URL文字列
 * @returns {boolean} - 有効なURLか
 */
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * 文字列が空または空白のみかチェック
 * @param {string} str - チェックする文字列
 * @returns {boolean} - 空または空白のみか
 */
function isEmpty(str) {
    return !str || str.trim() === '';
}

// ========================================
// ローカルストレージヘルパー
// ========================================

/**
 * ローカルストレージにデータを保存
 * @param {string} key - キー
 * @param {any} value - 値（自動的にJSON化）
 */
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('ストレージへの保存に失敗:', error);
    }
}

/**
 * ローカルストレージからデータを取得
 * @param {string} key - キー
 * @returns {any} - 取得した値（自動的にパース）
 */
function getFromStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('ストレージからの取得に失敗:', error);
        return null;
    }
}

/**
 * ローカルストレージからデータを削除
 * @param {string} key - キー
 */
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('ストレージからの削除に失敗:', error);
    }
}

// ========================================
// アニメーションヘルパー
// ========================================

/**
 * 数値を滑らかに変化させる（カウントアップアニメーション）
 * @param {Element} element - 対象要素
 * @param {number} start - 開始値
 * @param {number} end - 終了値
 * @param {number} duration - アニメーション時間（ミリ秒）
 */
function animateNumber(element, start, end, duration = 1000) {
    const range = end - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // イージング関数（ease-out）
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + range * easeOut);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end.toLocaleString();
        }
    }
    
    requestAnimationFrame(update);
}

/**
 * 要素をスムーズにスクロール
 * @param {Element} element - スクロール先の要素
 * @param {number} offset - オフセット（px）
 */
function smoothScrollTo(element, offset = 0) {
    if (!element) return;
    
    const targetPosition = element.offsetTop - offset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// ========================================
// API呼び出しヘルパー（サンプル）
// ========================================

/**
 * API呼び出しのラッパー関数
 * @param {string} url - APIエンドポイント
 * @param {Object} options - fetchオプション
 * @returns {Promise} - レスポンス
 */
async function apiCall(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API呼び出しエラー:', error);
        throw error;
    }
}

// ========================================
// コンソールログヘルパー
// ========================================

/**
 * 開発環境でのみコンソールログを出力
 * @param {string} message - メッセージ
 * @param {any} data - データ
 */
function devLog(message, data) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[DEV] ${message}`, data || '');
    }
}


// ========================================
// これらの関数はグローバルスコープで定義されているため、
// すべてのモジュールから直接呼び出せます

console.log('✅ ユーティリティ関数を読み込みました');