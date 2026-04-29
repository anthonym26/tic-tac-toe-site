// ── State ────────────────────────────────────────
const state = {
  board: Array(9).fill(''),
  current: 'X',
  gameOver: false,
  scores: { X: 0, O: 0, draws: 0 },
};

const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6],         // diagonals
];

// ── DOM refs ─────────────────────────────────────
const cells         = document.querySelectorAll('.cell');
const statusText    = document.getElementById('status-text');
const turnDot       = document.getElementById('turn-dot');
const resultOverlay = document.getElementById('result-overlay');
const resultText    = document.getElementById('result-text');
const resultEmoji   = document.getElementById('result-emoji');
const scoreX        = document.getElementById('score-x-val');
const scoreO        = document.getElementById('score-o-val');
const scoreDraws    = document.getElementById('score-draws');
const scoreCardX    = document.getElementById('score-x');
const scoreCardO    = document.getElementById('score-o');

// ── Init ─────────────────────────────────────────
function init() {
  cells.forEach(cell => {
    cell.addEventListener('click', handleClick);
  });
  document.getElementById('btn-restart').addEventListener('click', restartGame);
  document.getElementById('btn-overlay-restart').addEventListener('click', restartGame);
  document.getElementById('btn-reset-score').addEventListener('click', resetScore);

  updateScoreboard();
  updateStatus();
}

// ── Click handler ─────────────────────────────────
function handleClick(e) {
  const idx = parseInt(e.currentTarget.dataset.index);
  if (state.board[idx] || state.gameOver) return;

  state.board[idx] = state.current;
  renderCell(idx);

  const winner = checkWin();
  if (winner) {
    endGame('win', winner);
  } else if (state.board.every(Boolean)) {
    endGame('draw');
  } else {
    state.current = state.current === 'X' ? 'O' : 'X';
    updateStatus();
  }
}

// ── Render a cell ─────────────────────────────────
function renderCell(idx) {
  const cell = cells[idx];
  cell.textContent = state.board[idx];
  cell.classList.add(state.board[idx].toLowerCase(), 'taken');
}

// ── Check win ────────────────────────────────────
function checkWin() {
  for (const [a, b, c] of WIN_COMBOS) {
    const v = state.board[a];
    if (v && v === state.board[b] && v === state.board[c]) {
      return { player: v, combo: [a, b, c] };
    }
  }
  return null;
}

// ── End game ─────────────────────────────────────
function endGame(type, winner) {
  state.gameOver = true;
  cells.forEach(c => c.classList.add('game-over'));

  if (type === 'win') {
    winner.combo.forEach(i => cells[i].classList.add('winning'));
    state.scores[winner.player]++;
    updateScoreboard();

    resultEmoji.textContent = '🏆';
    resultText.textContent = `Player ${winner.player} Wins!`;
    resultText.style.color = winner.player === 'X'
      ? 'var(--x-color)' : 'var(--o-color)';
  } else {
    state.scores.draws++;
    updateScoreboard();
    resultEmoji.textContent = '🤝';
    resultText.textContent = "It's a Draw!";
    resultText.style.color = 'var(--accent)';
  }

  turnDot.classList.add('done');
  statusText.textContent = type === 'win'
    ? `Player ${winner.player} Wins!`
    : "It's a Draw!";

  setTimeout(() => resultOverlay.classList.add('show'), 600);
}

// ── Restart ───────────────────────────────────────
function restartGame() {
  state.board = Array(9).fill('');
  state.current = 'X';
  state.gameOver = false;

  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
  });

  resultOverlay.classList.remove('show');
  updateStatus();
  updateScoreboard();
}

// ── Reset score ───────────────────────────────────
function resetScore() {
  state.scores = { X: 0, O: 0, draws: 0 };
  updateScoreboard();
  restartGame();
}

// ── Update UI ─────────────────────────────────────
function updateStatus() {
  statusText.textContent = `Player ${state.current}'s Turn`;
  turnDot.classList.toggle('o-turn', state.current === 'O');
  turnDot.classList.remove('done');

  scoreCardX.classList.toggle('active-player', state.current === 'X');
  scoreCardO.classList.toggle('active-player', state.current === 'O');
}

function updateScoreboard() {
  scoreX.textContent    = state.scores.X;
  scoreO.textContent    = state.scores.O;
  scoreDraws.textContent = state.scores.draws;
}

// ── Start ─────────────────────────────────────────
init();
