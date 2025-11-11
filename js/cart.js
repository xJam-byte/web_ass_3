$(document).ready(function () {
  const $root = $("[data-cart-root]");
  if (!$root.length) return;

  const $body = $root.find("[data-cart-body]");
  const $subtotalElement = $root.find("[data-cart-subtotal]");
  const $shippingElement = $root.find("[data-cart-shipping]");
  const $totalElement = $root.find("[data-cart-total]");
  const $countElement = $root.find("[data-cart-count]");
  const $clearButton = $root.find("[data-cart-clear]");

  const formatter = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  });

  const state = {
    items: [
      {
        id: 1,
        name: "Смартфон Pro X",
        category: "smartphones",
        price: 75000,
        rating: 5,
        image: "assets/samsung.jpg",
        specs: { ram: "8GB", storage: "256GB", battery: "5000mAh" },
      },
      {
        id: 2,
        name: "Ноутбук UltraBook 15",
        category: "laptops",
        price: 120000,
        rating: 5,
        image: "assets/ultrabook.jpg",
        specs: { cpu: "Intel i7", ram: "16GB", storage: "512GB SSD" },
      },
      {
        id: 3,
        name: "Наушники SoundWave",
        category: "accessories",
        price: 15000,
        rating: 4,
        image: "assets/soundwave.jpg",
        specs: { type: "Bluetooth", battery: "30h", color: "черный" },
      },
    ],
    shippingThreshold: 100000,
    shippingFee: 1500,
  };

  const formatPrice = (value) => formatter.format(value);

  const calculateSubtotal = () =>
    state.items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

  const calculateShipping = (subtotal) => {
    switch (true) {
      case subtotal === 0:
        return 0;
      case subtotal >= state.shippingThreshold:
        return 0;
      default:
        return state.shippingFee;
    }
  };

  const updateSummary = () => {
    const subtotal = calculateSubtotal();
    const shipping = calculateShipping(subtotal);
    const total = subtotal + shipping;

    $subtotalElement.text(formatPrice(subtotal));
    $shippingElement.text(shipping ? formatPrice(shipping) : "Бесплатно");
    $totalElement.text(formatPrice(total));

    if ($countElement.length) {
      const count = state.items.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
      );
      $countElement.text(count.toString());
    }

    if ($clearButton.length) {
      $clearButton.prop("disabled", state.items.length === 0);
    }
  };

  const renderEmptyState = () => {
    const $row = $("<tr>");
    $row.html(`
      <td colspan="4" class="py-5 text-center text-muted">
        Корзина пуста. Добавьте товары из <a href="products.html">каталога</a>, чтобы продолжить покупку.
      </td>
    `);
    $body.append($row);
  };

  const renderCart = () => {
    if (!$body.length) return;
    $body.empty();

    if (!state.items.length) {
      renderEmptyState();
      updateSummary();
      return;
    }

    state.items.forEach((item) => {
      const $row = $("<tr>");
      $row.attr("data-id", item.id);
      $row.addClass("cart-row-animated");
      $row.html(`
        <td>
          <div class="d-flex align-items-center gap-3">
            <img  src="${
              item.image
            }" class="rounded small-img" width="96" height="72" alt="${
        item.title
      }">
            <div>
              <h2 class="h6 mb-1">${item.title}</h2>
              <p class="text-muted small mb-0">${item.description}</p>
            </div>
          </div>
        </td>
        <td class="text-center">
          <div class="btn-group btn-group-sm" role="group" aria-label="Изменение количества ${
            item.title
          }">
            <button class="btn btn-outline-secondary" type="button" data-action="decrease" aria-label="Уменьшить количество ${
              item.title
            }">−</button>
            <span class="btn btn-outline-secondary disabled" aria-live="polite">${
              item.quantity
            }</span>
            <button class="btn btn-outline-secondary" type="button" data-action="increase" aria-label="Увеличить количество ${
              item.title
            }">+</button>
          </div>
          <button class="btn btn-link btn-sm text-danger mt-2 p-0" type="button" data-action="remove">Удалить</button>
        </td>
        <td class="text-end">${formatPrice(item.price)}</td>
        <td class="text-end">${formatPrice(item.price * item.quantity)}</td>
      `);
      $body.append($row);
    });

    updateSummary();
  };

  const removeItem = (id) => {
    const item = state.items.find((entry) => entry.id === id);
    state.items = state.items.filter((entry) => entry.id !== id);
    if (window.ElectroStoreApp?.showNotification && item) {
      window.ElectroStoreApp.showNotification(
        `«${item.title}» удалён из корзины.`,
        "success"
      );
    }
    renderCart();
  };

  const changeQuantity = (id, delta) => {
    const item = state.items.find((entry) => entry.id === id);
    if (!item) return;

    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      item.quantity = newQuantity;
      if (window.ElectroStoreApp?.playSound) {
        window.ElectroStoreApp.playSound("success");
      }
      renderCart();
    }
  };

  if ($body.length) {
    $body.on("click", "[data-action]", function (event) {
      const $button = $(this);
      const action = $button.data("action");
      const $row = $button.closest("tr[data-id]");

      if (!$row.length) return;

      event.preventDefault();
      const id = $row.data("id");

      switch (action) {
        case "increase":
          changeQuantity(id, 1);
          break;
        case "decrease":
          changeQuantity(id, -1);
          break;
        case "remove":
          removeItem(id);
          break;
        default:
          break;
      }
    });
  }

  if ($clearButton.length) {
    $clearButton.on("click", function () {
      if (!state.items.length) return;
      state.items = [];
      if (window.ElectroStoreApp?.showNotification) {
        window.ElectroStoreApp.showNotification("Корзина очищена.", "success");
      }
      renderCart();
    });
  }

  renderCart();
});
const toggleBtn = document.getElementById("theme-toggle");
const body = document.body;

// Проверяем сохранённую тему при загрузке
if (localStorage.getItem("theme") === "dark") {
  body.setAttribute("data-bs-theme", "dark");
  toggleBtn.classList.remove("btn-outline-dark");
  toggleBtn.classList.add("btn-outline-light");
}

// Обработчик клика
toggleBtn.addEventListener("click", () => {
  if (body.getAttribute("data-bs-theme") === "dark") {
    // Переключаем на светлую
    body.removeAttribute("data-bs-theme");
    toggleBtn.classList.remove("btn-outline-light");
    toggleBtn.classList.add("btn-outline-dark");
    localStorage.setItem("theme", "light");
  } else {
    // Переключаем на тёмную
    body.setAttribute("data-bs-theme", "dark");
    toggleBtn.classList.remove("btn-outline-dark");
    toggleBtn.classList.add("btn-outline-light");
    localStorage.setItem("theme", "dark");
  }
});
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString("ru-RU", { hour12: false });
  document.getElementById("current-time").textContent = timeString;
}

setInterval(updateTime, 1000);

updateTime();
