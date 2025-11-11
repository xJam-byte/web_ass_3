const productsData = [
  {
    id: 1,
    name: "Смартфон Pro X",
    category: "smartphones",
    price: 75000,
    rating: 5,
    image:
      "assets/samsung.jpg",
    specs: { ram: "8GB", storage: "256GB", battery: "5000mAh" },
  },
  {
    id: 2,
    name: "Ноутбук UltraBook 15",
    category: "laptops",
    price: 120000,
    rating: 5,
    image:
      "assets/ultrabook.jpg",
    specs: { cpu: "Intel i7", ram: "16GB", storage: "512GB SSD" },
  },
  {
    id: 3,
    name: "Наушники SoundWave",
    category: "accessories",
    price: 15000,
    rating: 4,
    image:
      "assets/soundwave.jpg",
    specs: { type: "Bluetooth", battery: "30h", color: "черный" },
  },
  {
    id: 4,
    name: "Iphone 17",
    category: "smartphones",
    price: 95000,
    rating: 5,
    image:
      "assets/iphone17.jpg",
    specs: { ram: "12GB", storage: "512GB", battery: "5500mAh" },
  },
  {
    id: 5,
    name: "Apple MacBook Air",
    category: "laptops",
    price: 85000,
    rating: 4,
    image:
      "assets/macbook.jpg",
    specs: { cpu: "AMD Ryzen 7", ram: "8GB", storage: "256GB SSD" },
  },
  {
    id: 6,
    name: "USB-C кабель",
    category: "accessories",
    price: 2000,
    rating: 4,
    image:
      "assets/usbcabel.jpg",
    specs: { length: "2m", type: "USB 3.0", color: "белый" },
  },
];

class ProductsManager {
  constructor() {
    this.products = productsData;
    this.filteredProducts = [...this.products];
    this.selectedComparison = [];
    this.init();
  }

  init() {
    this.renderProducts();
    this.attachEventListeners();
    this.applyFilters();
  }

  attachEventListeners() {
    // Search
    $("#productSearch").on("keyup", () => this.applyFilters());

    // Category filters
    $('[data-filter="category"]').on("change", () => this.applyFilters());

    // Price filter
    $("#priceFilter").on("input", (e) => {
      $("#priceValue").text(e.target.value);
      this.applyFilters();
    });

    // Rating filters
    $('[data-filter="rating"]').on("change", () => this.applyFilters());

    // Sort
    $("#sortFilter").on("change", (e) => this.sortProducts(e.target.value));

    // Reset filters
    $("#resetFilters").on("click", () => this.resetAllFilters());

    // Comparison
    $(document).on("change", ".compare-checkbox", (e) => {
      const productId = parseInt(e.target.dataset.productId);
      if (e.target.checked) {
        this.selectedComparison.push(productId);
      } else {
        this.selectedComparison = this.selectedComparison.filter(
          (id) => id !== productId
        );
      }
      this.updateComparisonUI();
    });

    $("#compareBtn").on("click", () => this.showComparison());
  }

  applyFilters() {
    const search = $("#productSearch").val().toLowerCase();
    const categories = $('[data-filter="category"]:checked')
      .map((_, el) => el.value)
      .get();
    const maxPrice = parseInt($("#priceFilter").val());
    const ratings = $('[data-filter="rating"]:checked')
      .map((_, el) => el.value)
      .get();

    this.filteredProducts = this.products.filter((product) => {
      const matchSearch = product.name.toLowerCase().includes(search);
      const matchCategory =
        categories.length === 0 || categories.includes(product.category);
      const matchPrice = product.price <= maxPrice;
      const matchRating =
        ratings.length === 0 ||
        ratings.some((r) => product.rating >= parseInt(r));

      return matchSearch && matchCategory && matchPrice && matchRating;
    });

    this.renderProducts();
    this.updateProductCount();
  }

  sortProducts(sortType) {
    switch (sortType) {
      case "price-low":
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        this.filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    this.renderProducts();
  }

  renderProducts() {
    const container = $("#productsContainer");
    container.empty();

    if (this.filteredProducts.length === 0) {
      container.html(
        '<div class="col-12"><p class="text-center text-muted">Товары не найдены</p></div>'
      );
      return;
    }

    this.filteredProducts.forEach((product) => {
      const stars = "⭐".repeat(product.rating);
      const isSelected = this.selectedComparison.includes(product.id);
      const html = `
        <div class="col">
          <div class="card h-100 shadow-sm">
            <img src="${product.image}" class="card-img-top" alt="${
        product.name
      }" />
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${product.name}</h5>
              <p class="text-muted small">${stars}</p>
              <p class="text-muted small">
                <strong>Характеристики:</strong><br>
                ${Object.entries(product.specs)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join("<br>")}
              </p>
              <div class="d-flex justify-content-between align-items-center mt-auto pt-3">
                <span class="fw-semibold fs-5 text-primary">${product.price.toLocaleString()} ₽</span>
                <a href="#" class="btn btn-sm btn-primary">Купить</a>
              </div>
              <div class="form-check mt-2">
                <input 
                  class="form-check-input compare-checkbox" 
                  type="checkbox" 
                  data-product-id="${product.id}"
                  ${isSelected ? "checked" : ""}
                />
                <label class="form-check-label">
                  Сравнить
                </label>
              </div>
            </div>
          </div>
        </div>
      `;
      container.append(html);
    });
  }

  updateProductCount() {
    $("#productCount strong").text(this.filteredProducts.length);
  }

  updateComparisonUI() {
    const count = this.selectedComparison.length;
    $("#compareCount").text(count);
    $("#compareBtn").prop("disabled", count < 2);

    const list = $("#comparisonList");
    list.empty();

    this.selectedComparison.forEach((id) => {
      const product = this.products.find((p) => p.id === id);
      list.append(`
        <div class="badge bg-primary me-2 mb-2">
          ${product.name}
          <button class="btn-close btn-close-white ms-2" data-remove-id="${id}"></button>
        </div>
      `);
    });

    $("[data-remove-id]").on("click", (e) => {
      const id = parseInt(e.target.dataset.removeId);
      this.selectedComparison = this.selectedComparison.filter(
        (pid) => pid !== id
      );
      $(`.compare-checkbox[data-product-id="${id}"]`).prop("checked", false);
      this.updateComparisonUI();
    });
  }

  showComparison() {
    const selectedProducts = this.products.filter((p) =>
      this.selectedComparison.includes(p.id)
    );
    let tableHtml =
      '<table class="table table-bordered"><thead><tr><th>Характеристика</th>';

    selectedProducts.forEach((p) => {
      tableHtml += `<th>${p.name}</th>`;
    });
    tableHtml += "</tr></thead><tbody>";

    // Get all spec keys
    const allKeys = new Set();
    selectedProducts.forEach((p) =>
      Object.keys(p.specs).forEach((k) => allKeys.add(k))
    );

    allKeys.forEach((key) => {
      tableHtml += `<tr><td><strong>${key}</strong></td>`;
      selectedProducts.forEach((p) => {
        tableHtml += `<td>${p.specs[key] || "-"}</td>`;
      });
      tableHtml += "</tr>";
    });

    tableHtml += "<tr><td><strong>Цена</strong></td>";
    selectedProducts.forEach((p) => {
      tableHtml += `<td class="text-primary fw-bold">${p.price.toLocaleString()} ₽</td>`;
    });
    tableHtml += "</tr></tbody></table>";

    $("#comparisonTable").html(tableHtml);
    new bootstrap.Modal(document.getElementById("comparisonModal")).show();
  }

  resetAllFilters() {
    $("#productSearch").val("");
    $("[data-filter]").prop("checked", false);
    $("#priceFilter").val(500000);
    $("#priceValue").text("500000");
    $("#sortFilter").val("default");
    this.applyFilters();
  }
}

$(document).ready(() => {
  new ProductsManager();
});
