import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const THREADS = [
  { id: 'amethyst', color: '#bfaee0', start: { x: 14, y: 18 }, end: { x: 86, y: 82 } },
  { id: 'gold', color: '#d2b874', start: { x: 86, y: 18 }, end: { x: 14, y: 82 } },
  { id: 'emerald', color: '#75b9a4', start: { x: 12, y: 50 }, end: { x: 88, y: 50 } },
  { id: 'rose', color: '#d98cae', start: { x: 28, y: 86 }, end: { x: 74, y: 14 } },
  { id: 'violet', color: '#9d82bf', start: { x: 72, y: 88 }, end: { x: 26, y: 12 } },
  { id: 'sky', color: '#96d3cf', start: { x: 50, y: 10 }, end: { x: 50, y: 90 } },
];

const WIN_DELAY = 900;
const VIEWBOX_SIZE = 100;
const HANDLE_RADIUS = 2.4;

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

function clampPoint(point) {
  return {
    x: Math.max(HANDLE_RADIUS, Math.min(VIEWBOX_SIZE - HANDLE_RADIUS, point.x)),
    y: Math.max(HANDLE_RADIUS, Math.min(VIEWBOX_SIZE - HANDLE_RADIUS, point.y)),
  };
}

function pointerToViewBoxPoint(event, rect) {
  const scaleX = VIEWBOX_SIZE / rect.width;
  const scaleY = VIEWBOX_SIZE / rect.height;

  return clampPoint({
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  });
}

export function ThreadsGame({ game, onComplete }) {
  const [threads, setThreads] = useState(THREADS);
  const [dragging, setDragging] = useState(false);
  const [won, setWon] = useState(false);
  const boardRef = useRef(null);
  const threadsRef = useRef(THREADS);
  const activePointerIdRef = useRef(null);
  const activeHandleRef = useRef(null);
  const captureTargetRef = useRef(null);
  const latestPointRef = useRef(null);
  const animationFrameRef = useRef(null);
  const boardRectRef = useRef(null);
  const completedRef = useRef(false);
  const crossings = useMemo(() => hasCrossings(threads), [threads]);

  const updateBoardRect = useCallback(() => {
    if (boardRef.current) {
      boardRectRef.current = boardRef.current.getBoundingClientRect();
    }
  }, []);

  const applyLatestPoint = useCallback(() => {
    animationFrameRef.current = null;
    const activeHandle = activeHandleRef.current;
    const latestPoint = latestPointRef.current;

    if (!activeHandle || !latestPoint) return threadsRef.current;

    const nextThreads = threadsRef.current.map((thread) => (
      thread.id === activeHandle.id ? { ...thread, [activeHandle.end]: latestPoint } : thread
    ));

    threadsRef.current = nextThreads;
    setThreads(nextThreads);
    return nextThreads;
  }, []);

  const schedulePointUpdate = useCallback(() => {
    if (animationFrameRef.current !== null) return;
    animationFrameRef.current = window.requestAnimationFrame(applyLatestPoint);
  }, [applyLatestPoint]);

  const completeIfSolved = useCallback((currentThreads) => {
    if (!hasCrossings(currentThreads) && !completedRef.current) {
      completedRef.current = true;
      setWon(true);
      window.setTimeout(() => onComplete(game.letter, {
        title: 'Первый ключ найден',
        text: 'Одна маленькая загадка разгадана.\nНо впереди ещё три испытания.',
      }), WIN_DELAY);
    }
  }, [game.letter, onComplete]);

  const startDrag = useCallback((event, id, end) => {
    if (won || activePointerIdRef.current !== null) return;

    event.preventDefault();
    updateBoardRect();
    activePointerIdRef.current = event.pointerId;
    activeHandleRef.current = { id, end };
    captureTargetRef.current = event.currentTarget;
    latestPointRef.current = pointerToViewBoxPoint(event, boardRectRef.current);
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    schedulePointUpdate();
  }, [schedulePointUpdate, updateBoardRect, won]);

  const moveEnd = useCallback((event) => {
    if (event.pointerId !== activePointerIdRef.current || !activeHandleRef.current || won) return;

    event.preventDefault();
    latestPointRef.current = pointerToViewBoxPoint(event, boardRectRef.current);
    schedulePointUpdate();
  }, [schedulePointUpdate, won]);

  const finishDrag = useCallback((event) => {
    if (event && event.pointerId !== activePointerIdRef.current) return;

    event?.preventDefault();

    const pointerId = activePointerIdRef.current;
    const captureTarget = captureTargetRef.current;

    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const currentThreads = applyLatestPoint();

    if (captureTarget && pointerId !== null && captureTarget.hasPointerCapture(pointerId)) {
      captureTarget.releasePointerCapture(pointerId);
    }

    activePointerIdRef.current = null;
    activeHandleRef.current = null;
    captureTargetRef.current = null;
    latestPointRef.current = null;
    setDragging(false);
    completeIfSolved(currentThreads);
  }, [applyLatestPoint, completeIfSolved]);

  useEffect(() => {
    updateBoardRect();

    const resizeObserver = new ResizeObserver(updateBoardRect);
    if (boardRef.current) resizeObserver.observe(boardRef.current);

    return () => {
      resizeObserver.disconnect();
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateBoardRect]);

  return (
    <section className={`game-card threads-game ${won ? 'is-won' : ''} ${dragging ? 'is-dragging' : ''}`}>
      <p className="eyebrow">Запутанные нити</p>
      <p>Перетащи круглые концы нитей так, чтобы цветные линии больше не пересекались.</p>
      <div className="threads-status">{crossings ? 'Нити ещё запутаны' : 'Все нити свободны ✨'}</div>
      <svg
        ref={boardRef}
        className="threads-board"
        viewBox="0 0 100 100"
        role="img"
        aria-label="Игровое поле с цветными нитями"
        onPointerMove={moveEnd}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
      >
        {threads.map((thread) => (
          <g key={thread.id} className="thread-line" style={{ '--thread': thread.color }}>
            <line className="thread-strand" x1={thread.start.x} y1={thread.start.y} x2={thread.end.x} y2={thread.end.y} />
            <line className="thread-highlight" x1={thread.start.x} y1={thread.start.y} x2={thread.end.x} y2={thread.end.y} />
          </g>
        ))}
        {threads.flatMap((thread) => ['start', 'end'].map((end) => (
          <g
            key={`${thread.id}-${end}`}
            className="thread-handle"
            style={{ '--handle-color': thread.color }}
            transform={`translate(${thread[end].x} ${thread[end].y})`}
            onPointerDown={(event) => startDrag(event, thread.id, end)}
          >
            <circle className="thread-hit-area" r="6" />
            <circle className="thread-dot" r={HANDLE_RADIUS} />
          </g>
        )))}
      </svg>
      {won && <div className="celebration-particles" aria-hidden="true">{Array.from({ length: 18 }).map((_, index) => <span key={index} style={{ '--i': index }} />)}</div>}
    </section>
  );
}
