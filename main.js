// const scheduleData = [
//     { day: "Пн", time: "09:00 - 11:00", className: "ТЕСТ2", instructor: "Фамилия2 Имя2" },
//     { day: "Пн", time: "10:00 - 11:00", className: "ТЕСТ", instructor: "Фамилия Имя" },
//     { day: "Ср", time: "10:00 - 11:00", className: "Йога", instructor: "Муратова Любовь" },
//     { day: "Ср", time: "11:00 - 12:00", className: "Йога", instructor: "Муратова Любовь" },
//     { day: "Чт", time: "11:00 - 12:00", className: "Зумба", instructor: "Петров Иван" },
//     { day: "Пт", time: "12:00 - 13:00", className: "Кроссфит", instructor: "Смирнов Алексей" },
//     { day: "Сб", time: "13:00 - 14:00", className: "Силовой тренинг", instructor: "Кузнецова Ольга" },
//     { day: "Вс", time: "14:00 - 15:00", className: "Танцы", instructor: "Иванова Анна" },
//     { day: "Пн", time: "15:00 - 16:00", className: "Функциональная тренировка", instructor: "Фёдоров Сергей" },
//     { day: "Вт", time: "16:00 - 17:00", className: "Кикбоксинг", instructor: "Медведева Мария" },
//     { day: "Ср", time: "17:00 - 18:00", className: "Бег", instructor: "Васильев Игорь" },
//     { day: "Чт", time: "18:00 - 19:00", className: "Пилатес", instructor: "Гончарова Елена" },
//     { day: "Пт", time: "19:00 - 20:00", className: "Тай-бо", instructor: "Михайлов Дмитрий" },
//     { day: "Пн", time: "08:00 - 11:00", className: "ТЕСТ2", instructor: "Фамилия2 Имя2" },
// ];

const events = [
    { time: "08:30 - 19:00", day: "Пн", className: "ТЕСТ2", instructor: "Фамилия2 Имя2" },
    { time: "15:00 - 16:00", day: "Вт", className: "ТЕСТ", instructor: "Фамилия Имя" },
    { time: "11:30 - 16:00", day: "Чт", className: "ТЕСТ", instructor: "Фамилия Имя" },
    { time: "11:30 - 16:00", day: "Чт", className: "ТЕСТ", instructor: "Фамилия Имя" },
    { time: "09:00 - 12:00", day: "Вс", className: "ТЕСТ", instructor: "Фамилия Имя" },
    { time: "11:00 - 14:00", day: "Вт", className: "Длинное название", instructor: "Фамилия Имя" },
    // Добавьте остальные события
];

// Функция для создания временного интервала
function createTimeIntervals() {
    const timeContainer = document.querySelector(".l-times-block");
    if (!timeContainer) return;
    let startTime = new Date("1970-01-01T08:00:00");
    let endTime = new Date("1970-01-01T22:00:00");

    // Шаг времени в минутах (30 минут)
    let step = 30;

    // Пока текущее время меньше конечного времени
    while (startTime <= endTime) {
        let timeString = startTime.toTimeString().substring(0, 5); // Преобразуем время в строку "HH:MM"

        // Создаем новый div для текущего времени
        const timeDiv = document.createElement("div");
        timeDiv.setAttribute("data-time", timeString);
        timeDiv.classList.add("l-time");
        timeDiv.textContent = timeString;

        // Добавляем div в контейнер
        timeContainer.appendChild(timeDiv);

        // Увеличиваем текущее время на 30 минут
        startTime.setMinutes(startTime.getMinutes() + step);
    }
}

// Вызов функции для отображения интервалов
createTimeIntervals();

function parseTime(timeStr) {
    const [start, end] = timeStr.split(" - ").map((t) => new Date(`1970-01-01T${t}:00Z`));
    return { start, end };
}

function convertTimeToPixels(time) {
    const hours = time.getUTCHours();
    const minutes = time.getUTCMinutes();
    return (hours - 7.8) * 60 + minutes; // Предполагаем что 08:00 соответствует 0px
}

function getTimeCoordinate(timeStr) {
    const { start, end } = parseTime(timeStr);
    return {
        startY: convertTimeToPixels(start),
        endY: convertTimeToPixels(end),
    };
}

function createEventElement(event) {
    const { startY, endY } = getTimeCoordinate(event.time);
    const height = endY - startY;

    const eventElem = document.createElement("div");
    eventElem.classList.add("l-event");
    eventElem.style.top = `${startY}px`;
    eventElem.style.height = `${height}px`;
    eventElem.innerHTML = `<span class="l-event__title">${event.className}</span>${event.instructor}<br>${event.time}`;

    return eventElem;
}

function renderEvents() {
    events.forEach((event) => {
        const dayElem = document.querySelector(`.day[data-day="${event.day}"]`);
        if (dayElem) {
            const eventElem = createEventElement(event);
            dayElem.appendChild(eventElem);
        }
    });
}

renderEvents();
