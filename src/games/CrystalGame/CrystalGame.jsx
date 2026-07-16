import { useState } from 'react';

const solved = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const start = [1, 2, 5, 0, 4, 8, 3, 6, 7];

export function CrystalGame({ game, onComplete }) {
  const [pieces, setPieces] = useState(start);
  const [selected, setSelected] = useState(null);
  const [won, setWon] = useState(false);

  const choose = (index) => {
    if (won) return;
    if (selected === null) {
      setSelected(index);
      return;
    }
    if (selected === index) {
      setSelected(null);
      return;
    }

    const next = [...pieces];
    [next[selected], next[index]] = [next[index], next[selected]];
    setPieces(next);
    setSelected(null);

    if (next.every((piece, idx) => piece === solved[idx])) {
      setWon(true);
      window.setTimeout(() => onComplete(game.letter), 1000);
    }
  };

  return (
    <section className={`game-card crystal-game fade-up ${won ? 'is-won' : ''}`}>
      <div className="mini-instruction">Собери кристалл: выбери две части, чтобы поменять их местами.</div>
      <div className="crystal-board" role="grid" aria-label="Пазл кристалла 3 на 3">
        {pieces.map((piece, index) => (
          <button
            key={`${piece}-${index}`}
            className={`crystal-piece piece-${piece} ${selected === index ? 'is-selected' : ''}`}
            onClick={() => choose(index)}
            aria-label={`Часть кристалла ${piece + 1}`}
          />
        ))}
      </div>
      <div className="crystal-hint">{game.hint}</div>
      {won && <div className="magic-burst" aria-hidden="true">✦ ✨ ✦</div>}
    </section>
  );
}
