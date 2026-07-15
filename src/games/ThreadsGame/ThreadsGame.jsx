import { useMemo, useRef, useState } from 'react';

const THREADS = [
  { id: 'amethyst', color: '#c8b6e8', start: { x: 14, y: 18 }, end: { x: 86, y: 82 } },
  { id: 'gold', color: '#d8b46a', start: { x: 86, y: 18 }, end: { x: 14, y: 82 } },
  { id: 'emerald', color: '#4fa58a', start: { x: 12, y: 50 }, end: { x: 88, y: 50 } },
  { id: 'rose', color: '#e879a4', start: { x: 28, y: 86 }, end: { x: 74, y: 14 } },
  { id: 'violet', color: '#8e6bae', start: { x: 72, y: 88 }, end: { x: 26, y: 12 } },
  { id: 'sky', color: '#88d7d1', start: { x: 50, y: 10 }, end: { x: 50, y: 90 } },
];

const WIN_DELAY = 900;

function orientation(a, b, c) {
  return Math.sign((b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y));
}

function samePoint(a, b) {
  return Math.abs(a.x - b.x) < 0.001 && Math.abs(a.y - b.y) < 0.001;
}

function onSegment(a, b, c) {
  return b.x <= Math.max(a.x, c.x) && b.x >= Math.min(a.x, c.x)
    && b.y <= Math.max(a.y, c.y) && b.y >= Math.min(a.y, c.y);
}

function intersects(first, second) {
  const a = first.start;
  const b = first.end;
  const c = second.start;
  const d = second.end;

  if ([a, b].some((point) => samePoint(point, c) || samePoint(point, d))) return false;

  const o1 = orientation(a, b, c);
  const o2 = orientation(a, b, d);
  const o3 = orientation(c, d, a);
  const o4 = orientation(c, d, b);

  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && onSegment(a, c, b)) return true;
  if (o2 === 0 && onSegment(a, d, b)) return true;
  if (o3 === 0 && onSegment(c, a, d)) return true;
  return o4 === 0 && onSegment(c, b, d);
}

function hasCrossings(threads) {
  for (let i = 0; i < threads.length; i += 1) {
    for (let j = i + 1; j < threads.length; j += 1) {
      if (intersects(threads[i], threads[j])) return true;
    }
  }
  return false;
}

function pointerToPercent(event, element) {
  const rect = element.getBoundingClientRect();
  return {
    x: Math.max(7, Math.min(93, ((event.clientX - rect.left) / rect.width) * 100)),
    y: Math.max(7, Math.min(93, ((event.clientY - rect.top) / rect.height) * 100)),
  };
}

export function ThreadsGame({ game, onComplete }) {
  const [threads, setThreads] = useState(THREADS);
  const [dragging, setDragging] = useState(null);
  const [won, setWon] = useState(false);
  const completedRef = useRef(false);
  const crossings = useMemo(() => hasCrossings(threads), [threads]);

  const moveEnd = (event) => {
    if (!dragging || won) return;
    event.preventDefault();
    const point = pointerToPercent(event, event.currentTarget);
    setThreads((current) => current.map((thread) => (
      thread.id === dragging.id ? { ...thread, [dragging.end]: point } : thread
    )));
  };

  const finishDrag = (event) => {
    event?.preventDefault();
    setDragging(null);
    setThreads((current) => {
      if (!hasCrossings(current) && !completedRef.current) {
        completedRef.current = true;
        setWon(true);
        window.setTimeout(() => onComplete(game.letter, {
          title: 'Первый ключ найден',
          text: 'Одна маленькая загадка разгадана.\nНо впереди ещё три испытания.',
        }), WIN_DELAY);
      }
      return current;
    });
  };

  return (
    <section className={`game-card threads-game ${won ? 'is-won' : ''}`}>
      <p className="eyebrow">Запутанные нити</p>
      <p>Перетащи круглые концы нитей так, чтобы цветные линии больше не пересекались.</p>
      <div className="threads-status">{crossings ? 'Нити ещё запутаны' : 'Все нити свободны ✨'}</div>
      <svg
        className="threads-board"
        viewBox="0 0 100 100"
        role="img"
        aria-label="Игровое поле с цветными нитями"
        onPointerMove={moveEnd}
        onPointerUp={finishDrag}
        onPointerLeave={finishDrag}
        onPointerCancel={finishDrag}
      >
        <defs>
          <filter id="threadGlow"><feGaussianBlur stdDeviation="1.2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {threads.map((thread) => (
          <g key={thread.id} className="thread-line" style={{ '--thread': thread.color }}>
            <line x1={thread.start.x} y1={thread.start.y} x2={thread.end.x} y2={thread.end.y} />
          </g>
        ))}
        {threads.flatMap((thread) => ['start', 'end'].map((end) => (
          <circle
            key={`${thread.id}-${end}`}
            className="thread-handle"
            cx={thread[end].x}
            cy={thread[end].y}
            r="5.8"
            fill={thread.color}
            onPointerDown={(event) => {
              if (won) return;
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              setDragging({ id: thread.id, end });
            }}
          />
        )))}
      </svg>
      {won && <div className="celebration-particles" aria-hidden="true">{Array.from({ length: 18 }).map((_, index) => <span key={index} style={{ '--i': index }} />)}</div>}
    </section>
  );
}
