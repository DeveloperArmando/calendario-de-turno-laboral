// Constantes
const DAYS_IN_WEEK = 7;
const MONTHS_IN_YEAR = 12;
const TURNS = {
  SALIDA: 'sale',
  FRANCO: 'franco',
  ENTRADA: 'entra',
};

class Calendar {
  constructor(container) {
    this.container = container;
    this.year = new Date().getFullYear();
    this.locale = navigator.language;
    this.dateFormats = this.initializeDateFormats();
    this.bindEvents();
  }

  initializeDateFormats() {
    return {
      weekday: new Intl.DateTimeFormat(this.locale, { weekday: 'short' }),
      month: new Intl.DateTimeFormat(this.locale, { month: 'long' })
    };
  }

  bindEvents() {
    document.getElementById('next')?.addEventListener('click', () => {
      this.year++;
      this.render();
    });

    document.getElementById('before')?.addEventListener('click', () => {
      this.year--;
      this.render();
    });
  }

  getWeekDayNames() {
    return Array.from({ length: DAYS_IN_WEEK }, (_, i) => 
      this.dateFormats.weekday.format(new Date(2023, 9, i + 1))
    );
  }

  calculateTurn(date, referenceDate) {
    const diffDays = Math.round((date - referenceDate) / (1000 * 60 * 60 * 24));
    const moduleOf3 = diffDays % 3;
    return moduleOf3 < 0 
      ? moduleOf3 === -1 ? 2 : moduleOf3 === -2 ? 1 : 0 
      : moduleOf3;
  }

  createMonthData(monthIndex) {
    const monthDate = new Date(this.year, monthIndex, 1);
    return {
      monthName: this.dateFormats.month.format(monthDate),
      daysInMonth: new Date(this.year, monthIndex + 1, 0).getDate(),
      startsOn: monthDate.getDay(),
      monthIndex
    };
  }

  createDayElement(day, monthIndex, startsOn, isFirstDay, referenceDate) {
    const date = new Date(this.year, monthIndex, day);
    const turn = TURNS[Object.keys(TURNS)[this.calculateTurn(date, referenceDate)]];
    const isToday = new Date().toDateString() === date.toDateString();
    
    const classes = [
      turn,
      isFirstDay ? 'first-day' : ''
    ].filter(Boolean);

    const style = isFirstDay ? `style="--first-day-start: ${startsOn + 1}"` : '';
    
    return `
      <li class="${classes.join(' ')}" ${style}>
        <span class=${isToday ? 'today' : ''}>${day}</span>
      </li>
    `;
  }

  createMonthHTML(monthData, weekDayNames, referenceDate) {
    const { monthName, daysInMonth, startsOn, monthIndex } = monthData;
    
    const daysHTML = Array.from({ length: daysInMonth }, (_, i) => 
      this.createDayElement(i + 1, monthIndex, startsOn, i === 0, referenceDate)
    ).join('');

    const weekDaysHTML = weekDayNames
      .map(name => `<li class="day-name">${name}</li>`)
      .join('');

    return `
      <div class="month">
        <h1>${monthName} ${this.year}</h1>
        <ol>${weekDaysHTML}${daysHTML}</ol>
      </div>
    `;
  }

  scrollToCurrentMonth() {
    const currentMonthOffset = window.innerHeight * new Date().getMonth();
    this.container.scrollTo({ 
      top: currentMonthOffset, 
      behavior: 'smooth' 
    });
  }

  render() {
    const referenceDate = new Date(2023, 7, 2);
    referenceDate.setHours(0, 0, 0, 0);

    const weekDayNames = this.getWeekDayNames();
    const monthsHTML = Array.from({ length: MONTHS_IN_YEAR }, (_, i) => 
      this.createMonthHTML(this.createMonthData(i), weekDayNames, referenceDate)
    ).join('');

    this.container.innerHTML = monthsHTML;
    this.scrollToCurrentMonth();
  }
}

// Inicialización
const calendarContainer = document.querySelector('div');
if (calendarContainer) {
  const calendar = new Calendar(calendarContainer);
  calendar.render();
}