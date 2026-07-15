import { useMemo, useState } from 'react';

const FLOWERS = ['🌹', '🌷', '🌼', '🌺'];
const SIZE = 6;
const TARGET = 24;
const WIN_DELAY = 700;
const CASCADE_DELAY = 260;
const FALL_DELAY = 180;
const FALLBACK_BOARD = [
  '🌹', '🌹', '🌺', '🌺', '🌷', '🌷',
  '🌷', '🌼', '🌹', '🌼', '🌺', '🌼',
  '🌺', '🌷', '🌺', '🌹', '🌺', '🌹',
  '🌹', '🌹', '🌺', '🌼', '🌼', '🌷',
  '🌺', '🌺', '🌷', '🌺', '🌹', '🌷',
  '🌼', '🌺', '🌷', '🌼', '🌹', '🌺',
];

const randomFlower = () => FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
const indexOf = (row, col) => row * SIZE + col;
const rowOf = (index) => Math.floor(index / SIZE);
const colOf = (index) => index % SIZE;
const cloneBoard = (board) => [...board];
const areNeighbors = (a, b) => Math.abs(rowOf(a) - rowOf(b)) + Math.abs(colOf(a) - colOf(b)) === 1;

export function findMatches(board) {
  const matches = new Set();

  for (let row = 0; row < SIZE; row += 1) {
    let streak = [indexOf(row, 0)];
    for (let col = 1; col < SIZE; col += 1) {
      const current = indexOf(row, col);
      const previous = indexOf(row, col - 1);
      if (board[current] && board[current] === board[previous]) {
        streak.push(current);
      } else {
        if (streak.length >= 3) streak.forEach((item) => matches.add(item));
        streak = [current];
      }
    }
    if (streak.length >= 3) streak.forEach((item) => matches.add(item));
  }

  for (let col = 0; col < SIZE; col += 1) {
    let streak = [indexOf(0, col)];
    for (let row = 1; row < SIZE; row += 1) {
      const current = indexOf(row, col);
      const previous = indexOf(row - 1, col);
      if (board[current] && board[current] === board[previous]) {
        streak.push(current);
      } else {
        if (streak.length >= 3) streak.forEach((item) => matches.add(item));
        streak = [current];
      }
    }
    if (streak.length >= 3) streak.forEach((item) => matches.add(item));
  }

  return matches;
}

export function swapCells(board, first, second) {
  const swapped = cloneBoard(board);
  [swapped[first], swapped[second]] = [swapped[second], swapped[first]];
  return swapped;
}

export function hasPossibleMove(board) {
  for (let index = 0; index < board.length; index += 1) {
    const row = rowOf(index);
    const col = colOf(index);
    const neighbors = [];
    if (col < SIZE - 1) neighbors.push(index + 1);
    if (row < SIZE - 1) neighbors.push(index + SIZE);

    for (const neighbor of neighbors) {
      if (findMatches(swapCells(board, index, neighbor)).size > 0) return true;
    }
  }
  return false;
}

function wouldCreateMatch(board, index, flower) {
  const row = rowOf(index);
  const col = colOf(index);
  return (
    col >= 2 && board[indexOf(row, col - 1)] === flower && board[indexOf(row, col - 2)] === flower
  ) || (
    row >= 2 && board[indexOf(row - 1, col)] === flower && board[indexOf(row - 2, col)] === flower
  );
}

function generateCleanBoard() {
  const board = [];
  for (let index = 0; index < SIZE * SIZE; index += 1) {
    const choices = FLOWERS.filter((flower) => !wouldCreateMatch(board, index, flower));
    board[index] = choices[Math.floor(Math.random() * choices.length)] || randomFlower();
  }
  return board;
}

export function generatePlayableBoard() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const board = generateCleanBoard();
    if (findMatches(board).size === 0 && hasPossibleMove(board)) return board;
  }
  return cloneBoard(FALLBACK_BOARD);
}

export function reshuffleBoard(board = []) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const shuffled = cloneBoard(board.length ? board : generateCleanBoard()).sort(() => Math.random() - 0.5);
    if (findMatches(shuffled).size === 0 && hasPossibleMove(shuffled)) return shuffled;
  }
  return generatePlayableBoard();
}

function collapseAndFill(board, matched) {
  const next = Array(SIZE * SIZE).fill(null);
  for (let col = 0; col < SIZE; col += 1) {
    const kept = [];
    for (let row = SIZE - 1; row >= 0; row -= 1) {
      const index = indexOf(row, col);
      if (!matched.has(index) && board[index]) kept.push(board[index]);
    }
    for (let row = SIZE - 1; row >= 0; row -= 1) {
      next[indexOf(row, col)] = kept.shift() || randomFlower();
    }
  }
  return next;
}

export function FlowerGame({ game, onComplete }) {
  const [board, setBoard] = useState(generatePlayableBoard);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [matched, setMatched] = useState(new Set());
  const [swapping, setSwapping] = useState(new Set());
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState('Выбери цветок, затем соседний.');
  const [won, setWon] = useState(false);
  const safeScore = useMemo(() => Math.min(score, TARGET), [score]);

  const complete = () => {
    if (won) return;
    setWon(true);
    window.setTimeout(() => onComplete(game.letter, {
      title: 'Второй ключ найден',
      text: 'Красивый букет собирается из маленьких деталей.\nЕщё один шаг сделан.',
    }), WIN_DELAY);
  };

  const resolveBoard = async (startBoard, initialScore) => {
    setProcessing(true);
    let currentBoard = startBoard;
    let nextScore = initialScore;

    while (true) {
      const matches = findMatches(currentBoard);
      if (matches.size === 0) break;
      setMatched(matches);
      await new Promise((resolve) => { window.setTimeout(resolve, CASCADE_DELAY); });
      nextScore += matches.size;
      currentBoard = collapseAndFill(currentBoard, matches);
      setScore(nextScore);
      setBoard(currentBoard);
      setMatched(new Set());
      await new Promise((resolve) => { window.setTimeout(resolve, FALL_DELAY); });
    }

    if (nextScore >= TARGET) {
      setProcessing(false);
      complete();
      return;
    }

    if (!hasPossibleMove(currentBoard)) {
      setMessage('Цветы перемешиваются…');
      await new Promise((resolve) => { window.setTimeout(resolve, 420); });
      currentBoard = reshuffleBoard(currentBoard);
      setBoard(currentBoard);
    }

    setMessage('Выбери цветок, затем соседний.');
    setProcessing(false);
  };

  const chooseCell = (index) => {
    if (won || processing) return;
    if (selected === null) {
      setSelected(index);
      return;
    }
    if (selected === index) {
      setSelected(null);
      return;
    }
    if (!areNeighbors(selected, index)) {
      setSelected(index);
      setMessage('Можно менять только соседние цветы.');
      return;
    }

    const swapped = swapCells(board, selected, index);
    setSelected(null);
    setSwapping(new Set([selected, index]));
    setBoard(swapped);

    if (findMatches(swapped).size === 0) {
      setMessage('Такой обмен не собирает три цветка. Попробуй другой.');
      setProcessing(true);
      window.setTimeout(() => {
        setBoard(board);
        setSwapping(new Set());
        setProcessing(false);
      }, 260);
      return;
    }

    setSwapping(new Set());
    setMessage('Отлично! Цветы собираются…');
    resolveBoard(swapped, score);
  };


  return (
    <section className={`game-card flower-game ${won ? 'is-won' : ''}`}>
      <p className="eyebrow">Цветочный сад</p>
      <div className="flower-score">Собрано: <strong>{safeScore} / {TARGET}</strong></div>
      <p>Меняй местами соседние цветы и собирай ряды из трёх или больше одинаковых бутонов.</p>
      <p className="flower-message" aria-live="polite">{message}</p>
      <div className={`flower-board ${processing ? 'is-processing' : ''}`} role="grid" aria-label="Поле цветочного сада 6 на 6">
        {board.map((flower, index) => (
          <button
            key={index}
            className={`flower-cell ${selected === index ? 'is-selected' : ''} ${matched.has(index) ? 'is-matched' : ''} ${swapping.has(index) ? 'is-swapping' : ''}`}
            type="button"
            onClick={() => chooseCell(index)}
            aria-label={`Цветок ${flower}`}
            aria-selected={selected === index}
            disabled={processing || won}
          >
            <span>{flower}</span>
          </button>
        ))}
      </div>
      {won && <div className="bouquet glow" aria-hidden="true">💐</div>}
    </section>
  );
}
