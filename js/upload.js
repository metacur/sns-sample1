// ========================================
// upload.js - ファイルアップロード機能
// ドラッグ&ドロップとフォーム送信
// ========================================

/**
 * アップロード機能の初期化
 */
function initUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const fileSelectButton = document.querySelector('.file-select-button');
    const submitButton = document.querySelector('.submit-button');
    const cancelButton = document.querySelector('.cancel-button');
    
    // フォーム要素
    const titleInput = document.querySelector('.form-input');
    const categorySelect = document.querySelector('.form-select');
    const descriptionTextarea = document.querySelector('.form-textarea');
    const tagsInput = document.querySelectorAll('.form-input')[1]; // 2番目のinput
    
    // アップロードされたファイル情報を保持
    let selectedFile = null;
    
    // ========================================
    // ファイル選択機能
    // ========================================
    
    /**
     * ファイル選択ボタンのクリックイベント
     */
    if (fileSelectButton) {
        fileSelectButton.addEventListener('click', function() {
            fileInput.click(); // 非表示のfile inputをクリック
        });
    }
    
    /**
     * ファイルが選択された時の処理
     */
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const files = e.target.files;
            handleFiles(files);
        });
    }
    
    // ========================================
    // ドラッグ&ドロップ機能
    // ========================================
    
    if (uploadArea) {
        /**
         * ドラッグオーバー時の処理
         * ファイルがドラッグされている状態
         */
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault(); // デフォルトの動作を防止
            e.stopPropagation();
            this.classList.add('drag-over'); // ビジュアルフィードバック
        });
        
        /**
         * ドラッグが離れた時の処理
         */
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('drag-over');
        });
        
        /**
         * ファイルがドロップされた時の処理
         */
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            handleFiles(files);
        });
    }
    
    // ========================================
    // ファイル処理
    // ========================================
    
    /**
     * ファイル処理のメイン関数
     * @param {FileList} files - 選択されたファイルのリスト
     */
    function handleFiles(files) {
        if (!files || files.length === 0) {
            return;
        }
        
        const file = files[0]; // 最初のファイルのみ処理
        
        // ファイル検証
        const validation = validateFile(file);
        
        if (!validation.valid) {
            if (typeof showNotification === 'function') {
                showNotification(`❌ ${validation.message}`);
            }
            return;
        }
        
        // ファイル情報を保存
        selectedFile = file;
        
        // ファイル情報を表示
        displayFileInfo(file);
        
        // 成功通知
        if (typeof showNotification === 'function') {
            const fileSize = (file.size / 1024 / 1024).toFixed(2);
            showNotification(`✅ ${file.name} (${fileSize}MB) を選択しました`);
        }
        
        console.log('選択されたファイル:', {
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: new Date(file.lastModified)
        });
    }
    
    /**
     * ファイルのバリデーション
     * @param {File} file - 検証するファイル
     * @returns {Object} - {valid: boolean, message: string}
     */
    function validateFile(file) {
        // ファイルサイズチェック（500MB制限）
        const maxSize = 500 * 1024 * 1024; // 500MB in bytes
        if (file.size > maxSize) {
            return {
                valid: false,
                message: 'ファイルサイズが大きすぎます（最大500MB）'
            };
        }
        
        // 対応形式のチェック
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'video/mp4',
            'video/webm',
            'application/pdf',
            'text/plain',
            'music/mp3'
        ];
        
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.webm', '.pdf', '.txt', '.mp3'];
        
        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        
        if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
            return {
                valid: false,
                message: '対応していないファイル形式です'
            };
        }
        
        return {
            valid: true,
            message: 'OK'
        };
    }
    
    /**
     * ファイル情報を画面に表示
     * @param {File} file - 表示するファイル
     */
    function displayFileInfo(file) {
        // アップロードエリアのテキストを変更
        const uploadIcon = uploadArea.querySelector('.upload-icon');
        const uploadH3 = uploadArea.querySelector('h3');
        
        if (uploadH3) {
            uploadH3.textContent = `✅ ${file.name}`;
        }
        
        if (uploadIcon) {
            uploadIcon.textContent = '📄';
        }
        
        // 画像ファイルの場合はプレビューを表示（実装例）
        if (file.type.startsWith('image/')) {
            createImagePreview(file);
        }
    }
    
    /**
     * 画像ファイルのプレビューを作成
     * @param {File} file - プレビューする画像ファイル
     */
    function createImagePreview(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            console.log('画像プレビュー準備完了');
            // 実際のアプリケーションでは、ここでプレビュー画像を表示
            // 例: <img src="${e.target.result}">
        };
        
        reader.readAsDataURL(file);
    }
    
    // ========================================
    // フォーム送信
    // ========================================
    
    /**
     * 投稿ボタンのクリックイベント
     */
    if (submitButton) {
        submitButton.addEventListener('click', function() {
            handleFormSubmit();
        });
    }
    
    /**
     * フォーム送信処理
     */
    function handleFormSubmit() {
        // フォームデータの取得
        const formData = {
            title: titleInput ? titleInput.value.trim() : '',
            category: categorySelect ? categorySelect.value : '',
            description: descriptionTextarea ? descriptionTextarea.value.trim() : '',
            tags: tagsInput ? tagsInput.value.trim() : '',
            file: selectedFile
        };
        
        // バリデーション
        const validation = validateForm(formData);
        
        if (!validation.valid) {
            if (typeof showNotification === 'function') {
                showNotification(`❌ ${validation.message}`);
            }
            return;
        }
        
        // 送信処理（実際はAPIへのPOSTリクエスト）
        submitWork(formData);
    }
    
    /**
     * フォームのバリデーション
     * @param {Object} formData - フォームデータ
     * @returns {Object} - {valid: boolean, message: string}
     */
    function validateForm(formData) {
        // タイトルのチェック
        if (!formData.title) {
            return {
                valid: false,
                message: 'タイトルは必須です'
            };
        }
        
        // カテゴリのチェック
        if (!formData.category) {
            return {
                valid: false,
                message: 'カテゴリを選択してください'
            };
        }
        
        // ファイルのチェック
        if (!formData.file) {
            return {
                valid: false,
                message: 'ファイルを選択してください'
            };
        }
        
        return {
            valid: true,
            message: 'OK'
        };
    }
    
    /**
     * 作品を投稿する（API送信）
     * @param {Object} formData - 投稿するデータ
     */
    function submitWork(formData) {
        console.log('作品を投稿中...', formData);
        
        // 実際のアプリケーションでは以下のような処理を行う
        /*
        const apiFormData = new FormData();
        apiFormData.append('title', formData.title);
        apiFormData.append('category', formData.category);
        apiFormData.append('description', formData.description);
        apiFormData.append('tags', formData.tags);
        apiFormData.append('file', formData.file);
        
        fetch('/api/works', {
            method: 'POST',
            body: apiFormData
        })
        .then(response => response.json())
        .then(data => {
            showNotification('🚀 作品を投稿しました！');
            resetForm();
        })
        .catch(error => {
            showNotification('❌ 投稿に失敗しました');
            console.error(error);
        });
        */
        
        // デモ用の成功通知
        if (typeof showNotification === 'function') {
            showNotification('🚀 作品を投稿しました！');
        }
        
        // フォームをリセット
        setTimeout(() => {
            resetForm();
        }, 1000);
    }
    
    /**
     * フォームをリセット
     */
    function resetForm() {
        if (titleInput) titleInput.value = '';
        if (categorySelect) categorySelect.value = '';
        if (descriptionTextarea) descriptionTextarea.value = '';
        if (tagsInput) tagsInput.value = '';
        if (fileInput) fileInput.value = '';
        
        selectedFile = null;
        
        // アップロードエリアを元に戻す
        const uploadIcon = uploadArea.querySelector('.upload-icon');
        const uploadH3 = uploadArea.querySelector('h3');
        
        if (uploadH3) {
            uploadH3.textContent = 'ファイルをドラッグ＆ドロップ';
        }
        
        if (uploadIcon) {
            uploadIcon.textContent = '📤';
        }
        
        console.log('フォームをリセットしました');
    }
    
    // ========================================
    // キャンセルボタン
    // ========================================
    
    /**
     * キャンセルボタンのクリックイベント
     */
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            // 確認ダイアログを表示
            if (confirm('入力内容を破棄しますか？')) {
                resetForm();
                
                if (typeof showNotification === 'function') {
                    showNotification('キャンセルしました');
                }
            }
        });
    }
}


// ========================================
// この関数はグローバルスコープで定義されているため、
// main.jsから直接呼び出せます