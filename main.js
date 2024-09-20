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
    { time: "08:30 - 20:00", day: "Mon", className: "ТЕСТ2", instructor: "Фамилия2 Имя2" },
    { time: "15:00 - 16:00", day: "Tue", className: "ТЕСТ", instructor: "Фамилия Имя" },
    // Добавьте остальные события
];

function parseTime(timeStr) {
    const [start, end] = timeStr.split(" - ").map((t) => new Date(`1970-01-01T${t}:00Z`));
    return { start, end };
}

function convertTimeToPixels(time) {
    const hours = time.getUTCHours();
    const minutes = time.getUTCMinutes();
    return (hours - 8) * 60 + minutes; // Предполагаем что 08:00 соответствует 0px
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
    eventElem.classList.add("event");
    eventElem.style.top = `${startY}px`;
    eventElem.style.height = `${height}px`;
    eventElem.innerHTML = `<strong>${event.className}</strong><br>${event.instructor}<br>${event.time}`;

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
