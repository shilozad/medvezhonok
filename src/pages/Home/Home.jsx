import { Button } from '../../components/Button/Button';
import { games, homeText } from '../../data/texts';
import { getNextGame, getProgress, isQuestCompleted } from '../../progress';

const artifactKeys = [
  { id: 'threads', label: 'Ключ нитей', className: 'key-threads' },
  { id: 'flowers', label: 'Ключ цветов', className: 'key-flowers' },
  { id: 'cats', label: 'Ключ котиков', className: 'key-cats' },
  { id: 'crystal', label: 'Ключ кристалла', className: 'key-crystal' },
];

function KeySymbol({ id }) {
  if (id === 'threads') {
    return (
      <g className="artifact-symbol">
        <circle cx="34" cy="34" r="9" fill="none" />
        <path d="M27 33c5-7 14-7 14 1 0 7-11 10-15 3 6 2 16 0 15-7" />
        <path d="M29 39c3-9 12-14 18-7" />
      </g>
    );
  }

  if (id === 'flowers') {
    return (
      <g className="artifact-symbol">
        <circle cx="34" cy="34" r="3.5" />
        <path d="M34 21c4 4 4 8 0 11-4-3-4-7 0-11Z" />
        <path d="M34 47c-4-4-4-8 0-11 4 3 4 7 0 11Z" />
        <path d="M21 34c4-4 8-4 11 0-3 4-7 4-11 0Z" />
        <path d="M47 34c-4 4-8 4-11 0 3-4 7-4 11 0Z" />
      </g>
    );
  }

  if (id === 'cats') {
    return (
      <g className="artifact-symbol">
        <path d="M24 38V25l7 5 3-1 3 1 7-5v13c0 7-5 11-10 11s-10-4-10-11Z" />
        <path d="M30 38h.1M38 38h.1" />
        <path d="M32 43c1.2 1 2.8 1 4 0" />
      </g>
    );
  }

  return (
    <g className="artifact-symbol">
      <path d="M34 19 47 32 34 50 21 32 34 19Z" />
      <path d="M21 32h26M29 24l5 26 5-26" />
      <path d="M27 32 34 19l7 13" />
    </g>
  );
}

function ArtifactKey({ artifact, index }) {
  return (
    <div className={`artifact-key ${artifact.className}`} style={{ '--key-index': index }} aria-label={artifact.label}>
      <span className="key-particle particle-one" />
      <span className="key-particle particle-two" />
      <svg viewBox="0 0 78 142" role="img" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`${artifact.id}-shine`} x1="16" y1="12" x2="66" y2="126" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="rgba(255,255,255,0.92)" />
            <stop offset="0.45" stopColor="var(--key-main)" />
            <stop offset="1" stopColor="var(--key-deep)" />
          </linearGradient>
        </defs>
        <path className="artifact-aura" d="M39 7C23.5 7 11 19.5 11 35s12.5 28 28 28 28-12.5 28-28S54.5 7 39 7Zm0 13c8.3 0 15 6.7 15 15s-6.7 15-15 15-15-6.7-15-15 6.7-15 15-15Z" />
        <path className="artifact-body" d="M39 7C23.5 7 11 19.5 11 35s12.5 28 28 28 28-12.5 28-28S54.5 7 39 7Zm0 13c8.3 0 15 6.7 15 15s-6.7 15-15 15-15-6.7-15-15 6.7-15 15-15Zm-5 54h10v36h13v10h-9v9h-9v8h-5V74Z" />
        <path className="artifact-highlight" d="M22 35c0-9.4 7.6-17 17-17" />
        <KeySymbol id={artifact.id} />
      </svg>
    </div>
  );
}

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
      <div className="hero-divider" aria-hidden="true"><span /></div>
      <div className="artifact-keys" aria-label="Четыре магических ключа">
        {artifactKeys.map((artifact, index) => <ArtifactKey key={artifact.id} artifact={artifact} index={index} />)}
      </div>
      <h2 className="quest-title">✦ {homeText.title} ✦</h2>
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
