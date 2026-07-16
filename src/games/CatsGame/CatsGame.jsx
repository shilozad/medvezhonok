import { useMemo, useState } from 'react';

const cats = {
  white: { icon: '🤍', cat: '🐱', home: '🏠', name: 'Белый котик' },
  ginger: { icon: '🧡', cat: '🐈', home: '🏡', name: 'Рыжий котик' },
  gray: { icon: '🩶', cat: '😺', home: '🏘️', name: 'Серый котик' },
};

const homes = {
  white: 3,
  ginger: 12,
  gray: 15,
};

const initialCats = {
  white: 0,
  ginger: 5,
  gray: 10,
};

function neighbors(a, b) {
  const ax = a % 4;
  const ay = Math.floor(a / 4);
  const bx = b % 4;
  const by = Math.floor(b / 4);
  return Math.abs(ax - bx) + Math.abs(ay - by) === 1;
}

export function CatsGame({ game, onComplete }) {
  const [positions, setPositions] = useState(initialCats);
  const [selected, setSelected] = useState('white');
  const [won, setWon] = useState(false);

  const occupied = useMemo(() => new Map(Object.entries(positions).map(([color, cell]) => [cell, color])), [positions]);
  const allHome = Object.entries(homes).every(([color, cell]) => positions[color] === cell);

  const moveTo = (cell) => {
    if (won) return;
    const catOnCell = occupied.get(cell);
    if (catOnCell) {
      setSelected(catOnCell);
      return;
    }
    if (!neighbors(positions[selected], cell)) return;

    const next = { ...positions, [selected]: cell };
    setPositions(next);
    if (Object.entries(homes).every(([color, home]) => next[color] === home)) {
      setWon(true);
      window.setTimeout(() => onComplete(game.letter), 900);
    }
  };

  return (
    <section className={`game-card cats-game fade-up ${won || allHome ? 'is-won' : ''}`}>
      <h2>{game.cardTitle}</h2>
      <div className="mini-instruction">Выбери котика и тапай по соседней клетке, чтобы довести каждого к своему домику.</div>
      <div className="cats-board" role="grid" aria-label="Поле 4 на 4 для котиков">
        {Array.from({ length: 16 }).map((_, cell) => {
          const catColor = occupied.get(cell);
          const homeColor = Object.keys(homes).find((color) => homes[color] === cell);
          return (
            <button
              key={cell}
              className={`puzzle-cell cat-cell ${catColor ? `cat-${catColor}` : ''} ${homeColor ? `home-${homeColor}` : ''} ${selected === catColor ? 'is-selected' : ''}`}
              onClick={() => moveTo(cell)}
              aria-label={catColor ? cats[catColor].name : homeColor ? `Домик: ${cats[homeColor].name}` : 'Пустая клетка'}
            >
              {homeColor && <span className="home-mark">{cats[homeColor].home}</span>}
              {catColor && <span className="cat-mark">{cats[catColor].cat}</span>}
              {homeColor && <span className="color-dot">{cats[homeColor].icon}</span>}
            </button>
          );
        })}
      </div>
      <div className="cat-legend">
        {Object.keys(cats).map((color) => <button key={color} className={`legend-pill ${selected === color ? 'is-selected' : ''}`} onClick={() => setSelected(color)}>{cats[color].cat} → {cats[color].home}</button>)}
      </div>
      {(won || allHome) && <div className="hearts" aria-hidden="true"><span>💛</span><span>💜</span><span>💛</span></div>}
    </section>
  );
}
