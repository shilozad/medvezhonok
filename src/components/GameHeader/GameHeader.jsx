export function GameHeader({ game, completed }) {
  return (
    <header className="game-header fade-up">
      <p className="eyebrow">Испытание {game.number} из 4</p>
      <h1>{game.title}</h1>
      <p>{game.subtitle}</p>
      {completed && <div className="letter-badge glow">Ключ найден: {game.letter}</div>}
    </header>
  );
}
