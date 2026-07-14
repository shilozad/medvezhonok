import { games } from './data/texts';

const STORAGE_KEY = 'fourKeysProgress';

export function getProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return typeof saved === 'object' && saved !== null ? saved : {};
  } catch {
    return {};
  }
}

export function saveLetter(gameId, letter) {
  const gameNumber = gameId.replace('game', '');
  const nextProgress = {
    ...getProgress(),
    [gameId]: true,
    [`letter${gameNumber}`]: letter,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProgress));
  window.dispatchEvent(new CustomEvent('quest-progress-change'));
  return nextProgress;
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('quest-progress-change'));
}

export function isGameCompleted(gameId, progress = getProgress()) {
  return Boolean(progress[gameId] || progress[`letter${gameId.replace('game', '')}`]);
}

export function getCompletedLetters(progress = getProgress()) {
  return games.map((game) => progress[`letter${game.number}`] || (progress[game.id] === true ? game.letter : progress[game.id])).filter(Boolean);
}

export function isQuestCompleted(progress = getProgress()) {
  return games.every((game) => (progress[`letter${game.number}`] || (progress[game.id] === true ? game.letter : progress[game.id])) === game.letter);
}

export function getNextGame(progress = getProgress()) {
  return games.find((game) => !isGameCompleted(game.id, progress)) || null;
}
