export const letters = {
  game1: 'К',
  game2: 'Ф',
  game3: 'Ш',
  game4: 'А',
};

export const games = [
  {
    id: 'game1',
    number: 1,
    path: '/game/1',
    title: 'Нити воспоминаний',
    subtitle: 'Первый ключ прячется там, где тонкие линии ведут к важным моментам.',
    component: 'ThreadsGame',
    letter: letters.game1,
  },
  {
    id: 'game2',
    number: 2,
    path: '/game/2',
    title: 'Твои любимые цветочки',
    subtitle: 'Второй ключ ждёт, пока лепестки соберутся в верный узор.',
    component: 'FlowerGame',
    letter: letters.game2,
  },
  {
    id: 'game3',
    number: 3,
    path: '/game/3',
    title: 'Кот в доме хозяин',
    cardTitle: 'Проводи котейку',
    subtitle: 'Третий ключ оставили мягкие лапы и внимательные глаза.',
    component: 'CatsGame',
    letter: letters.game3,
  },
  {
    id: 'game4',
    number: 4,
    path: '/game/4',
    title: 'Кристальная комната',
    subtitle: 'Четвёртый ключ сияет внутри кристалла.',
    hint: 'Подсказка: Ты сияешь ярче любого кристалла.',
    component: 'CrystalGame',
    letter: letters.game4,
  },
];

export const homeText = {
  dedication: 'С Днём Рождения, Медвежонок ❤️',
  title: 'Четыре ключа',
  subtitle: 'Сегодня тебя ждёт маленькое приключение.\nНо сначала надо найти отправную точку.\nСекрет хранят четыре ключа, собери их все.',
  action: 'Начать путешествие',
};

export const finalText = {
  title: 'Первый секрет открыт',
  subtitle: 'Все четыре ключа на месте. Теперь можно собрать кодовое слово и продолжить подарок.',
};
