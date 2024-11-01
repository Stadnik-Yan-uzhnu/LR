document.addEventListener("DOMContentLoaded", () => {
    const jobsContainer = document.getElementById("jobsContainer"); // контейнер для вакансій
    const modal = document.getElementById("modal"); // модальне вікно
    const closeModalButton = document.querySelector(".close-button"); //закриття модального вікна
    let jobData = []; //масив для зберігання даних про вакансії


 // щоб все працювало встановіть розширення live server

    // використання фетч
    fetch("15-jobs.json")
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok"); //перевірка на успішність запиту
            return response.json(); // повертаємо JSON дані
        })
        .then(data => {
            jobData = data; //збереження отриманних даних у jobData
            displayJobs(data); //відображення вакансій
        })
        .catch(error => {
            jobsContainer.innerHTML = "<p>Помилка завантаження даних.</p>"; // вивод повідомлення про помилку
            console.error("Ошибка загрузки данных:", error); // лог помилки в консолі
        });

    // відображення вакансій у контейнері
    function displayJobs(jobs) {
        jobsContainer.innerHTML = jobs.length === 0 ? "<p>Нічого не знайдено.</p>" : ""; // якщр вакансії немає

        jobs.forEach(job => {
            const jobCard = createJobCard(job); // створення картки вакансії
            jobsContainer.appendChild(jobCard); // додати картку до контейнера
        });
    }

    //створення елемента картки вакансії
    function createJobCard(job) {
        const jobCard = document.createElement("div"); // створення нового div
        jobCard.classList.add("job-card"); //клас для стилізації
        jobCard.innerHTML = `
            <h3>${job.title}</h3>
            <p><strong>Компанія:</strong> ${job.company}</p>
            <p><strong>Локація:</strong> ${job.location}</p>
            <p><strong>Тип:</strong> ${job.type}</p>
            <p><strong>Рівень:</strong> ${job.experienceLevel}</p>
            <p><strong>Дата розміщення:</strong> ${job.postedDate}</p>
        `;
        jobCard.addEventListener("click", () => openModal(job)); // обробник події для відкриття модального вікна
        return jobCard; // повернення створенної картки
    }

    // відкриття модального вікна з деталями вакансії
    function openModal(job) {
        document.getElementById("modalTitle").innerText = job.title; // заголовок модального вікна
        document.getElementById("modalDescription").innerText = job.description; //опис вакансії
        document.getElementById("modalSkills").innerText = job.skills.join(", "); // навички для вакансії
        modal.style.display = "flex"; // відображення модального вікна
    }

    //закриття модального вікна
    closeModalButton.addEventListener("click", closeModal); //обробник події для закриття
    window.addEventListener("click", event => {
        if (event.target === modal) closeModal(); //закриття при кліку за межами модального вікна
    });

    function closeModal() {
        modal.style.display = "none"; // сховати модальне вікно
    }

    // фільтрація та сортування
    document.getElementById("searchButton").addEventListener("click", filterAndSortJobs); // кнопка пошуку
    document.getElementById("typeFilter").addEventListener("change", filterAndSortJobs); // фільтр типу
    document.getElementById("experienceFilter").addEventListener("change", filterAndSortJobs); // фільтр досвіду
    document.getElementById("locationFilter").addEventListener("input", filterAndSortJobs); // фільтр локації
    document.getElementById("sort").addEventListener("change", filterAndSortJobs); // сортування
    document.getElementById("search").addEventListener("input", filterAndSortJobs); // обробник для вводу пошуку

    // функція для фільтрації та сортування вакансій на основі вводу
    function filterAndSortJobs() {
        const searchText = document.getElementById("search").value.toLowerCase(); // отримати текст пошуку
        const filters = {
            type: document.getElementById("typeFilter").value, //щоб отримати фільтр типу
            experience: document.getElementById("experienceFilter").value, //щоб отримати фільтр досвіду
            location: document.getElementById("locationFilter").value.toLowerCase(), // щоб отримати фільтр локації
        };
        const sortOption = document.getElementById("sort").value; //щоб отримати опцію сортування

        const filteredJobs = jobData.filter(job => matchesFilters(job, searchText, filters)); // фільтруємо вакансії

        sortJobs(filteredJobs, sortOption); // сортування вакансій
        displayJobs(filteredJobs); // відображання після фільтрації/сортування
    }

    //перевірка на відповідність вакансій до заданих фільтрів
    function matchesFilters(job, searchText, { type, experience, location }) {
        const matchesSearch = job.title.toLowerCase().includes(searchText) || job.company.toLowerCase().includes(searchText); // перевірка на відповідність пошуковому запиту
        const matchesType = type ? job.type === type : true; // перевірка на відповідність типу
        const matchesExperience = experience ? job.experienceLevel === experience : true; // перевірка на відповідність досвіду
        const matchesLocation = location ? job.location.toLowerCase().includes(location) : true; // перевірка на відповідність локації
        return matchesSearch && matchesType && matchesExperience && matchesLocation; // повертаємо результат перевірки
    }

    // функція для сортування вакансій на основі вибраної опції
    function sortJobs(jobs, sortOption) {
        if (sortOption === "date") {
            jobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate)); // сортировка за датою
        } else if (sortOption === "title") {
            jobs.sort((a, b) => a.title.localeCompare(b.title)); // сортировка за назвою
        }
    }
});
