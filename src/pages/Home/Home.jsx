import { Button } from '../../components/Button/Button';
import { games, homeText } from '../../data/texts';
import { getNextGame, getProgress, isQuestCompleted } from '../../progress';

export function Home({ navigate }) {
  const progress = getProgress();
  const nextGame = getNextGame(progress);
  const completed = isQuestCompleted(progress);

  const start = () => {
    if (completed) {
      navigate('/final');
      return;
    }
    navigate(nextGame?.path || games[0].path);
  };

  return (
    <section className="hero page-card fade-up">
      <h1 className="hero-title">{homeText.dedication}</h1>
      <h2>{homeText.title}</h2>
      <p className="hero-subtitle">{homeText.subtitle}</p>
      <div className="keys-row" aria-label="Прогресс ключей">
        {games.map((game) => (
          <span key={game.id} className={`key-chip ${progress[game.id] ? 'is-open' : ''}`}>
            {progress[`letter${game.number}`] || (progress[game.id] === true ? game.letter : progress[game.id]) || '✦'}
          </span>
        ))}
      </div>
      <Button onClick={start}>{completed ? 'Посмотреть секрет' : homeText.action}</Button>
    </section>
  );
}
