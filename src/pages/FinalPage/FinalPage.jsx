import { useState } from 'react';
import { Button } from '../../components/Button/Button';
import { finalText, games } from '../../data/texts';
import { getCompletedLetters, getProgress, isQuestCompleted, resetProgress } from '../../progress';

const SECRET_WORD = 'ШКАФ';

export function FinalPage({ navigate }) {
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [opened, setOpened] = useState(false);
  const progress = getProgress();
  const completed = isQuestCompleted(progress);
  const letters = games.map((game) => progress[`letter${game.number}`] || (progress[game.id] === true ? game.letter : progress[game.id]) || '•');

  const restart = () => {
    resetProgress();
    navigate('/');
  };

  const checkWord = (event) => {
    event.preventDefault();
    if (answer.trim().toUpperCase() === SECRET_WORD) {
      setOpened(true);
      setMessage('');
      return;
    }
    setMessage('Кажется, ключи пока не открывают замок.\nПопробуй ещё раз.');
  };

  if (!completed) {
    return (
      <section className="final page-card fade-up">
        <p className="eyebrow">Финал</p>
        <h1>Не все ключи найдены</h1>
        <p>Вернись к испытаниям и собери недостающие буквы.</p>
        <div className="code-word glow" aria-label="Найденные буквы">{getCompletedLetters(progress).join(' ') || '✦'}</div>
        <div className="actions-row">
          <Button onClick={() => navigate(games.find((game) => !progress[game.id])?.path || '/')}>Продолжить квест</Button>
          <Button variant="ghost" onClick={restart}>Начать заново</Button>
        </div>
      </section>
    );
  }

  if (opened) {
    return (
      <section className="final page-card fade-up secret-opened">
        <p className="eyebrow">✨ Секрет открыт ✨</p>
        <h1>{finalText.title}</h1>
        <p>Ты собрала все ключи и разгадала первую загадку.</p>
        <p>Но настоящее приключение только начинается.</p>
        <div className="magic-burst" aria-hidden="true">✦ ✨ ✦</div>
        <Button variant="ghost" onClick={restart}>Начать заново</Button>
      </section>
    );
  }

  return (
    <section className="final page-card fade-up">
      <p className="eyebrow">Финал</p>
      <h1>Последний секрет</h1>
      <p>Ты собрала все ключи.<br />Но они перепутались.<br />Собери из них правильное слово.</p>
      <div className="found-letters" aria-label="Найденные буквы">{letters.map((letter, index) => <span key={index}>{letter}</span>)}</div>
      <form className="secret-form" onSubmit={checkWord}>
        <label htmlFor="secret-word">Введите кодовое слово</label>
        <input id="secret-word" value={answer} onChange={(event) => setAnswer(event.target.value)} autoComplete="off" />
        {message && <p className="error-text">{message}</p>}
        <div className="actions-row">
          <Button type="submit">Открыть секрет</Button>
          <Button type="button" variant="ghost" onClick={restart}>Начать заново</Button>
        </div>
      </form>
    </section>
  );
}
