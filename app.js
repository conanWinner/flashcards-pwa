// Flashcards App - Main JavaScript File
class FlashcardsApp {
    constructor() {
        this.cards = this.loadCards();
        this.currentCardIndex = 0;
        this.studyCards = [];
        this.quizCards = [];
        this.quizAnswers = [];
        this.currentQuizIndex = 0;
        this.correctAnswers = 0;
        this.editingCardId = null;
        
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.bindEvents();
        this.updateStats();
        this.showScreen('welcomeScreen');
        this.loadSampleData();
    }

    // Service Worker Registration
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully:', registration);
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showToast('Có phiên bản mới! Tải lại trang để cập nhật.', 'info');
                        }
                    });
                });
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    // Event Binding
    bindEvents() {
        // Navigation buttons
        document.getElementById('startLearningBtn').addEventListener('click', () => {
            this.showCardList();
        });

        document.getElementById('addCardBtn').addEventListener('click', () => {
            this.showAddCardScreen();
        });

        document.getElementById('quizModeBtn').addEventListener('click', () => {
            this.startQuiz();
        });

        // Card form
        document.getElementById('cardForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCard();
        });

        document.getElementById('cancelCardBtn').addEventListener('click', () => {
            this.showCardList();
        });

        document.getElementById('backToListBtn').addEventListener('click', () => {
            this.showCardList();
        });

        // Study mode
        document.getElementById('flipCardBtn').addEventListener('click', () => {
            this.flipCard();
        });

        document.getElementById('easyBtn').addEventListener('click', () => {
            this.rateDifficulty('easy');
        });

        document.getElementById('mediumBtn').addEventListener('click', () => {
            this.rateDifficulty('medium');
        });

        document.getElementById('hardBtn').addEventListener('click', () => {
            this.rateDifficulty('hard');
        });

        document.getElementById('speakBtn').addEventListener('click', () => {
            this.speakCurrentCard();
        });

        document.getElementById('backToWelcomeBtn').addEventListener('click', () => {
            this.showScreen('welcomeScreen');
        });

        // Quiz mode
        document.getElementById('nextQuizBtn').addEventListener('click', () => {
            this.nextQuizQuestion();
        });

        document.getElementById('backFromQuizBtn').addEventListener('click', () => {
            this.showScreen('welcomeScreen');
        });

        // Results
        document.getElementById('retakeQuizBtn').addEventListener('click', () => {
            this.startQuiz();
        });

        document.getElementById('backToWelcomeFromResultsBtn').addEventListener('click', () => {
            this.showScreen('welcomeScreen');
        });

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterCards(e.target.value);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    // Screen Management
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    showCardList() {
        this.renderCardList();
        this.showScreen('cardListScreen');
    }

    showAddCardScreen() {
        this.editingCardId = null;
        document.getElementById('addCardTitle').textContent = 'Thêm thẻ mới';
        document.getElementById('cardForm').reset();
        this.showScreen('addCardScreen');
    }

    showEditCardScreen(cardId) {
        const card = this.cards.find(c => c.id === cardId);
        if (!card) return;

        this.editingCardId = cardId;
        document.getElementById('addCardTitle').textContent = 'Chỉnh sửa thẻ';
        document.getElementById('cardFront').value = card.front;
        document.getElementById('cardBack').value = card.back;
        document.getElementById('cardCategory').value = card.category;
        this.showScreen('addCardScreen');
    }

    // Card Management
    saveCard() {
        const front = document.getElementById('cardFront').value.trim();
        const back = document.getElementById('cardBack').value.trim();
        const category = document.getElementById('cardCategory').value;

        if (!front || !back) {
            this.showToast('Vui lòng điền đầy đủ thông tin!', 'error');
            return;
        }

        const cardData = {
            front,
            back,
            category,
            createdAt: new Date().toISOString(),
            studiedCount: 0,
            lastStudied: null,
            difficulty: 'medium'
        };

        if (this.editingCardId) {
            // Update existing card
            const cardIndex = this.cards.findIndex(c => c.id === this.editingCardId);
            if (cardIndex !== -1) {
                this.cards[cardIndex] = { ...this.cards[cardIndex], ...cardData };
                this.showToast('Thẻ đã được cập nhật!', 'success');
            }
        } else {
            // Add new card
            cardData.id = this.generateId();
            this.cards.push(cardData);
            this.showToast('Thẻ mới đã được thêm!', 'success');
        }

        this.saveCards();
        this.updateStats();
        this.showCardList();
    }

    deleteCard(cardId) {
        if (confirm('Bạn có chắc chắn muốn xóa thẻ này?')) {
            this.cards = this.cards.filter(c => c.id !== cardId);
            this.saveCards();
            this.updateStats();
            this.renderCardList();
            this.showToast('Thẻ đã được xóa!', 'success');
        }
    }

    // Card List Rendering
    renderCardList() {
        const cardList = document.getElementById('cardList');
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();

        const filteredCards = this.cards.filter(card => {
            return card.front.toLowerCase().includes(searchTerm) ||
                   card.back.toLowerCase().includes(searchTerm) ||
                   card.category.toLowerCase().includes(searchTerm);
        });

        if (filteredCards.length === 0) {
            cardList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>Chưa có thẻ nào</h3>
                    <p>Hãy thêm thẻ đầu tiên để bắt đầu học tập!</p>
                    <button class="btn btn-primary" onclick="app.showAddCardScreen()">
                        Thêm thẻ đầu tiên
                    </button>
                </div>
            `;
            return;
        }

        cardList.innerHTML = filteredCards.map(card => `
            <div class="card-item" onclick="app.startStudy([${card.id}])">
                <div class="card-item-header">
                    <span class="card-category">${this.getCategoryName(card.category)}</span>
                    <div class="card-actions" onclick="event.stopPropagation()">
                        <button class="btn btn-secondary" onclick="app.showEditCardScreen('${card.id}')" title="Chỉnh sửa">
                            ✏️
                        </button>
                        <button class="btn btn-danger" onclick="app.deleteCard('${card.id}')" title="Xóa">
                            🗑️
                        </button>
                    </div>
                </div>
                <div class="card-content">
                    <div class="card-front-text">${this.escapeHtml(card.front)}</div>
                    <div class="card-back-text">${this.escapeHtml(card.back)}</div>
                </div>
                <div class="card-stats">
                    <span>Đã học: ${card.studiedCount} lần</span>
                    <span>Lần cuối: ${card.lastStudied ? this.formatDate(card.lastStudied) : 'Chưa học'}</span>
                </div>
            </div>
        `).join('');
    }

    filterCards(searchTerm) {
        this.renderCardList();
    }

    // Study Mode
    startStudy(cardIds = null) {
        if (cardIds) {
            this.studyCards = this.cards.filter(card => cardIds.includes(card.id));
        } else {
            this.studyCards = [...this.cards];
        }

        if (this.studyCards.length === 0) {
            this.showToast('Không có thẻ nào để học!', 'warning');
            return;
        }

        this.currentCardIndex = 0;
        this.showStudyCard();
        this.showScreen('studyScreen');
    }

    showStudyCard() {
        const card = this.studyCards[this.currentCardIndex];
        if (!card) return;

        document.getElementById('cardFrontText').textContent = card.front;
        document.getElementById('cardBackText').textContent = card.back;
        document.getElementById('studyProgress').textContent = 
            `${this.currentCardIndex + 1} / ${this.studyCards.length}`;

        // Reset card flip state
        document.getElementById('flashcard').classList.remove('flipped');
    }

    // Text-to-Speech functionality
    speakText(text, language = 'en-US') {
        if ('speechSynthesis' in window) {
            // Stop any ongoing speech
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language;
            utterance.rate = 0.8; // Slower speech for learning
            utterance.pitch = 1;
            utterance.volume = 1;
            
            speechSynthesis.speak(utterance);
        } else {
            this.showToast('Trình duyệt không hỗ trợ phát âm', 'warning');
        }
    }

    speakCurrentCard() {
        const card = this.studyCards[this.currentCardIndex];
        if (!card) return;

        // Speak the English text (front of card)
        this.speakText(card.front, 'en-US');
    }

    flipCard() {
        document.getElementById('flashcard').classList.toggle('flipped');
    }

    rateDifficulty(difficulty) {
        const card = this.studyCards[this.currentCardIndex];
        if (!card) return;

        // Update card stats
        card.studiedCount = (card.studiedCount || 0) + 1;
        card.lastStudied = new Date().toISOString();
        card.difficulty = difficulty;

        this.saveCards();

        // Move to next card
        this.currentCardIndex++;
        if (this.currentCardIndex >= this.studyCards.length) {
            this.showToast('Hoàn thành học tập!', 'success');
            this.showScreen('welcomeScreen');
            this.updateStats();
        } else {
            this.showStudyCard();
        }
    }

    // Quiz Mode
    startQuiz() {
        if (this.cards.length < 4) {
            this.showToast('Cần ít nhất 4 thẻ để bắt đầu quiz!', 'warning');
            return;
        }

        this.quizCards = this.shuffleArray([...this.cards]).slice(0, Math.min(10, this.cards.length));
        this.quizAnswers = [];
        this.currentQuizIndex = 0;
        this.correctAnswers = 0;

        this.showQuizQuestion();
        this.showScreen('quizScreen');
    }

    showQuizQuestion() {
        const question = this.quizCards[this.currentQuizIndex];
        if (!question) return;

        // Generate wrong answers
        const wrongAnswers = this.cards
            .filter(card => card.id !== question.id)
            .map(card => card.back);
        
        const shuffledWrongAnswers = this.shuffleArray(wrongAnswers).slice(0, 3);
        const allAnswers = this.shuffleArray([question.back, ...shuffledWrongAnswers]);

        document.getElementById('quizQuestion').textContent = question.front;
        document.getElementById('quizProgress').textContent = 
            `${this.currentQuizIndex + 1} / ${this.quizCards.length}`;
        
        const progressPercent = ((this.currentQuizIndex + 1) / this.quizCards.length) * 100;
        document.getElementById('quizProgressBar').style.width = `${progressPercent}%`;

        const optionsContainer = document.getElementById('quizOptions');
        optionsContainer.innerHTML = allAnswers.map((answer, index) => `
            <button class="quiz-option" data-answer="${answer}" onclick="app.selectQuizAnswer('${answer}', '${question.back}')">
                ${this.escapeHtml(answer)}
            </button>
        `).join('');

        document.getElementById('nextQuizBtn').disabled = true;
    }

    selectQuizAnswer(selectedAnswer, correctAnswer) {
        const isCorrect = selectedAnswer === correctAnswer;
        this.quizAnswers.push({
            question: this.quizCards[this.currentQuizIndex].front,
            selected: selectedAnswer,
            correct: correctAnswer,
            isCorrect
        });

        if (isCorrect) {
            this.correctAnswers++;
        }

        // Update UI
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.disabled = true;
            if (option.dataset.answer === correctAnswer) {
                option.classList.add('correct');
            } else if (option.dataset.answer === selectedAnswer && !isCorrect) {
                option.classList.add('incorrect');
            }
        });

        document.getElementById('nextQuizBtn').disabled = false;
    }

    nextQuizQuestion() {
        this.currentQuizIndex++;
        if (this.currentQuizIndex >= this.quizCards.length) {
            this.showQuizResults();
        } else {
            this.showQuizQuestion();
        }
    }

    showQuizResults() {
        const totalQuestions = this.quizCards.length;
        const accuracy = Math.round((this.correctAnswers / totalQuestions) * 100);

        document.getElementById('correctAnswers').textContent = this.correctAnswers;
        document.getElementById('totalQuestions').textContent = totalQuestions;
        document.getElementById('accuracy').textContent = `${accuracy}%`;

        this.showScreen('quizResultsScreen');
    }

    // Utility Functions
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    }

    getCategoryName(category) {
        const categories = {
            'basic-vocabulary': 'Từ vựng cơ bản',
            'daily-conversation': 'Hội thoại hàng ngày',
            'grammar': 'Ngữ pháp',
            'business-english': 'Tiếng Anh công sở',
            'travel': 'Du lịch',
            'food-drink': 'Đồ ăn & Thức uống',
            'family-relationships': 'Gia đình & Mối quan hệ',
            'emotions-feelings': 'Cảm xúc & Tình cảm',
            'time-weather': 'Thời gian & Thời tiết',
            'shopping': 'Mua sắm',
            'health': 'Sức khỏe',
            'education': 'Giáo dục',
            'technology': 'Công nghệ',
            'other': 'Khác'
        };
        return categories[category] || category;
    }

    // Data Management
    loadCards() {
        try {
            const saved = localStorage.getItem('flashcards-app-cards');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading cards:', error);
            return [];
        }
    }

    saveCards() {
        try {
            localStorage.setItem('flashcards-app-cards', JSON.stringify(this.cards));
        } catch (error) {
            console.error('Error saving cards:', error);
            this.showToast('Lỗi khi lưu dữ liệu!', 'error');
        }
    }

    // Sample Data
    loadSampleData() {
        if (this.cards.length === 0) {
            const sampleCards = [
                // Từ vựng cơ bản
                {
                    id: this.generateId(),
                    front: 'Hello',
                    back: 'Xin chào',
                    category: 'basic-vocabulary',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'easy'
                },
                {
                    id: this.generateId(),
                    front: 'Goodbye',
                    back: 'Tạm biệt',
                    category: 'basic-vocabulary',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'easy'
                },
                {
                    id: this.generateId(),
                    front: 'Thank you',
                    back: 'Cảm ơn',
                    category: 'basic-vocabulary',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'easy'
                },
                {
                    id: this.generateId(),
                    front: 'Please',
                    back: 'Làm ơn / Xin vui lòng',
                    category: 'basic-vocabulary',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'easy'
                },
                {
                    id: this.generateId(),
                    front: 'Sorry',
                    back: 'Xin lỗi',
                    category: 'basic-vocabulary',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'easy'
                },
                // Hội thoại hàng ngày
                {
                    id: this.generateId(),
                    front: 'How are you?',
                    back: 'Bạn có khỏe không?',
                    category: 'daily-conversation',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'easy'
                },
                {
                    id: this.generateId(),
                    front: 'What is your name?',
                    back: 'Tên bạn là gì?',
                    category: 'daily-conversation',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'easy'
                },
                {
                    id: this.generateId(),
                    front: 'Where are you from?',
                    back: 'Bạn đến từ đâu?',
                    category: 'daily-conversation',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'medium'
                },
                {
                    id: this.generateId(),
                    front: 'Nice to meet you',
                    back: 'Rất vui được gặp bạn',
                    category: 'daily-conversation',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'easy'
                },
                // Ngữ pháp
                {
                    id: this.generateId(),
                    front: 'I am / You are / He is',
                    back: 'Tôi là / Bạn là / Anh ấy là',
                    category: 'grammar',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'medium'
                },
                {
                    id: this.generateId(),
                    front: 'I have / You have / He has',
                    back: 'Tôi có / Bạn có / Anh ấy có',
                    category: 'grammar',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'medium'
                },
                // Du lịch
                {
                    id: this.generateId(),
                    front: 'Where is the bathroom?',
                    back: 'Nhà vệ sinh ở đâu?',
                    category: 'travel',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'medium'
                },
                {
                    id: this.generateId(),
                    front: 'How much does this cost?',
                    back: 'Cái này giá bao nhiêu?',
                    category: 'travel',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'medium'
                },
                // Đồ ăn & Thức uống
                {
                    id: this.generateId(),
                    front: 'I would like to order...',
                    back: 'Tôi muốn gọi...',
                    category: 'food-drink',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'medium'
                },
                {
                    id: this.generateId(),
                    front: 'Water',
                    back: 'Nước',
                    category: 'food-drink',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'easy'
                },
                // Gia đình & Mối quan hệ
                {
                    id: this.generateId(),
                    front: 'Family',
                    back: 'Gia đình',
                    category: 'family-relationships',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'easy'
                },
                {
                    id: this.generateId(),
                    front: 'Mother / Father',
                    back: 'Mẹ / Bố',
                    category: 'family-relationships',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'easy'
                },
                // Cảm xúc & Tình cảm
                {
                    id: this.generateId(),
                    front: 'Happy',
                    back: 'Vui vẻ / Hạnh phúc',
                    category: 'emotions-feelings',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'easy'
                },
                {
                    id: this.generateId(),
                    front: 'Sad',
                    back: 'Buồn',
                    category: 'emotions-feelings',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'easy'
                },
                // Thời gian & Thời tiết
                {
                    id: this.generateId(),
                    front: 'What time is it?',
                    back: 'Mấy giờ rồi?',
                    category: 'time-weather',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'medium'
                },
                {
                    id: this.generateId(),
                    front: 'It is sunny today',
                    back: 'Hôm nay trời nắng',
                    category: 'time-weather',
                    createdAt: new Date().toISOString(),
                    studiedCount: 0,
                    lastStudied: null,
                    difficulty: 'medium'
                }
            ];

            this.cards = sampleCards;
            this.saveCards();
            this.updateStats();
        }
    }

    // Statistics
    updateStats() {
        const totalCards = this.cards.length;
        const today = new Date().toDateString();
        const studiedToday = this.cards.filter(card => 
            card.lastStudied && new Date(card.lastStudied).toDateString() === today
        ).length;

        document.getElementById('totalCards').textContent = totalCards;
        document.getElementById('studiedToday').textContent = studiedToday;
    }

    // Toast Notifications
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Keyboard Shortcuts
    handleKeyboardShortcuts(e) {
        // Only handle shortcuts when not in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch (e.key) {
            case ' ':
                e.preventDefault();
                if (document.getElementById('studyScreen').classList.contains('active')) {
                    this.flipCard();
                }
                break;
            case '1':
                if (document.getElementById('studyScreen').classList.contains('active')) {
                    this.rateDifficulty('easy');
                }
                break;
            case '2':
                if (document.getElementById('studyScreen').classList.contains('active')) {
                    this.rateDifficulty('medium');
                }
                break;
            case '3':
                if (document.getElementById('studyScreen').classList.contains('active')) {
                    this.rateDifficulty('hard');
                }
                break;
            case 's':
            case 'S':
                if (document.getElementById('studyScreen').classList.contains('active')) {
                    this.speakCurrentCard();
                }
                break;
            case 'Escape':
                if (document.getElementById('addCardScreen').classList.contains('active')) {
                    this.showCardList();
                } else if (document.getElementById('studyScreen').classList.contains('active')) {
                    this.showScreen('welcomeScreen');
                } else if (document.getElementById('quizScreen').classList.contains('active')) {
                    this.showScreen('welcomeScreen');
                }
                break;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FlashcardsApp();
});

// Handle PWA install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button or notification
    setTimeout(() => {
        if (window.app) {
            window.app.showToast('Bạn có thể cài đặt ứng dụng này trên thiết bị!', 'info');
        }
    }, 2000);
});

// Handle PWA install
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    if (window.app) {
        window.app.showToast('Ứng dụng đã được cài đặt thành công!', 'success');
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    if (window.app) {
        window.app.showToast('Đã kết nối internet!', 'success');
    }
});

window.addEventListener('offline', () => {
    if (window.app) {
        window.app.showToast('Đã mất kết nối internet. Ứng dụng vẫn hoạt động offline!', 'warning');
    }
});
