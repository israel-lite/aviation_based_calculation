// Eazee TSD Calc - Main JavaScript
class EazeeTSDCalc {
    constructor() {
        this.history = [];
        this.quizScore = 0;
        this.totalQuestions = 0;
        this.currentQuestion = null;
        this.quizTimer = null;
        this.challengeScore = 0;
        this.challengeQuestion = 0;
        this.challengeStreak = 0;
        
        this.init();
    }

    init() {
        this.loadHistory();
        this.setupEventListeners();
        this.setupConverters();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Calculator
        document.getElementById('calculate-type').addEventListener('change', () => this.updateCalculatorFields());
        document.getElementById('calculate-btn').addEventListener('click', () => this.calculate());

        // Quiz
        document.getElementById('start-quiz-btn').addEventListener('click', () => this.startQuiz());
        document.getElementById('next-question-btn').addEventListener('click', () => this.nextQuestion());

        // Challenge
        document.getElementById('start-challenge-btn').addEventListener('click', () => this.startChallenge());
        document.getElementById('retry-challenge-btn').addEventListener('click', () => this.retryChallenge());

        // Enter key support for calculator
        ['speed-input', 'time-input', 'distance-input'].forEach(id => {
            document.getElementById(id).addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.calculate();
            });
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }

    updateCalculatorFields() {
        const calculateType = document.getElementById('calculate-type').value;
        const speedInput = document.getElementById('speed-input');
        const timeInput = document.getElementById('time-input');
        const distanceInput = document.getElementById('distance-input');

        // Reset all fields
        speedInput.disabled = false;
        timeInput.disabled = false;
        distanceInput.disabled = false;
        speedInput.value = '';
        timeInput.value = '';
        distanceInput.value = '';

        // Disable the field being calculated
        switch (calculateType) {
            case 'distance':
                distanceInput.disabled = true;
                distanceInput.placeholder = 'Will be calculated';
                break;
            case 'speed':
                speedInput.disabled = true;
                speedInput.placeholder = 'Will be calculated';
                break;
            case 'time':
                timeInput.disabled = true;
                timeInput.placeholder = 'Will be calculated';
                break;
        }

        // Hide previous results
        document.getElementById('result-section').classList.add('hidden');
    }

    calculate() {
        const calculateType = document.getElementById('calculate-type').value;
        const speed = parseFloat(document.getElementById('speed-input').value);
        const time = parseFloat(document.getElementById('time-input').value);
        const distance = parseFloat(document.getElementById('distance-input').value);

        let result, formula, substitution;

        try {
            switch (calculateType) {
                case 'distance':
                    if (isNaN(speed) || isNaN(time)) {
                        throw new Error('Please enter valid speed and time values');
                    }
                    result = speed * time;
                    formula = 'Distance = Speed × Time';
                    substitution = `= ${speed} × ${time}`;
                    break;

                case 'speed':
                    if (isNaN(distance) || isNaN(time)) {
                        throw new Error('Please enter valid distance and time values');
                    }
                    result = distance / time;
                    formula = 'Speed = Distance ÷ Time';
                    substitution = `= ${distance} ÷ ${time}`;
                    break;

                case 'time':
                    if (isNaN(distance) || isNaN(speed)) {
                        throw new Error('Please enter valid distance and speed values');
                    }
                    result = distance / speed;
                    formula = 'Time = Distance ÷ Speed';
                    substitution = `= ${distance} ÷ ${speed}`;
                    break;
            }

            // Display result
            this.displayResult(result, formula, substitution, calculateType);
            
            // Add to history
            this.addToHistory({
                type: calculateType,
                speed: speed,
                time: time,
                distance: distance,
                result: result,
                timestamp: new Date().toLocaleString()
            });

        } catch (error) {
            this.showError(error.message);
        }
    }

    displayResult(result, formula, substitution, type) {
        const resultSection = document.getElementById('result-section');
        const resultDisplay = document.getElementById('result-display');
        const stepByStep = document.getElementById('step-by-step');

        // Format result based on type
        let resultText = '';
        switch (type) {
            case 'distance':
                resultText = `${result.toFixed(2)} NM`;
                break;
            case 'speed':
                resultText = `${result.toFixed(2)} knots`;
                break;
            case 'time':
                resultText = `${result.toFixed(2)} hours`;
                break;
        }

        resultDisplay.textContent = resultText;
        
        stepByStep.innerHTML = `
            <div><strong>${formula}</strong></div>
            <div>${substitution}</div>
            <div><strong>= ${result.toFixed(2)}</strong></div>
        `;

        resultSection.classList.remove('hidden');
    }

    showError(message) {
        const resultSection = document.getElementById('result-section');
        const resultDisplay = document.getElementById('result-display');
        const stepByStep = document.getElementById('step-by-step');

        resultDisplay.textContent = 'Error';
        resultDisplay.style.color = 'var(--accent-red)';
        
        stepByStep.innerHTML = `<div style="color: var(--accent-red)">${message}</div>`;
        
        resultSection.classList.remove('hidden');
        
        // Reset color after 3 seconds
        setTimeout(() => {
            resultDisplay.style.color = 'var(--accent-green)';
        }, 3000);
    }

    addToHistory(calculation) {
        this.history.unshift(calculation);
        if (this.history.length > 10) {
            this.history = this.history.slice(0, 10);
        }
        this.saveHistory();
        this.displayHistory();
    }

    saveHistory() {
        localStorage.setItem('eazeeTSDHistory', JSON.stringify(this.history));
    }

    loadHistory() {
        const saved = localStorage.getItem('eazeeTSDHistory');
        if (saved) {
            this.history = JSON.parse(saved);
            this.displayHistory();
        }
    }

    displayHistory() {
        const historyList = document.getElementById('history-list');
        
        if (this.history.length === 0) {
            historyList.innerHTML = '<p class="no-history">No calculations yet</p>';
            return;
        }

        historyList.innerHTML = this.history.map((item, index) => {
            let calculation = '';
            switch (item.type) {
                case 'distance':
                    calculation = `${item.speed} kt × ${item.time} hr = ${item.result.toFixed(2)} NM`;
                    break;
                case 'speed':
                    calculation = `${item.distance} NM ÷ ${item.time} hr = ${item.result.toFixed(2)} kt`;
                    break;
                case 'time':
                    calculation = `${item.distance} NM ÷ ${item.speed} kt = ${item.result.toFixed(2)} hr`;
                    break;
            }

            return `
                <div class="history-item">
                    <div><strong>${calculation}</strong></div>
                    <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.25rem;">
                        ${item.timestamp}
                    </div>
                </div>
            `;
        }).join('');
    }

    generateQuestion() {
        const types = ['distance', 'speed', 'time'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let speed, time, distance, question, correctAnswer;
        
        // Generate realistic aviation values
        speed = Math.floor(Math.random() * 400) + 100; // 100-500 knots
        time = (Math.random() * 5 + 0.5).toFixed(1); // 0.5-5.5 hours
        distance = Math.floor(speed * time * 100) / 100; // Calculate precise distance

        switch (type) {
            case 'distance':
                question = `An aircraft flies at ${speed} knots for ${time} hours. What distance is covered?`;
                correctAnswer = distance;
                break;
            case 'speed':
                question = `An aircraft covers ${distance.toFixed(1)} nautical miles in ${time} hours. What is its speed?`;
                correctAnswer = speed;
                break;
            case 'time':
                question = `An aircraft needs to travel ${distance.toFixed(1)} nautical miles at ${speed} knots. How long will it take?`;
                correctAnswer = parseFloat(time);
                break;
        }

        // Generate wrong answers
        const wrongAnswers = this.generateWrongAnswers(correctAnswer, type);
        
        return {
            question,
            correctAnswer,
            wrongAnswers,
            type,
            data: { speed, time, distance }
        };
    }

    generateWrongAnswers(correct, type) {
        const wrong = [];
        const variation = correct * 0.3; // 30% variation

        for (let i = 0; i < 3; i++) {
            let wrongAnswer;
            do {
                wrongAnswer = correct + (Math.random() - 0.5) * 2 * variation;
                wrongAnswer = Math.max(0.1, wrongAnswer); // Ensure positive
            } while (wrong.some(w => Math.abs(w - wrongAnswer) < 0.1) || Math.abs(wrongAnswer - correct) < 0.1);
            
            wrong.push(wrongAnswer);
        }

        return wrong;
    }

    startQuiz() {
        this.quizScore = 0;
        this.totalQuestions = 0;
        document.getElementById('score').textContent = '0';
        document.getElementById('total-questions').textContent = '0';
        document.getElementById('quiz-content').classList.remove('hidden');
        
        this.nextQuestion();
    }

    nextQuestion() {
        // Clear previous feedback
        document.getElementById('quiz-feedback').classList.add('hidden');
        
        // Reset option buttons
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('correct', 'incorrect');
            btn.disabled = false;
        });

        // Generate new question
        this.currentQuestion = this.generateQuestion();
        
        // Display question
        document.getElementById('question-text').textContent = this.currentQuestion.question;
        
        // Prepare options
        const options = [this.currentQuestion.correctAnswer, ...this.currentQuestion.wrongAnswers];
        options.sort(() => Math.random() - 0.5); // Shuffle
        
        // Display options
        const optionButtons = document.querySelectorAll('.option-btn');
        optionButtons.forEach((btn, index) => {
            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
            btn.textContent = `${optionLetter}) ${this.formatAnswer(options[index], this.currentQuestion.type)}`;
            btn.onclick = () => this.checkAnswer(options[index], btn);
        });

        // Start timer if enabled
        if (document.getElementById('timer-toggle').checked) {
            this.startQuizTimer();
        }
    }

    formatAnswer(answer, type) {
        switch (type) {
            case 'distance':
                return `${answer.toFixed(1)} NM`;
            case 'speed':
                return `${answer.toFixed(0)} knots`;
            case 'time':
                return `${answer.toFixed(1)} hours`;
            default:
                return answer.toFixed(1);
        }
    }

    checkAnswer(selectedAnswer, buttonElement) {
        // Disable all buttons
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
        });

        const isCorrect = Math.abs(selectedAnswer - this.currentQuestion.correctAnswer) < 0.1;
        
        if (isCorrect) {
            buttonElement.classList.add('correct');
            this.quizScore++;
        } else {
            buttonElement.classList.add('incorrect');
            // Show correct answer
            document.querySelectorAll('.option-btn').forEach(btn => {
                if (btn.textContent.includes(this.formatAnswer(this.currentQuestion.correctAnswer, this.currentQuestion.type))) {
                    btn.classList.add('correct');
                }
            });
        }

        this.totalQuestions++;
        document.getElementById('score').textContent = this.quizScore;
        document.getElementById('total-questions').textContent = this.totalQuestions;

        // Clear timer
        if (this.quizTimer) {
            clearInterval(this.quizTimer);
        }

        // Show feedback
        this.showQuizFeedback(isCorrect);
    }

    showQuizFeedback(isCorrect) {
        const feedback = document.getElementById('quiz-feedback');
        const feedbackContent = feedback.querySelector('.feedback-content');
        
        const { data, type } = this.currentQuestion;
        let explanation = '';
        
        switch (type) {
            case 'distance':
                explanation = `Distance = Speed × Time = ${data.speed} × ${data.time} = ${data.distance.toFixed(1)} NM`;
                break;
            case 'speed':
                explanation = `Speed = Distance ÷ Time = ${data.distance.toFixed(1)} ÷ ${data.time} = ${data.speed} knots`;
                break;
            case 'time':
                explanation = `Time = Distance ÷ Speed = ${data.distance.toFixed(1)} ÷ ${data.speed} = ${data.time} hours`;
                break;
        }

        feedbackContent.innerHTML = `
            <div style="font-size: 1.2rem; margin-bottom: 1rem;">
                ${isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </div>
            <div><strong>Explanation:</strong> ${explanation}</div>
        `;
        
        feedback.classList.remove('hidden');
    }

    startQuizTimer() {
        let timeLeft = 30;
        const timerDisplay = document.getElementById('timer-display');
        const timerContainer = document.querySelector('.quiz-timer');
        
        timerContainer.classList.remove('hidden');
        timerDisplay.textContent = timeLeft;
        
        this.quizTimer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(this.quizTimer);
                // Auto-select wrong answer
                this.checkAnswer(-1, null);
            }
        }, 1000);
    }

    setupConverters() {
        // Minutes to Hours
        document.getElementById('minutes-input').addEventListener('input', (e) => {
            const minutes = parseFloat(e.target.value) || 0;
            document.getElementById('hours-result').textContent = (minutes / 60).toFixed(2);
        });

        // Hours to Minutes
        document.getElementById('hours-input').addEventListener('input', (e) => {
            const hours = parseFloat(e.target.value) || 0;
            document.getElementById('minutes-result').textContent = Math.round(hours * 60);
        });

        // Knots to km/h
        document.getElementById('knots-input').addEventListener('input', (e) => {
            const knots = parseFloat(e.target.value) || 0;
            document.getElementById('kmh-result').textContent = (knots * 1.852).toFixed(2);
        });

        // km/h to Knots
        document.getElementById('kmh-input-conv').addEventListener('input', (e) => {
            const kmh = parseFloat(e.target.value) || 0;
            document.getElementById('knots-result').textContent = (kmh / 1.852).toFixed(2);
        });
    }

    startChallenge() {
        this.challengeScore = 0;
        this.challengeQuestion = 0;
        this.challengeStreak = 0;
        
        document.getElementById('start-challenge-btn').classList.add('hidden');
        document.getElementById('challenge-game').classList.remove('hidden');
        document.getElementById('challenge-result').classList.add('hidden');
        
        this.nextChallengeQuestion();
    }

    nextChallengeQuestion() {
        this.challengeQuestion++;
        
        if (this.challengeQuestion > 5) {
            this.endChallenge();
            return;
        }

        // Update progress
        document.getElementById('current-question').textContent = this.challengeQuestion;
        document.getElementById('progress-fill').style.width = `${(this.challengeQuestion - 1) * 20}%`;
        
        // Update stats
        document.getElementById('challenge-score').textContent = this.challengeScore;
        document.getElementById('challenge-streak').textContent = this.challengeStreak;

        // Generate harder questions as we progress
        const difficulty = this.challengeQuestion;
        this.currentQuestion = this.generateChallengeQuestion(difficulty);
        
        // Display question
        document.getElementById('challenge-question').textContent = this.currentQuestion.question;
        
        // Prepare options
        const options = [this.currentQuestion.correctAnswer, ...this.currentQuestion.wrongAnswers];
        options.sort(() => Math.random() - 0.5);
        
        // Display options
        const optionButtons = document.querySelectorAll('.challenge-option');
        optionButtons.forEach((btn, index) => {
            const optionLetter = String.fromCharCode(65 + index);
            btn.textContent = `${optionLetter}) ${this.formatAnswer(options[index], this.currentQuestion.type)}`;
            btn.classList.remove('correct', 'incorrect');
            btn.disabled = false;
            btn.onclick = () => this.checkChallengeAnswer(options[index], btn);
        });
    }

    generateChallengeQuestion(difficulty) {
        const types = ['distance', 'speed', 'time'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let speed, time, distance, question, correctAnswer;
        
        // Increase difficulty with larger numbers and decimals
        const speedMultiplier = 1 + (difficulty - 1) * 0.5;
        const timeMultiplier = 1 + (difficulty - 1) * 0.3;
        
        speed = Math.floor((Math.random() * 300 + 150) * speedMultiplier);
        time = (Math.random() * 4 + 0.5) * timeMultiplier;
        distance = Math.floor(speed * time * 100) / 100;

        switch (type) {
            case 'distance':
                question = `A ${this.getAircraftType(difficulty)} flies at ${speed} knots for ${time.toFixed(1)} hours. What distance is covered?`;
                correctAnswer = distance;
                break;
            case 'speed':
                question = `A ${this.getAircraftType(difficulty)} covers ${distance.toFixed(1)} nautical miles in ${time.toFixed(1)} hours. What is its speed?`;
                correctAnswer = speed;
                break;
            case 'time':
                question = `A ${this.getAircraftType(difficulty)} needs to travel ${distance.toFixed(1)} nautical miles at ${speed} knots. How long will it take?`;
                correctAnswer = time;
                break;
        }

        const wrongAnswers = this.generateWrongAnswers(correctAnswer, type);
        
        return {
            question,
            correctAnswer,
            wrongAnswers,
            type,
            data: { speed, time, distance }
        };
    }

    getAircraftType(difficulty) {
        const aircraft = [
            'Cessna 172', 'Boeing 737', 'Airbus A320', 'Boeing 747', 
            'Concorde', 'F-22 Raptor', 'SR-71 Blackbird'
        ];
        return aircraft[Math.min(difficulty - 1, aircraft.length - 1)];
    }

    checkChallengeAnswer(selectedAnswer, buttonElement) {
        const isCorrect = Math.abs(selectedAnswer - this.currentQuestion.correctAnswer) < 0.1;
        
        if (isCorrect) {
            buttonElement.classList.add('correct');
            this.challengeScore++;
            this.challengeStreak++;
        } else {
            buttonElement.classList.add('incorrect');
            this.challengeStreak = 0;
            // Show correct answer
            document.querySelectorAll('.challenge-option').forEach(btn => {
                if (btn.textContent.includes(this.formatAnswer(this.currentQuestion.correctAnswer, this.currentQuestion.type))) {
                    btn.classList.add('correct');
                }
            });
        }

        // Disable all buttons
        document.querySelectorAll('.challenge-option').forEach(btn => {
            btn.disabled = true;
        });

        // Auto advance after delay
        setTimeout(() => {
            this.nextChallengeQuestion();
        }, 2000);
    }

    endChallenge() {
        document.getElementById('challenge-game').classList.add('hidden');
        document.getElementById('challenge-result').classList.remove('hidden');
        
        const accuracy = Math.round((this.challengeScore / 5) * 100);
        let rank, rankEmoji;
        
        if (this.challengeScore >= 5) {
            rank = 'Captain';
            rankEmoji = '✈️';
        } else if (this.challengeScore >= 4) {
            rank = 'First Officer';
            rankEmoji = '🛩️';
        } else if (this.challengeScore >= 3) {
            rank = 'Senior Pilot';
            rankEmoji = '🚁';
        } else {
            rank = 'Cadet';
            rankEmoji = '🎓';
        }

        document.getElementById('challenge-rank').textContent = `${rankEmoji} ${rank}!`;
        document.getElementById('final-score').textContent = this.challengeScore;
        document.getElementById('accuracy').textContent = accuracy;
        document.getElementById('rank-badge').textContent = rankEmoji;
    }

    retryChallenge() {
        document.getElementById('challenge-result').classList.add('hidden');
        document.getElementById('start-challenge-btn').classList.remove('hidden');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EazeeTSDCalc();
});
