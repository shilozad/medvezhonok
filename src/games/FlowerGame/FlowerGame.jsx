import { useMemo, useState } from 'react';

const FLOWERS = ['🌹', '🌷', '🌼', '🌺'];
const SIZE = 6;
const TARGET = 24;
const WIN_DELAY = 900;

const createBoard = () => Array.from({ length: SIZE * SIZE }, (_, index) => FLOWERS[(index + Math.floor(index / SIZE)) % FLOWERS.length]);
const randomFlower = () => FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
const indexOf = (row, col) => row * SIZE + col;
const areNeighbors = (a, b) => Math.abs(Math.floor(a / SIZE) - Math.floor(b / SIZE)) + Math.abs((a % SIZE) - (b % SIZE)) === 1;

function findMatches(board) {
  const matches = new Set();
  for (let row = 0; row < SIZE; row += 1) {
    let streak = [indexOf(row, 0)];
    for (let col = 1; col < SIZE; col += 1) {
      const current = indexOf(row, col);
      const previous = indexOf(row, col - 1);
      if (board[current] === board[previous]) streak.push(current);
      else {
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
      if (board[current] === board[previous]) streak.push(current);
      else {
        if (streak.length >= 3) streak.forEach((item) => matches.add(item));
        streak = [current];
      }
    }
    if (streak.length >= 3) streak.forEach((item) => matches.add(item));
  }
  return matches;
}

function refill(board, matches) {
  return board.map((flower, index) => (matches.has(index) ? randomFlower() : flower));
}

export function FlowerGame({ game, onComplete }) {
  const [board, setBoard] = useState(createBoard);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [matched, setMatched] = useState(new Set());
  const [won, setWon] = useState(false);
  const remaining = useMemo(() => TARGET - score, [score]);

  const complete = () => {
    setWon(true);
    window.setTimeout(() => onComplete(game.letter, {
      title: 'Второй ключ найден',
      text: 'Красивый букет собирается из маленьких деталей.\nЕщё один шаг сделан.',
    }), WIN_DELAY);
  };

  const chooseCell = (index) => {
    if (won) return;
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
      return;
    }

    const swapped = [...board];
    [swapped[selected], swapped[index]] = [swapped[index], swapped[selected]];
    const matches = findMatches(swapped);

    if (matches.size === 0) {
      setSelected(index);
      return;
    }

    const points = Math.min(matches.size, remaining);
    const nextScore = score + points;
    setBoard(swapped);
    setMatched(matches);
    setSelected(null);

    window.setTimeout(() => {
      setBoard(refill(swapped, matches));
      setMatched(new Set());
      setScore(nextScore);
      if (nextScore === TARGET) complete();
    }, 360);
  };

  return (
    <section className={`game-card flower-game ${won ? 'is-won' : ''}`}>
      <p className="eyebrow">Цветочный сад</p>
      <div className="flower-score">Собрано: <strong>{score} / {TARGET}</strong></div>
      <p>Меняй местами соседние цветы и собирай ряды из трёх или больше одинаковых бутонов.</p>
      <div className="flower-board" role="grid" aria-label="Поле цветочного сада 6 на 6">
        {board.map((flower, index) => (
          <button
            key={`${flower}-${index}`}
            className={`flower-cell ${selected === index ? 'is-selected' : ''} ${matched.has(index) ? 'is-matched' : ''}`}
            type="button"
            onClick={() => chooseCell(index)}
            aria-label={`Цветок ${flower}`}
          >
            {flower}
          </button>
        ))}
      </div>
      {won && <div className="bouquet glow" aria-hidden="true">💐</div>}
      {won && <div className="petals" aria-hidden="true">{Array.from({ length: 20 }).map((_, index) => <span key={index} style={{ '--i': index }}>❧</span>)}</div>}
    </section>
  );
}
