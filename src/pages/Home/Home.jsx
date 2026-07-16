import { Button } from '../../components/Button/Button';
import { games, homeText } from '../../data/texts';
import { getNextGame, getProgress, isQuestCompleted } from '../../progress';

const artifactKeys = [
  { id: 'threads', label: 'Ключ нитей', className: 'key-threads' },
  { id: 'flowers', label: 'Ключ цветов', className: 'key-flowers' },
  { id: 'cats', label: 'Ключ котиков', className: 'key-cats' },
  { id: 'crystal', label: 'Ключ кристалла', className: 'key-crystal' },
];

function HeroTitle({ text }) {
  const [greeting, nameLine] = text.split('\n');
  const name = nameLine.replace('❤️', '').trim();

  return (
    <h1 className="hero-title">
      <span>{greeting}</span>
      <span className="hero-title-line">
        {name} <span className="hero-heart" aria-hidden="true">❤️</span>
      </span>
    </h1>
  );
}

function KeySymbol({ id }) {
  if (id === 'threads') {
    return (
      <g className="artifact-symbol">
        <circle cx="39" cy="32" r="8" fill="none" />
        <path d="M31 32c5-7 15-7 15 1 0 7-12 10-16 3 6 2 17 0 16-7" />
        <path d="M33 38c3-9 12-14 19-7" />
      </g>
    );
  }

  if (id === 'flowers') {
    return (
      <g className="artifact-symbol">
        <circle cx="39" cy="32" r="3.5" />
        <path d="M39 18c4 4 4 8 0 11-4-3-4-7 0-11Z" />
        <path d="M39 46c-4-4-4-8 0-11 4 3 4 7 0 11Z" />
        <path d="M25 32c4-4 8-4 11 0-3 4-7 4-11 0Z" />
        <path d="M53 32c-4 4-8 4-11 0 3-4 7-4 11 0Z" />
      </g>
    );
  }

  if (id === 'cats') {
    return (
      <g className="artifact-symbol">
        <path d="M29 37V24l7 5 3-1 3 1 7-5v13c0 7-5 11-10 11s-10-4-10-11Z" />
        <path d="M35 37h.1M43 37h.1" />
        <path d="M37 42c1.2 1 2.8 1 4 0" />
      </g>
    );
  }

  return (
    <g className="artifact-symbol">
      <path d="M39 17 52 31 39 50 26 31 39 17Z" />
      <path d="M26 31h26M34 23l5 27 5-27" />
      <path d="M32 31 39 17l7 14" />
    </g>
  );
}

function ArtifactKey({ artifact, index }) {
  return (
    <div className={`artifact-key ${artifact.className}`} style={{ '--key-index': index }} aria-label={artifact.label}>
      <span className="key-particle particle-one" />
      <span className="key-particle particle-two" />
      <svg viewBox="0 0 78 166" role="img" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`${artifact.id}-shine`} x1="16" y1="12" x2="64" y2="150" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="rgba(255,255,255,0.92)" />
            <stop offset="0.45" stopColor="var(--key-main)" />
            <stop offset="1" stopColor="var(--key-deep)" />
          </linearGradient>
        </defs>
        <path className="artifact-aura" d="M39 5C23 5 11 17 11 32c0 11 6.4 20.7 16.1 25.3L31 61h16l3.9-3.7C60.6 52.7 67 43 67 32 67 17 55 5 39 5Zm0 13c8.2 0 14.6 6.1 14.6 14S47.2 46 39 46s-14.6-6.1-14.6-14S30.8 18 39 18Z" />
        <path className="artifact-body" d="M39 5C23 5 11 17 11 32c0 11 6.4 20.7 16.1 25.3L31 61h16l3.9-3.7C60.6 52.7 67 43 67 32 67 17 55 5 39 5Zm0 13c8.2 0 14.6 6.1 14.6 14S47.2 46 39 46s-14.6-6.1-14.6-14S30.8 18 39 18Zm-4 62h8v58h12v9h-8v8h-8v7h-4V80Zm-7-12h22v12H28V68Z" />
        <path className="artifact-filigree" d="M20 31c0-10.7 8.4-19.2 19-19.2S58 20.3 58 31M30 59c4.8 2.3 13.2 2.3 18 0" />
        <path className="artifact-highlight" d="M23 31c0-8.9 7.1-16 16-16" />
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
      <HeroTitle text={homeText.dedication} />
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
