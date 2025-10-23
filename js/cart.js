document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-cart-root]");
  if (!root) return;

  const body = root.querySelector("[data-cart-body]");
  const subtotalElement = root.querySelector("[data-cart-subtotal]");
  const shippingElement = root.querySelector("[data-cart-shipping]");
  const totalElement = root.querySelector("[data-cart-total]");
  const countElement = root.querySelector("[data-cart-count]");
  const clearButton = root.querySelector("[data-cart-clear]");

  const formatter = new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "KZT",
    maximumFractionDigits: 0,
  });

  const state = {
    items: [
      {
        id: "iphonex",
        title: "Iphone X",
        price: 72000,
        quantity: 1,
        image: "iphonex.jpg",
        description: "Память 64 ГБ, цвет белый, отличное состояние.",
      },
      {
        id: "soundwave",
        title: "Наушники SoundWave",
        price: 15000,
        quantity: 2,
        image: "yanss.jpg",
        description: "Активное шумоподавление и режим прозрачности.",
      },
      {
        id: "vr-set",
        title: "VR-шлем NextGen",
        price: 98000,
        quantity: 1,
        image: "vr.jpg",
        description: "Контроллеры в комплекте, поддержка SteamVR.",
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

    if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal);
    if (shippingElement)
      shippingElement.textContent = shipping
        ? formatPrice(shipping)
        : "Бесплатно";
    if (totalElement) totalElement.textContent = formatPrice(total);
    if (countElement) {
      const count = state.items.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
      );
      countElement.textContent = count.toString();
    }

    if (clearButton) {
      clearButton.disabled = state.items.length === 0;
    }
  };

  const renderEmptyState = () => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td colspan="4" class="py-5 text-center text-muted">
        Корзина пуста. Добавьте товары из <a href="products.html">каталога</a>, чтобы продолжить покупку.
      </td>
    `;
    body.append(row);
  };

  const renderCart = () => {
    if (!body) return;
    body.innerHTML = "";

    if (!state.items.length) {
      renderEmptyState();
      updateSummary();
      return;
    }

    state.items.forEach((item) => {
      const row = document.createElement("tr");
      row.dataset.id = item.id;
      row.classList.add("cart-row-animated");
      row.innerHTML = `
        <td>
          <div class="d-flex align-items-center gap-3">
            <img src="${item.image}" class="rounded" width="96" height="72" alt="${item.title}">
            <div>
              <h2 class="h6 mb-1">${item.title}</h2>
              <p class="text-muted small mb-0">${item.description}</p>
            </div>
          </div>
        </td>
        <td class="text-center">
          <div class="btn-group btn-group-sm" role="group" aria-label="Изменение количества ${item.title}">
            <button class="btn btn-outline-secondary" type="button" data-action="decrease" aria-label="Уменьшить количество ${item.title}">−</button>
            <span class="btn btn-outline-secondary disabled" aria-live="polite">${item.quantity}</span>
            <button class="btn btn-outline-secondary" type="button" data-action="increase" aria-label="Увеличить количество ${item.title}">+</button>
          </div>
          <button class="btn btn-link btn-sm text-danger mt-2 p-0" type="button" data-action="remove">Удалить</button>
        </td>
        <td class="text-end">${formatPrice(item.price)}</td>
        <td class="text-end">${formatPrice(item.price * item.quantity)}</td>
      `;
      body.append(row);
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

  if (body) {
    body.addEventListener("click", (event) => {
      const button = event.target.closest("[data-action]");
      if (!button) return;

      const row = button.closest("tr[data-id]");
      if (!row) return;

      event.preventDefault();
      const { id } = row.dataset;

      switch (button.dataset.action) {
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

  if (clearButton) {
    clearButton.addEventListener("click", () => {
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
