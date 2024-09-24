window.addEventListener("DOMContentLoaded", () => {
    // данные в массиве обязательно должны быть заполнены как на примере!!!
    //
    //  время должно быть указано в формате "HH:MM - HH:MM"
    //  HH - часы, MM - минуты
    //  пример: "08:30 - 19:00", "15:00 - 16:00"
    //
    // Дни недели укороченный варинат по типу Пн Вт Чт, прошу учесть регистр!!!
    
    fetchJson();

    // Функция для создания временного интервала
    function createTimeIntervals() {
        const timeContainer = document.querySelector(".l-times-block");
        if (!timeContainer) return;
        let startTime = new Date("1970-01-01T08:00:00"); //08:00:00
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

    function createDaySlots() {
        const days = document.querySelectorAll(".day");
        days.forEach((day) => {
            let startTime = new Date("1970-01-01T08:00:00"); //08:00:00
            let endTime = new Date("1970-01-01T22:00:00");

            // Шаг времени в минутах (30 минут)
            let step = 30;

            console.log(day);
            

            // Пока текущее время меньше конечного времени
            while (startTime <= endTime) {
                let timeString = startTime.toTimeString().substring(0, 5); // Преобразуем время в строку "HH:MM"

                // Создаем новый div для ячейки
                const slotDiv = document.createElement("div");
                slotDiv.innerHTML = `<span>Добавить событие</span>`;
                slotDiv.setAttribute("data-time", timeString);
                slotDiv.setAttribute("data-day", day.getAttribute("data-day"));
                slotDiv.classList.add("slot");
                slotDiv.addEventListener("click", () => openModal(day.getAttribute("data-day"), timeString));

                // Добавляем div в день
                day.appendChild(slotDiv);

                // Увеличиваем текущее время на 30 минут
                startTime.setMinutes(startTime.getMinutes() + step);
            }
        });
    }

    // Вызов функции для отображения интервалов
    createTimeIntervals();
    createDaySlots();

    function parseTime(timeStr) {
        const [start, end] = timeStr.split(" - ").map((t) => new Date(`1970-01-01T${t}:00Z`));
        return { start, end };
    }

    function convertTimeToPixels(time) {
        const hours = time.getUTCHours();
        const minutes = time.getUTCMinutes();
        return (hours - 7.8) * 60 + minutes; // 7.8 - смещение
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

    function renderEvents(events) {
        events.forEach((event) => {
            const dayElem = document.querySelector(`.day[data-day="${event.day}"]`);
            if (dayElem) {
                const eventElem = createEventElement(event);
                dayElem.appendChild(eventElem);
            }
        });
    }

    function fetchJson() {
        fetch("./events.json")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                renderEvents(data);
            })
            .catch((error) => {
                console.error("Unable to fetch data:", error);
            });
    }

    const modal = document.getElementById("modal");
    const eventEndTimeInput = document.getElementById("eventEndTime");
    const eventClassNameInput = document.getElementById("eventClassName");
    const eventInsctructorInput = document.getElementById("eventInsctructor");
    const saveEventButton = document.getElementById("saveEvent");
    const closeModalButton = document.getElementsByClassName("close")[0];

    function openModal(day, startTime) {
        modal.style.display = "block";
        eventEndTimeInput.value = startTime; // Устанавливаем начальное значение для конца события

        saveEventButton.onclick = () => {
            const endTime = eventEndTimeInput.value;
            const eventTime = `${startTime} - ${endTime}`;
            const event = {
                day: day,
                time: eventTime,
                className: eventClassNameInput.value,
                instructor: eventInsctructorInput.value
            };
            saveEvent(event);
            modal.style.display = "none";
        };

        closeModalButton.onclick = () => {
            modal.style.display = "none";
        };

        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        };
    }

    function saveEvent(event) {
        fetch("./events.json")
            .then((res) => res.json())
            .then((data) => {
                data.push(event);
                fetch("./events.json", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                .then(() => {
                    renderEvents([event]);
                })
                .catch((error) => {
                    console.error("Unable to save event:", error);
                });
            })
            .catch((error) => {
                console.error("Unable to fetch data:", error);
            });
    }
});
