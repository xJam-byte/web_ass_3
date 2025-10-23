document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-products-root]");
  if (!root) return;

  const grid = root.querySelector("[data-product-grid]");
  const countElement = root.querySelector("[data-product-count]");
  const filterGroup = root.querySelector("[data-filter-group]");
  const filterButtons = filterGroup
    ? Array.from(filterGroup.querySelectorAll("[data-filter]"))
    : [];

  const currency = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  });

  const products = [
    {
      id: "devbook-max",
      title: "DevBook Max 16",
      category: "laptops",
      price: 185000,
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
      description:
        "Процессор M‑серии, 32 ГБ RAM и OLED‑панель 4K. Создан для сложной разработки и дизайна.",
      badge: "Популярное",
      features: ["OLED 4K", "32 ГБ RAM", "Автономность 18 ч"],
    },
    {
      id: "ultranote-14",
      title: "UltraNote 14",
      category: "laptops",
      price: 142000,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
      description:
        "Лёгкий ультрабук с процессором Intel EVO, зарядкой 50% за 20 минут и Wi‑Fi 6.",
      features: ["1.1 кг", "2.8K OLED", "Thunderbolt 4"],
    },
    {
      id: "gamepro-rtx",
      title: "GamePro RTX",
      category: "laptops",
      price: 238000,
      image:
        "картина.jpg",
      description:
        "Игровой ноутбук с RTX 4070, экраном 240 Гц и системой охлаждения с жидким металлом.",
      badge: "Новинка",
      features: ["RTX 4070", "240 Гц", "1 ТБ SSD"],
    },
    {
      id: "edgephone-13",
      title: "EdgePhone 13",
      category: "smartphones",
      price: 89900,
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
      description:
        "Безрамочный дисплей 6.7\", 120 Гц, камера 64 Мп и быстрая зарядка 65 Вт для насыщенного дня.",
      features: ["120 Гц", "64 Мп", "65 Вт зарядка"],
    },
    {
      id: "nova-compact",
      title: "Nova Compact",
      category: "smartphones",
      price: 64800,
      image:
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80",
      description:
        "Компактный смартфон с 256 ГБ памяти, eSIM и режимом съёмки в HDR10+ для блогеров.",
      features: ["256 ГБ", "HDR10+", "eSIM"],
    },
    {
      id: "soundwave-studio",
      title: "SoundWave Studio",
      category: "accessories",
      price: 29900,
      image:
        "https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=900&q=80",
      description:
        "Беспроводные наушники с активным шумоподавлением и пространственным звучанием до 30 часов.",
      features: ["ANC", "Spatial Audio", "30 ч работы"],
    },
    {
      id: "pulsewatch-pro",
      title: "PulseWatch Pro",
      category: "accessories",
      price: 36900,
      image:
        "часы.jpg",
      description:
        "Смарт-часы с ЭКГ, анализом сна и бесконтактными платежами. Десять дней без подзарядки.",
      badge: "Хит продаж",
      features: ["ЭКГ", "NFC Pay", "10 дней работы"],
    },
    {
      id: "smart-home-kit",
      title: "Smart Home Kit",
      category: "smart-home",
      price: 45500,
      image:
        "дом.jpg",
      description:
        "Комплект датчиков движения, камер и умных ламп с управлением с телефона или голосом.",
      features: ["Датчики движения", "Сценарии", "Поддержка Alexa"],
    },
    {
      id: "aura-light",
      title: "Aura Light Bar",
      category: "smart-home",
      price: 19500,
      image:
        "картина2.jpg",
      description:
        "Умная подсветка для рабочего стола с автоматической регулировкой температуры цвета.",
      features: ["Автояркость", "16 млн цветов", "Голосовое управление"],
    },
  ];

  let activeCategory = "all";

  const formatPrice = (value) => currency.format(value);

  const renderFeatures = (featureList = []) =>
    featureList
      .map(
        (feature) =>
          `<span class="badge rounded-pill text-bg-light border text-muted">${feature}</span>`
      )
      .join("");

  const renderProducts = (category) => {
    if (!grid) return;

    grid.innerHTML = "";

    const filtered =
      category === "all"
        ? products
        : products.filter((product) => product.category === category);

    if (!filtered.length) {
      const emptyState = document.createElement("div");
      emptyState.className = "col";
      emptyState.innerHTML = `
        <div class="alert alert-warning h-100 d-flex flex-column justify-content-center align-items-center text-center mb-0">
          <h2 class="h6 fw-semibold mb-2">Таких товаров пока нет</h2>
          <p class="mb-3">Попробуйте выбрать другую категорию или загляните к нам позже — ассортимент регулярно обновляется.</p>
          <a class="btn btn-sm btn-primary" href="contact.html">Получить консультацию</a>
        </div>
      `;
      grid.append(emptyState);
      if (countElement) countElement.textContent = "0";
      return;
    }

    filtered.forEach((product, index) => {
      const col = document.createElement("div");
      col.className = "col";
      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${product.image}" class="card-img-top" alt="${product.title}">
          <div class="card-body d-flex flex-column">
            ${
              product.badge
                ? `<span class="badge text-bg-primary-subtle text-primary-emphasis align-self-start mb-2">${product.badge}</span>`
                : ""
            }
            <h2 class="card-title h5">${product.title}</h2>
            <p class="card-text text-muted flex-grow-1">${product.description}</p>
            ${
              product.features
                ? `<div class="d-flex flex-wrap gap-2 small text-muted mb-3">${renderFeatures(
                    product.features.slice(0, 3)
                  )}</div>`
                : ""
            }
            <div class="d-flex justify-content-between align-items-center border-top pt-3 mt-auto">
              <span class="fw-semibold fs-6 text-primary">${formatPrice(
                product.price
              )}</span>
              <a class="btn btn-sm btn-primary" href="cart.html">В корзину</a>
            </div>
          </div>
        </div>
      `;
      grid.append(col);

      const card = col.querySelector(".card");
      if (card) {
        card.classList.add("product-card-animated");
        card.style.animationDelay = `${index * 0.05}s`;
      }
    });

    if (countElement) {
      countElement.textContent = filtered.length.toString();
    }
  };

  const setActiveButton = (category) => {
    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === category;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive.toString());
    });
  };

  const handleFilterChange = (category) => {
    if (category === activeCategory) return;
    activeCategory = category;
    setActiveButton(category);
    renderProducts(category);
    if (window.ElectroStoreApp?.playSound) {
      window.ElectroStoreApp.playSound("toggle");
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () =>
      handleFilterChange(button.dataset.filter || "all")
    );
    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleFilterChange(button.dataset.filter || "all");
      }
    });
  });

  const getNextCategory = (key) => {
    const categories = filterButtons.map((btn) => btn.dataset.filter);
    const currentIndex = categories.indexOf(activeCategory);
    switch (key) {
      case "ArrowRight":
      case "ArrowDown":
        return categories[(currentIndex + 1) % categories.length];
      case "ArrowLeft":
      case "ArrowUp":
        return categories[
          (currentIndex - 1 + categories.length) % categories.length
        ];
      case "Home":
        return categories[0];
      case "End":
        return categories[categories.length - 1];
      default:
        return null;
    }
  };

  if (filterGroup) {
    filterGroup.addEventListener("keydown", (event) => {
      const next = getNextCategory(event.key);
      if (!next) return;

      event.preventDefault();
      const nextButton = filterButtons.find(
        (btn) => btn.dataset.filter === next
      );
      if (nextButton) {
        nextButton.focus();
        handleFilterChange(next);
      }
    });
  }

  // Initial render
  renderProducts(activeCategory);
  setActiveButton(activeCategory);
});
