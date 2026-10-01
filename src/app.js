const levels = [
  { name: 'المستوى 1', key: 'easy', badge: 'بدون قواعد', emoji: '😊' },
  { name: 'المستوى 2', key: 'rule5', badge: 'قواعد 5', emoji: '🤩' },
  { name: 'المستوى 3', key: 'rule10', badge: 'قواعد 10', emoji: '🚀' },
  { name: 'المستوى 4', key: 'ops', badge: 'العمليات الأربع', emoji: '🏆' },
];

let currentLevel = 0;
let score = 0;
let streak = 0;
let totalAnswered = 0;
let correctAnswers = 0;
let bestStreak = 0;
let currentQuestion = null;

const taskText = document.getElementById('taskText');
const answersEl = document.getElementById('answers');
const levelName = document.getElementById('levelName');
const levelBadge = document.getElementById('levelBadge');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const stageCounter = document.getElementById('stageCounter');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const avatar = document.getElementById('avatar');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');
const correctCount = document.getElementById('correctCount');
const successRate = document.getElementById('successRate');
const bestStreakEl = document.getElementById('bestStreak');

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeQuestion(levelKey) {
  let expression = '';
  let answer = 0;

  if (levelKey === 'easy') {
    const a = randomInt(1, 9);
    const b = randomInt(1, 9);
    const op = Math.random() > 0.5 ? '+' : '-';

    if (op === '+') {
      answer = a + b;
      expression = `${a} + ${b} = ?`;
    } else {
      const x = Math.max(a, b);
      const y = Math.min(a, b);
      answer = x - y;
      expression = `${x} - ${y} = ?`;
    }
  }

  if (levelKey === 'rule5') {
    const a = randomInt(1, 8);
    const b = randomInt(1, 4);
    const op = Math.random() > 0.5 ? '+' : '-';

    if (op === '+') {
      answer = a + b + 5;
      expression = `${a} + ${b} + 5 = ?`;
    } else {
      answer = a + 5 - b;
      expression = `${a} + 5 - ${b} = ?`;
    }
  }

  if (levelKey === 'rule10') {
    const a = randomInt(1, 9);
    const b = randomInt(2, 8);
    const op = Math.random() > 0.5 ? '+' : '-';

    if (op === '+') {
      answer = a + b + 10;
      expression = `${a} + ${b} + 10 = ?`;
    } else {
      answer = 10 + a - b;
      expression = `10 + ${a} - ${b} = ?`;
    }
  }

  if (levelKey === 'ops') {
    const ops = ['+', '-', '×', '÷'];
    const op = ops[randomInt(0, ops.length - 1)];

    if (op === '+') {
      const a = randomInt(5, 15);
      const b = randomInt(3, 12);
      answer = a + b;
      expression = `${a} + ${b} = ?`;
    } else if (op === '-') {
      const a = randomInt(5, 18);
      const b = randomInt(1, a - 1);
      answer = a - b;
      expression = `${a} - ${b} = ?`;
    } else if (op === '×') {
      const a = randomInt(2, 9);
      const b = randomInt(2, 9);
      answer = a * b;
      expression = `${a} × ${b} = ?`;
    } else {
      const b = randomInt(2, 9);
      const answerTmp = randomInt(2, 9);
      const a = b * answerTmp;
      answer = answerTmp;
      expression = `${a} ÷ ${b} = ?`;
    }
  }

  let options = [answer];
  while (options.length < 4) {
    let wrong = answer + randomInt(-15, 15);
    if (wrong === answer || wrong < 0) continue;
    if (!options.includes(wrong)) options.push(wrong);
  }

  options = shuffle(options);
  return { expression, answer, options };
}

function updateStats() {
  const current = levels[currentLevel];
  levelName.textContent = `${current.name}`;
  levelBadge.textContent = current.badge;
  stageCounter.textContent = `${currentLevel + 1}/${levels.length}`;
  scoreEl.textContent = score;
  streakEl.textContent = streak;
  progressBar.style.width = `${((currentLevel + 1) / levels.length) * 100}%`;
  progressText.textContent = `${Math.round(((currentLevel + 1) / levels.length) * 100)}%`;
  avatar.textContent = current.emoji;

  correctCount.textContent = correctAnswers;
  const rate = totalAnswered === 0 ? 0 : Math.round((correctAnswers / totalAnswered) * 100);
  successRate.textContent = `${rate}%`;
  bestStreakEl.textContent = bestStreak;
}

function renderQuestion() {
  const current = levels[currentLevel];
  currentQuestion = makeQuestion(current.key);
  taskText.innerHTML = currentQuestion.expression.replace('?', '<em>؟</em>');
  answersEl.innerHTML = '';

  currentQuestion.options.forEach((value) => {
    const button = document.createElement('button');
    button.className = 'answer';
    button.textContent = value;
    button.addEventListener('click', () => checkAnswer(button, value));
    answersEl.appendChild(button);
  });

  updateStats();
}

function checkAnswer(button, chosen) {
  totalAnswered++;
  const isCorrect = chosen === currentQuestion.answer;

  document.querySelectorAll('.answer').forEach((btn) => {
    btn.disabled = true;
  });

  if (isCorrect) {
    button.classList.add('correct');
    score += 10;
    streak += 1;
    correctAnswers += 1;
    if (streak > bestStreak) bestStreak = streak;
    avatar.textContent = '😄';
  } else {
    button.classList.add('wrong');
    const correctBtn = [...document.querySelectorAll('.answer')].find(
      (btn) => Number(btn.textContent) === currentQuestion.answer
    );
    if (correctBtn) correctBtn.classList.add('correct');
    streak = 0;
    avatar.textContent = '😵';
  }

  updateStats();

  setTimeout(() => {
    if (currentLevel < levels.length - 1 && streak >= 3) {
      currentLevel++;
      streak = 0;
      renderQuestion();
      return;
    }

    if (currentLevel === levels.length - 1 && streak >= 3) {
      taskText.innerHTML = '🎉 <em>مبروك!</em> 🎉<br>أكملت كل المستويات';
      answersEl.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 20px; font-size: 1.3rem; color: #2c6fcf; background: linear-gradient(135deg, #eef7ff, #e6f3ff); border-radius: 16px; font-weight: bold;">النقاط النهائية: ${score}</div>`;
      avatar.textContent = '🏆';
      nextBtn.textContent = '🔄 العب مرة أخرى';
      updateStats();
      return;
    }

    renderQuestion();
  }, 1000);
}

function startGame() {
  currentLevel = 0;
  score = 0;
  streak = 0;
  totalAnswered = 0;
  correctAnswers = 0;
  bestStreak = 0;
  nextBtn.textContent = 'ابدأ اللعبة 🎮';
  renderQuestion();
}

nextBtn.addEventListener('click', () => {
  if (nextBtn.textContent.includes('العب مرة أخرى')) {
    startGame();
    return;
  }
  renderQuestion();
});

restartBtn.addEventListener('click', () => startGame());

startGame();
