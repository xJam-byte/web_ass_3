// Animated Counter
function animateCounter(element, target, duration) {
  const startValue = 0;
  const startTime = Date.now();
  const suffix = element.dataset.suffix || "";

  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = Math.floor(
      startValue + (target - startValue) * progress
    );

    element.textContent = currentValue + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  update();
}

// Intersection Observer for counters
const observerOptions = {
  threshold: 0.5,
  rootMargin: "0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !entry.target.classList.contains("animated")) {
      const target = parseInt(entry.target.dataset.target);
      const duration = parseInt(entry.target.dataset.duration) || 2000;
      animateCounter(entry.target, target, duration);
      entry.target.classList.add("animated");
    }
  });
}, observerOptions);

document
  .querySelectorAll(".animated-counter")
  .forEach((el) => observer.observe(el));

// Time Display
document.getElementById("showTimeBtn")?.addEventListener("click", function () {
  const now = new Date();
  const timeString = now.toLocaleString("ru-RU");
  const display = document.getElementById("timeDisplay");
  display.textContent = `Текущее время: ${timeString}`;
  display.style.display = "block";
});

// Random Facts
const techFacts = [
  "Первый веб-сайт был создан в 1991 году.",
  "Интернет передает более 300 экзабайт данных в месяц.",
  "Более 4 млрд людей используют интернет.",
  "Первый iPhone был выпущен в 2007 году.",
  "Искусственный интеллект может теперь распознавать лица с точностью 99.97%.",
  "Облачные вычисления растут на 25% ежегодно.",
  "5G может передавать данные со скоростью 20 Гбит/сек.",
  "Квантовые компьютеры могут обрабатывать информацию в миллионы раз быстрее.",
];

document
  .getElementById("randomFactBtn")
  ?.addEventListener("click", function () {
    const randomIndex = Math.floor(Math.random() * techFacts.length);
    const display = document.getElementById("factDisplay");
    display.textContent = techFacts[randomIndex];
    display.style.display = "block";
  });

// Rating Stars
document.querySelectorAll(".rating-stars").forEach((container) => {
  const stars = container.querySelectorAll("i");

  stars.forEach((star, index) => {
    star.addEventListener("click", function () {
      const rating = this.dataset.rating;
      const productId = container.dataset.product;

      // Save rating
      localStorage.setItem(`rating_${productId}`, rating);

      // Update display
      stars.forEach((s, i) => {
        if (i < rating) {
          s.classList.add("filled");
          s.classList.remove("bi-star");
          s.classList.add("bi-star-fill");
        } else {
          s.classList.remove("filled");
          s.classList.remove("bi-star-fill");
          s.classList.add("bi-star");
        }
      });
    });

    // Load saved rating
    const savedRating = localStorage.getItem(
      `rating_${container.dataset.product}`
    );
    if (savedRating && index < savedRating) {
      star.classList.add("filled");
      star.classList.remove("bi-star");
      star.classList.add("bi-star-fill");
    }
  });
});

// Form Validation and Submission
document
  .getElementById("subscribeForm")
  ?.addEventListener("submit", function (e) {
    e.preventDefault();

    const form = this;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      form.classList.add("was-validated");
      return;
    }

    const name = document.getElementById("subscribeName").value;
    const email = document.getElementById("subscribeEmail").value;

    // Save subscription
    const subscriptions = JSON.parse(
      localStorage.getItem("subscriptions") || "[]"
    );
    subscriptions.push({ name, email, date: new Date().toISOString() });
    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));

    // Show success
    const successMsg = form.dataset.successMessage;
    alert(successMsg);

    form.reset();
    form.classList.remove("was-validated");
    bootstrap.Modal.getInstance(
      document.getElementById("subscribeModal")
    ).hide();
  });

// Dynamic Date/Time Footer
function updateDateTime() {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateTimeElement = document.getElementById("datetime");
  if (dateTimeElement) {
    dateTimeElement.textContent = formatter.format(now);
  }
}

updateDateTime();
setInterval(updateDateTime, 60000);

// News Feed
const newsData = [
  {
    id: 1,
    title: "Apple представила iPhone 15 Pro",
    category: "gadgets",
    content: "Новый флагманский смартфон с улучшенной камерой",
    image:
      "assets/iphone15pro.jpg.webp",
  },
  {
    id: 2,
    title: "Nvidia выпустила RTX 5090",
    category: "tech",
    content: "Самая мощная видеокарта для игроков и профессионалов",
    image:
      "assets/nvdia5090.jpg",
  },
  {
    id: 3,
    title: "OpenAI представила GPT-5",
    category: "ai",
    content: "Новое поколение ИИ с улучшенной способностью к рассуждению",
    image:
      "assets/chatgpt5.png",
  },
  {
    id: 4,
    title: "Samsung Z Fold 6 официально",
    category: "gadgets",
    content: "Новый складной смартфон с улучшенным дизайном",
    image:
      "assets/samsungz6.jpg",
  },
  {
    id: 5,
    title: "Intel Core Ultra 9 285K",
    category: "tech",
    content: "Новый процессор для десктопов с AI ускорением",
    image:
      "assets/intel.jpg",
  },
  {
    id: 6,
    title: "Google Gemini 2.0 Бета",
    category: "ai",
    content: "Улучшенная версия ИИ помощника от Google",
    image:
      "assets/gemini.webp",
  },
];

function renderNews() {
  const container = document.getElementById("newsContainer");
  if (!container) return;

  const selectedCategory =
    document.querySelector('[data-category][data-bs-toggle="button"].active')
      ?.dataset.category || "all";

  const filteredNews =
    selectedCategory === "all"
      ? newsData
      : newsData.filter((news) => news.category === selectedCategory);

  container.innerHTML = "";

  filteredNews.forEach((news) => {
    const newsCard = document.createElement("div");
    newsCard.className = "col";
    newsCard.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${news.image}" class="card-img-top" alt="${news.title}" style="height: 200px; object-fit: cover;" />
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${news.title}</h5>
          <p class="card-text text-muted">${news.content}</p>
          <a href="#" class="btn btn-sm btn-primary mt-auto">Подробнее</a>
        </div>
      </div>
    `;
    container.appendChild(newsCard);
  });
}

// News Category Buttons
document.querySelectorAll("[data-category]").forEach((btn) => {
  btn.addEventListener("click", function () {
    document
      .querySelectorAll("[data-category]")
      .forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    renderNews();
  });
});

renderNews();

// Cursor pointer for clickable elements
document.querySelectorAll(".gallery-item").forEach((item) => {
  item.style.cursor = "pointer";
});

console.log("ElectroStore JavaScript loaded successfully!");
