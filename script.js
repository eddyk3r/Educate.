class EducationalPlatform {
    constructor() {
        this.currentSubject = '';
        this.currentMode = '';
        this.currentSettings = {};
        this.flashcards = [];
        this.quizQuestions = [];
        this.currentFlashcardIndex = 0;
        this.currentQuizIndex = 0;
        this.quizScore = 0;
        this.selectedAnswer = null;
        
        this.initializeElements();
        this.setupEventListeners();
    }
    
    initializeElements() {
        // Sections
        this.subjectInput = document.getElementById('subjectInput');
        this.modeSelection = document.getElementById('modeSelection');
        this.settings = document.getElementById('settings');
        this.loadingSection = document.getElementById('loadingSection');
        this.flashcardsSection = document.getElementById('flashcardsSection');
        this.quizSection = document.getElementById('quizSection');
        this.resultsSection = document.getElementById('resultsSection');
        
        // Input elements
        this.subjectNameInput = document.getElementById('subjectName');
        this.subjectDescriptionInput = document.getElementById('subjectDescription');
        this.learningLevelSelect = document.getElementById('learningLevel');
        this.detailLevelSelect = document.getElementById('detailLevel');
        this.difficultySelect = document.getElementById('difficulty');
        this.numberOfItemsSelect = document.getElementById('numberOfItems');
        
        // Display elements
        this.displaySubject = document.getElementById('displaySubject');
        this.flashcardSubject = document.getElementById('flashcardSubject');
        this.quizSubject = document.getElementById('quizSubject');
        
        // Progress elements
        this.flashcardProgress = document.getElementById('flashcardProgress');
        this.flashcardProgressBar = document.getElementById('flashcardProgressBar');
        this.quizProgress = document.getElementById('quizProgress');
        this.quizProgressBar = document.getElementById('quizProgressBar');
        this.quizScore = document.getElementById('quizScore');
        this.totalQuestions = document.getElementById('totalQuestions');
        
        // Content elements
        this.flashcardQuestion = document.getElementById('flashcardQuestion');
        this.flashcardAnswer = document.getElementById('flashcardAnswer');
        this.quizQuestion = document.getElementById('quizQuestion');
        this.quizOptions = document.getElementById('quizOptions');
        
        // Results elements
        this.finalScore = document.getElementById('finalScore');
        this.scoreMessage = document.getElementById('scoreMessage');
    }
    
    setupEventListeners() {
        // Subject input
        document.getElementById('continueToMode').addEventListener('click', () => this.handleSubjectInput());
        
        // Mode selection
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', () => this.handleModeSelection(card.dataset.mode));
        });
        
        // Settings
        document.getElementById('startLearning').addEventListener('click', () => this.startLearning());
        document.getElementById('detailLevel').addEventListener('change', () => this.toggleDifficultyGroup());
        
        // Navigation
        document.getElementById('backToSubjectInput').addEventListener('click', () => this.showSection('subjectInput'));
        document.getElementById('backToModes').addEventListener('click', () => this.showSection('modeSelection'));
        document.getElementById('backToSettingsFromFlashcards').addEventListener('click', () => this.showSection('settings'));
        document.getElementById('backToSettingsFromQuiz').addEventListener('click', () => this.showSection('settings'));
        document.getElementById('backToSubjectFromResults').addEventListener('click', () => this.resetToSubjectInput());
        
        // Flashcards
        document.getElementById('showAnswer').addEventListener('click', () => this.showFlashcardAnswer());
        document.getElementById('nextFlashcard').addEventListener('click', () => this.nextFlashcard());
        
        // Quiz
        document.getElementById('submitAnswer').addEventListener('click', () => this.submitQuizAnswer());
        
        // Results
        document.getElementById('restartQuiz').addEventListener('click', () => this.restartQuiz());
        
        // Flashcard click to flip
        document.getElementById('flashcard').addEventListener('click', () => this.flipFlashcard());
    }
    
    handleSubjectInput() {
        const subjectName = this.subjectNameInput.value.trim();
        if (!subjectName) {
            alert('Te rog introdu numele subiectului!');
            return;
        }
        
        this.currentSubject = subjectName;
        this.displaySubject.textContent = subjectName;
        this.flashcardSubject.textContent = subjectName;
        this.quizSubject.textContent = subjectName;
        
        this.showSection('modeSelection');
    }
    
    handleModeSelection(mode) {
        this.currentMode = mode;
        this.toggleDifficultyGroup();
        this.showSection('settings');
    }
    
    toggleDifficultyGroup() {
        const difficultyGroup = document.getElementById('difficultyGroup');
        if (this.currentMode === 'quiz') {
            difficultyGroup.style.display = 'block';
        } else {
            difficultyGroup.style.display = 'none';
        }
    }
    
    async startLearning() {
        this.currentSettings = {
            detailLevel: this.detailLevelSelect.value,
            difficulty: this.difficultySelect.value,
            numberOfItems: parseInt(this.numberOfItemsSelect.value),
            learningLevel: this.learningLevelSelect.value,
            subjectDescription: this.subjectDescriptionInput.value
        };
        
        this.showSection('loadingSection');
        
        try {
            if (this.currentMode === 'flashcards') {
                await this.generateFlashcards();
                this.showSection('flashcardsSection');
                this.loadFlashcard(0);
            } else if (this.currentMode === 'quiz') {
                await this.generateQuiz();
                this.showSection('quizSection');
                this.loadQuizQuestion(0);
            }
        } catch (error) {
            console.error('Error generating content:', error);
            alert('A apărut o eroare la generarea conținutului. Te rog încearcă din nou.');
            this.showSection('settings');
        }
    }
    
    async generateFlashcards() {
        const numberOfCards = this.currentSettings.numberOfItems;
        this.flashcards = [];
        
        // Simulez generarea de flashcarduri pe baza subiectului
        for (let i = 0; i < numberOfCards; i++) {
            const card = await this.generateFlashcardContent(i);
            this.flashcards.push(card);
        }
    }
    
    async generateFlashcardContent(index) {
        const subject = this.currentSubject.toLowerCase();
        const detailLevel = this.currentSettings.detailLevel;
        const learningLevel = this.currentSettings.learningLevel;
        
        // Generare conținut pe baza subiectului
        let question, answer;
        
        if (subject.includes('ecuații diferențiale') || subject.includes('diferential')) {
            const questions = [
                {
                    essential: { q: "Ce este o ecuație diferențială?", a: "O ecuație care conține derivate ale unei funcții necunoscute." },
                    detailed: { q: "Definiți ecuația diferențială ordinară de ordinul întâi", a: "O ecuație de forma dy/dx = f(x,y) unde f este o funcție continuă pe un domeniu D din R²." }
                },
                {
                    essential: { q: "Ce înseamnă 'ordinul' unei ecuații diferențiale?", a: "Cel mai mare ordin al derivatei care apare în ecuație." },
                    detailed: { q: "Explicați diferența dintre ecuații diferențiale liniare și neliniare", a: "Ecuațiile liniare au forma aₙ(x)y⁽ⁿ⁾ + aₙ₋₁(x)y⁽ⁿ⁻¹⁾ + ... + a₁(x)y' + a₀(x)y = g(x), iar cele neliniare conțin produse sau puteri ale funcției necunoscute." }
                }
            ];
            
            const qData = questions[index % questions.length];
            question = qData[detailLevel].q;
            answer = qData[detailLevel].a;
        } else if (subject.includes('război mondial') || subject.includes('ww2') || subject.includes('istorie')) {
            const questions = [
                {
                    essential: { q: "Când a început al doilea război mondial?", a: "1 septembrie 1939, când Germania a invadat Polonia." },
                    detailed: { q: "Analizați cauzele principale ale celui de-al doilea război mondial", a: "Cauzele includ: Tratatul de la Versailles, ascensiunea nazismului, politica de apăsare, criza economică din 1929, și expansiunea teritorială a Germaniei și Japoniei." }
                },
                {
                    essential: { q: "Care au fost puterile Axei?", a: "Germania, Italia și Japonia." },
                    detailed: { q: "Explicați strategia Blitzkrieg folosită de Germania", a: "Blitzkrieg (război fulger) era o tactică militară care combina atacuri rapide cu tancuri, aviație și infanterie pentru a surprinde și înfrânge rapid inamicul." }
                }
            ];
            
            const qData = questions[index % questions.length];
            question = qData[detailLevel].q;
            answer = qData[detailLevel].a;
        } else {
            // Generare generică pentru alte subiecte
            question = `Conceptul cheie ${index + 1} din ${this.currentSubject}`;
            answer = detailLevel === 'essential' 
                ? `Definiția esențială pentru conceptul ${index + 1}.`
                : `Explicația detaliată și completă pentru conceptul ${index + 1}, incluzând exemple și aplicații practice.`;
        }
        
        return { question, answer };
    }
    
    async generateQuiz() {
        const numberOfQuestions = this.currentSettings.numberOfItems;
        this.quizQuestions = [];
        
        for (let i = 0; i < numberOfQuestions; i++) {
            const question = await this.generateQuizQuestion(i);
            this.quizQuestions.push(question);
        }
    }
    
    async generateQuizQuestion(index) {
        const subject = this.currentSubject.toLowerCase();
        const difficulty = this.currentSettings.difficulty;
        
        let question, options, correctAnswer;
        
        if (subject.includes('ecuații diferențiale') || subject.includes('diferential')) {
            const questions = [
                {
                    easy: {
                        q: "Ce este o ecuație diferențială?",
                        options: [
                            "O ecuație cu variabile",
                            "O ecuație cu derivate",
                            "O ecuație cu integrale",
                            "O ecuație cu logaritmi"
                        ],
                        correct: 1
                    },
                    medium: {
                        q: "Care este ordinul ecuației d²y/dx² + 3dy/dx + 2y = 0?",
                        options: [
                            "Primul ordin",
                            "Al doilea ordin",
                            "Al treilea ordin",
                            "Al patrulea ordin"
                        ],
                        correct: 1
                    },
                    hard: {
                        q: "Care dintre următoarele este soluția generală a ecuației dy/dx = 2y?",
                        options: [
                            "y = Ce^(2x)",
                            "y = Ce^(x/2)",
                            "y = Ce^(-2x)",
                            "y = Ce^(x²)"
                        ],
                        correct: 0
                    }
                }
            ];
            
            const qData = questions[index % questions.length];
            question = qData[difficulty].q;
            options = qData[difficulty].options;
            correctAnswer = qData[difficulty].correct;
        } else if (subject.includes('război mondial') || subject.includes('ww2') || subject.includes('istorie')) {
            const questions = [
                {
                    easy: {
                        q: "Când a început al doilea război mondial?",
                        options: [
                            "1938",
                            "1939",
                            "1940",
                            "1941"
                        ],
                        correct: 1
                    },
                    medium: {
                        q: "Care a fost prima țară invadată de Germania în 1939?",
                        options: [
                            "Franța",
                            "Polonia",
                            "Cehoslovacia",
                            "Austria"
                        ],
                        correct: 1
                    },
                    hard: {
                        q: "În ce an a fost semnat Pactul Ribbentrop-Molotov?",
                        options: [
                            "23 august 1939",
                            "1 septembrie 1939",
                            "3 septembrie 1939",
                            "17 septembrie 1939"
                        ],
                        correct: 0
                    }
                }
            ];
            
            const qData = questions[index % questions.length];
            question = qData[difficulty].q;
            options = qData[difficulty].options;
            correctAnswer = qData[difficulty].correct;
        } else {
            // Generare generică
            question = `Întrebarea ${index + 1} despre ${this.currentSubject}`;
            options = [
                `Răspunsul A pentru întrebarea ${index + 1}`,
                `Răspunsul B pentru întrebarea ${index + 1}`,
                `Răspunsul C pentru întrebarea ${index + 1}`,
                `Răspunsul D pentru întrebarea ${index + 1}`
            ];
            correctAnswer = Math.floor(Math.random() * 4);
        }
        
        return { question, options, correctAnswer };
    }
    
    loadFlashcard(index) {
        if (index >= this.flashcards.length) return;
        
        const flashcard = this.flashcards[index];
        this.flashcardQuestion.textContent = flashcard.question;
        this.flashcardAnswer.innerHTML = flashcard.answer;
        
        // Reset flashcard state
        document.getElementById('flashcard').classList.remove('flipped');
        document.getElementById('showAnswer').style.display = 'block';
        document.getElementById('nextFlashcard').style.display = 'none';
        
        // Update progress
        this.flashcardProgress.textContent = `${index + 1} / ${this.flashcards.length}`;
        this.flashcardProgressBar.style.width = `${((index + 1) / this.flashcards.length) * 100}%`;
        
        this.currentFlashcardIndex = index;
    }
    
    showFlashcardAnswer() {
        document.getElementById('flashcard').classList.add('flipped');
        document.getElementById('showAnswer').style.display = 'none';
        document.getElementById('nextFlashcard').style.display = 'block';
    }
    
    nextFlashcard() {
        if (this.currentFlashcardIndex < this.flashcards.length - 1) {
            this.loadFlashcard(this.currentFlashcardIndex + 1);
        } else {
            alert('Ai terminat toate flashcardurile!');
        }
    }
    
    flipFlashcard() {
        document.getElementById('flashcard').classList.toggle('flipped');
    }
    
    loadQuizQuestion(index) {
        if (index >= this.quizQuestions.length) {
            this.showResults();
            return;
        }
        
        const question = this.quizQuestions[index];
        this.quizQuestion.textContent = question.question;
        
        // Clear previous options
        this.quizOptions.innerHTML = '';
        
        // Create options
        question.options.forEach((option, i) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.selectAnswer(i, optionElement));
            this.quizOptions.appendChild(optionElement);
        });
        
        // Update progress
        this.quizProgress.textContent = `${index + 1} / ${this.quizQuestions.length}`;
        this.quizProgressBar.style.width = `${((index + 1) / this.quizQuestions.length) * 100}%`;
        this.totalQuestions.textContent = this.quizQuestions.length;
        
        // Reset state
        this.selectedAnswer = null;
        document.getElementById('submitAnswer').disabled = true;
        
        this.currentQuizIndex = index;
    }
    
    selectAnswer(index, element) {
        // Remove previous selection
        document.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        
        // Select new answer
        element.classList.add('selected');
        this.selectedAnswer = index;
        document.getElementById('submitAnswer').disabled = false;
    }
    
    submitQuizAnswer() {
        if (this.selectedAnswer === null) return;
        
        const question = this.quizQuestions[this.currentQuizIndex];
        const options = document.querySelectorAll('.option');
        
        // Show correct answer
        options[question.correctAnswer].classList.add('correct');
        
        // Show incorrect answer if selected wrong
        if (this.selectedAnswer !== question.correctAnswer) {
            options[this.selectedAnswer].classList.add('incorrect');
        } else {
            this.quizScore++;
        }
        
        // Update score display
        document.getElementById('quizScore').textContent = this.quizScore;
        
        // Disable submit button
        document.getElementById('submitAnswer').disabled = true;
        
        // Disable all options
        options.forEach(opt => opt.style.pointerEvents = 'none');
        
        // Auto advance after delay
        setTimeout(() => {
            this.loadQuizQuestion(this.currentQuizIndex + 1);
        }, 2000);
    }
    
    showResults() {
        const percentage = Math.round((this.quizScore / this.quizQuestions.length) * 100);
        this.finalScore.textContent = percentage;
        
        let message;
        if (percentage >= 90) {
            message = "Excelent! Ai o înțelegere profundă a subiectului.";
        } else if (percentage >= 70) {
            message = "Foarte bine! Cunoștințele tale sunt solide.";
        } else if (percentage >= 50) {
            message = "Bun! Continuă să studiezi pentru a îmbunătăți.";
        } else {
            message = "Încearcă din nou! Revizuiește materialul și încearcă din nou.";
        }
        
        this.scoreMessage.textContent = message;
        this.showSection('resultsSection');
    }
    
    restartQuiz() {
        this.quizScore = 0;
        this.currentQuizIndex = 0;
        this.loadQuizQuestion(0);
        this.showSection('quizSection');
    }
    
    resetToSubjectInput() {
        this.currentSubject = '';
        this.currentMode = '';
        this.currentSettings = {};
        this.flashcards = [];
        this.quizQuestions = [];
        this.currentFlashcardIndex = 0;
        this.currentQuizIndex = 0;
        this.quizScore = 0;
        this.selectedAnswer = null;
        
        // Clear inputs
        this.subjectNameInput.value = '';
        this.subjectDescriptionInput.value = '';
        this.learningLevelSelect.value = 'beginner';
        this.detailLevelSelect.value = 'essential';
        this.difficultySelect.value = 'easy';
        this.numberOfItemsSelect.value = '10';
        
        this.showSection('subjectInput');
    }
    
    showSection(sectionName) {
        // Hide all sections
        const sections = ['subjectInput', 'modeSelection', 'settings', 'loadingSection', 'flashcardsSection', 'quizSection', 'resultsSection'];
        sections.forEach(section => {
            document.getElementById(section).style.display = 'none';
        });
        
        // Show selected section
        document.getElementById(sectionName).style.display = 'block';
    }
}

// Initialize the platform when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EducationalPlatform();
});