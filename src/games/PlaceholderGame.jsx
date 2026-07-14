import { Button } from '../components/Button/Button';

export function PlaceholderGame({ game, onComplete }) {
  return (
    <section className="game-card fade-up">
      <div className="keyhole glow" aria-hidden="true">✦</div>
      <h2>Мини-игра появится здесь</h2>
      <p>
        Каркас готов: на следующем этапе это испытание получит собственную механику,
        а пока можно проверить маршрут и сохранение прогресса.
      </p>
      <Button onClick={() => onComplete(game.letter)}>Открыть ключ «{game.letter}»</Button>
    </section>
  );
}
