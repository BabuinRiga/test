// Настраиваемые переменные
const stageDurations = [
  [5000, 10000, 15000, 10000, 5000], // Длительность этапов для панели 1
  [6000, 1200, 18000, 1200, 6000], // Длительность этапов для панели 2
  [700, 1400, 21000, 1400, 7000], // Длительность этапов для панели 3
];

const panelDelays = [1000, 2000]; // Задержка перед загрузкой каждой панели (в мс)

let progress = 0;
let currentPanel = 0;
let currentItem = 0;
let isPaused = false;
let interval;
let startTime = Date.now();

function togglePause() {
  isPaused = !isPaused;
}

function resumeHacking() {
  if (isPaused) {
      togglePause();
      processNextItem();
  }
}

function toggleSection(header) {
  const content = header.nextElementSibling;
  content.classList.toggle('open');

  // Прокрутка страницы к элементу content
  content.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function openSection(sectionId) {
  const section = document.querySelector(sectionId);
  if (section) {
      section.style.display = 'block'; // Отображаем секцию
      section.classList.add('open'); // Добавляем класс для анимации
  } else {
      console.error(`Секция ${sectionId} не найдена.`);
  }
}

function closeSection(sectionId) {
  const section = document.querySelector(sectionId);
  if (section && section.classList.contains('open')) {
      section.classList.remove('open'); // Убираем класс для анимации
  }
}

function updateProgress(progressBar, progress) {
  progressBar.style.width = progress + "%";
}

function completeItem(item, spinner) {
  spinner.remove();
  item.innerHTML += ' <span class="completed">Завершено</span>';
}

function processNextItem() {
  if (currentItem < stageDurations[currentPanel].length) {
      if (isPaused) return;

      const item = document.querySelector(`#item${currentPanel * 5 + currentItem + 1}`);
      const spinner = document.querySelector(`#spinner${currentPanel * 5 + currentItem + 1}`);
      
      spinner.style.visibility = "visible";

      // Проверка на третий этап второй панели
      if (currentPanel === 1 && currentItem === 2) {
          const inputField = document.createElement('input');
          inputField.type = 'text';
          inputField.placeholder = 'Введите ключ...';
          const submitButton = document.createElement('button');
          submitButton.textContent = 'Подтвердить';

          submitButton.addEventListener('click', () => {
              if (inputField.value === '0fx12') { // Замените "0fx12" на ваш текст
                  item.innerHTML += ' <span class="completed">Ключ принят</span>';
                  progress += (100 / (stageDurations.flat().length));
                  updateProgress(document.getElementById("progressBar"), progress);
                  currentItem++;
                  processNextItem();
              } else {
                  alert('Неверный ключ. Попробуйте снова.');
              }
          });

          item.appendChild(inputField);
          item.appendChild(submitButton);
          spinner.style.visibility = "hidden"; // Остановить спиннер до правильного ввода
      } else {
          setTimeout(() => {
              completeItem(item, spinner);

              // Рассчитать и отобразить время загрузки для каждого пункта
              let elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
              item.innerHTML += `<span>${elapsedTime}s</span>`;

              progress += (100 / (stageDurations.flat().length));
              updateProgress(document.getElementById("progressBar"), progress);

              currentItem++;
              processNextItem();
          }, stageDurations[currentPanel][currentItem]);
      }
  } else {
      const sectionIdOld = `#hackingSection${currentPanel + 1}`;
      const sectionHeaderOld = document.querySelector(`${sectionIdOld} .section-header`);
      toggleSection(sectionHeaderOld);
      completePanel();
  }
}

function completePanel() {
  const sectionId = `#hackingSection${currentPanel + 1}`;
  const sectionHeader = document.querySelector(`${sectionId} .section-header`);

  if (sectionHeader) {
      let totalElapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
      sectionHeader.querySelector('span').textContent = `${totalElapsedTime}s`;

      closeSection(sectionId);

      if (currentPanel < stageDurations.length - 1) {
          setTimeout(() => {
              currentPanel++;
              currentItem = 0;
              const nextSectionId = `#hackingSection${currentPanel + 1}`;
              const nextSectionHeader = document.querySelector(`${nextSectionId} .section-header`);
              openSection(nextSectionId); // Открываем следующую секцию
              toggleSection(nextSectionHeader);
              processNextItem(); // Продолжаем процесс для новой секции
          }, panelDelays[currentPanel]);
      } else {
          document.getElementById("statusMessage").innerText = "Процесс завершен! Банки и ХР успешно добавлены. Проверьте ваш аккаунт в игре!";
          document.getElementById("startButton").disabled = true;
      }
  } else {
      console.error(`Элемент ${sectionId} не найден.`);
  }
}

function startHacking() {
  const playerCode = document.getElementById("playerCode").value;
  const phoneModel = document.getElementById("phoneModel").value;
  const currentCatFood = document.getElementById("currentCatFood").value;
  const currentRank = document.getElementById("currentRank").value;
  const catFoodAmount = document.getElementById("catFoodAmount").value;
  const xpAmount = document.getElementById("xpAmount").value;

  // Проверка наличия всех обязательных полей
  if (!playerCode || !phoneModel || !currentCatFood || !currentRank || !catFoodAmount || !xpAmount) {
      alert("Пожалуйста, заполните все поля.");
      return;
  }

  // Проверка длины кода игрока
  if (playerCode.length !== 9) {
      alert("Код игрока должен содержать 9 символов.");
      return;
  }

  console.log("Начинаем процесс взлома..."); // Логирование
  startTime = Date.now();

  document.getElementById("startButton").disabled = true;
  document.getElementById("progressContainer").style.display = "block";

  // Открытие первой панели
  const sectionId = `#hackingSection${currentPanel + 1}`;

  openSection(sectionId);
  const sectionHeader = document.querySelector(`${sectionId} .section-header`);
  toggleSection(sectionHeader);
  processNextItem();
}

// Пример отзывов
const reviews = [
  { text: "Отличный сервис, быстро получил все, что хотел!", author: "Алексей" },
  { text: "Думал, что это обман, но все сработало! Спасибо!", author: "Мария" },
  { text: "Просто супер! Рекомендую всем.", author: "Иван" },
  { text: "Сначала были сомнения, но все прошло гладко!", author: "Сергей" },
  { text: "Не ожидал такого результата! Спасибо!", author: "Ольга" },
  { text: "Все сработало на ура! Очень доволен.", author: "Наталья" },
  { text: "Всё получилось! Сайт работает!", author: "Дмитрий" },
  { text: "Теперь я живу в лесу, потому что потерял дом и работу из-за этого сайта!", author: "Василий" },
  { text: "Пытался воспользоваться сервисом, так и не понял куда нажимать!", author: "Екатерина" },
  { text: "Все деньги с карты исчезли, но хотя бы солнце ещё светит!", author: "Константин" },
  { text: "Мой кот теперь главный администратор на сервере. Спасибо?", author: "Анна" },
  { text: "Попробовал использовать сайт, и теперь мой телефон работает на угле!", author: "Григорий" },
  { text: "Теперь я общаюсь с техникой через телепатию! И всё благодаря этому сервису!", author: "Евгений" },
  { text: "Программа стерла все мои воспоминания, но я уверен, что раньше я был счастлив!", author: "Павел" },
  { text: "Пидоры, я уже в десятую страну лечу, ради того что бы эта хуета заработала, и я смог купить код безопасности", author: "Илья" },
  { text: "Попробовал нахакать банки, но теперь я должен банку. Неплохо так повернулось!", author: "Алина" },
  { text: "Думал, получу XP, а получил по ебалу!", author: "Александр" },
  { text: "Загрузка была такой долгой, что я успел переосмыслить свою жизнь и стал монахом.", author: "Михаил" },
  { text: "Пытался хакнуть банки, а в итоге хакнули мой кошелек. Спасибо за минус $20!", author: "Ксения" },
  { text: "Ввел код безопасности, и теперь в моем холодильнике бесконечные банки... кошачьи.", author: "Иван" },
  { text: "Теперь мой регион — «Запрещенный». Даже не знаю, что это значит, но звучит угрожающе.", author: "Олег" },
  { text: "Мой телефон стал работать медленнее, чем эта загрузка!", author: "Наталья" },
  { text: "ГДЕ МОЙ АККАУНТ БЛЯТЬ?", author: "Матрос Жрун" },
  { text: "Ребят, не парьтесь, вот мой код безопасности: 0fx12", author: "Добрый парень" },
  { text: "Ребят, не парьтесь, вот мой код безопасности: 0fx12", author: "Добрый парень" },
  { text: "Ребят, не парьтесь, вот мой код безопасности: 0fx12", author: "Добрый парень" }
];

function createReviewElement(review) {
  const reviewContainer = document.createElement("div");
  reviewContainer.className = "reviewContainer";
  
  const reviewText = document.createElement("p");
  reviewText.id = "reviewText";
  reviewText.innerText = `"${review.text}"`;
  
  const reviewAuthor = document.createElement("p");
  reviewAuthor.id = "reviewAuthor";
  reviewAuthor.innerText = `- ${review.author}`;
  
  reviewContainer.appendChild(reviewText);
  reviewContainer.appendChild(reviewAuthor);
  
  return reviewContainer;
}

function addReview() {
  const review = getRandomReview();
  const reviewElement = createReviewElement(review);
  
  const reviewsColumn = document.getElementById("reviewsColumn");
  reviewsColumn.appendChild(reviewElement);

  // Удаление отзыва после завершения анимации (5 секунд)
  setTimeout(() => {
      reviewsColumn.removeChild(reviewElement);
  }, 15000);
}

function getRandomReview() {
  const randomIndex = Math.floor(Math.random() * reviews.length);
  return reviews[randomIndex];
}

// Добавление нового отзыва каждые 2 секунды
setInterval(addReview, 5000);

// Показ первого отзыва при загрузке страницы
window.onload = addReview;

document.getElementById('openSecurityCodePopup').addEventListener('click', function() {
  document.getElementById('securityCodePopup').style.display = 'flex';
});

document.getElementById('closePopup').addEventListener('click', function() {
  document.getElementById('securityCodePopup').style.display = 'none';
});

function buySubscription(type) {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = "Кажется, данная функция не доступна в вашем регионе";
}