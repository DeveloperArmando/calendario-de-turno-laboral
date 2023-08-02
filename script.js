const createCalendar = ({ locate, year }) => {
  const weekDays = [...Array(7).keys()];
  const intlWeekDay = new Intl.DateTimeFormat(locate, { weekday: 'short' });
  const weeksDaysNames = weekDays.map((weekDayKey) =>
    // es un truco que necesita que se ejecute con esta fecha para que inicie con domingo
    intlWeekDay.format(new Date(2023, 9, weekDayKey + 1))
  );

  const monts = [...Array(12).keys()];
  const intl = new Intl.DateTimeFormat(locate, { month: 'long' });

  const dateAllDay = new Date(2023, 7, 2);
  const dateAllDayClear = new Date(
    dateAllDay.getFullYear(),
    dateAllDay.getMonth(),
    dateAllDay.getDate()
  );

  const calendar = monts.map((monthKey) => {
    const monthName = intl.format(new Date(year, monthKey));

    const nextMonthIndex = monthKey + 1;
    const daysOfMonth = new Date(year, nextMonthIndex, 0).getDate();

    const startsOn = new Date(year, monthKey, 1).getDay();

    return {
      monthName,
      daysOfMonth,
      startsOn,
      monthKey,
    };
  });

  const turns = ['🌞', '🌃', '🌄'];

  const html = calendar
    .map(({ monthName, daysOfMonth, startsOn, monthKey }) => {
      const title = `<h1>${monthName} ${year} </h1>`;
      const days = [...Array(daysOfMonth).keys()];
      const firstDayAttribute = `class='first-day' style='--first-day-start: ${
        startsOn + 1
      }'`;

      const renderedDays = days
        .map((day, index) => {
          day = day + 1;
          const dateCalendar = new Date(year, monthKey, day);
          const diff = dateCalendar - dateAllDayClear;
          const diffDys = diff / (1000 * 60 * 60 * 24);
          const moduleOf3 = Math.round(diffDys % 3);
          const turn =
            moduleOf3 < 0
              ? moduleOf3 === -1
                ? 2
                : moduleOf3 === -2
                ? 1
                : moduleOf3
              : moduleOf3;
          const selected = turns[turn];
          return `<li ${index === 0 ? firstDayAttribute : ''}>${
            day + (selected ? selected : '')
          }</li>`;
        })
        .join('');
      const renderedWeekDays = weeksDaysNames
        .map((weekDayName) => `<li class="day-name">${weekDayName}</li>`)
        .join('');
      return `<div class="month">${title} <ol> ${renderedWeekDays} ${renderedDays}</ol></div>`;
    })
    .join('');

  document.querySelector('div').innerHTML = html;

  const el = document.querySelector('div');
  const scrollToMothCurrent = window.innerHeight * new Date().getMonth();
  el.scrollTo({ top: scrollToMothCurrent, behavior: 'smooth' });
};

//let year = parseInt(yearLocalStorage);
let year = new Date().getFullYear();
const locate = 'es';

createCalendar({ locate, year });

document.getElementById('next').addEventListener('click', () => {
  year = year + 1;
  createCalendar({ locate, year });
});

document.getElementById('before').addEventListener('click', () => {
  year = year - 1;
  createCalendar({ locate, year });
});

// document.querySelector('button').addEventListener('click', () => {
//   year = year + 1;
//   createCalendar({ locate, year });
// });
