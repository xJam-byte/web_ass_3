const galleryImages = [
  {
    id: 1,
    title: "Смартфон Pro X",
    category: "phones",
    image:
      "assets/samsung.jpg",
    description: "Флагманский смартфон с прекрасной камерой",
  },
  {
    id: 2,
    title: "Ноутбук UltraBook",
    category: "laptops",
    image:
      "assets/ultrabook.jpg",
    description: "Тонкий и лёгкий ноутбук для работы",
  },
  {
    id: 3,
    title: "Наушники SoundWave",
    category: "accessories",
    image:
      "assets/soundwave.jpg",
    description: "Высокое качество звука с активным шумоподавлением",
  },
  {
    id: 4,
    title: "Смартфон Ultra Max",
    category: "phones",
    image:
      "assets/smartphone.jpeg",
    description: "Мощный смартфон с батареей 5500 мАч",
  },
  {
    id: 5,
    title: "Apple MacBook Air",
    category: "laptops",
    image:
      "assets/macbook.jpg",
    description: "Надёжный ноутбук для профессионалов",
  },
  {
    id: 6,
    title: "USB-C кабель",
    category: "accessories",
    image:
      "assets/usbcabel.jpg",
    description: "Высокоскоростной кабель USB 3.0",
  },
  {
    id: 8,
    title: "Смартфон Mini",
    category: "phones",
    image:
      "assets/iphone17.jpg",
    description: "Компактный смартфон с отличным экраном",
  },
];

class GalleryManager {
  constructor() {
    this.images = galleryImages;
    this.filteredImages = [...this.images];
    this.init();
  }

  init() {
    this.renderGallery();
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Search
    $("#gallerySearch").on("keyup", () => this.filterGallery());

    // Category filter
    $("#galleryFilter").on("change", () => this.filterGallery());

    // Highlight search
    $("#highlightSearch").on("keyup", () => this.highlightText());

    // Image click
    $(document).on("click", ".gallery-item", (e) => {
      const imageId = $(e.currentTarget).data("image-id");
      this.showImage(imageId);
    });
  }

  filterGallery() {
    const searchText = $("#gallerySearch").val().toLowerCase();
    const selectedCategory = $("#galleryFilter").val();

    this.filteredImages = this.images.filter((image) => {
      const matchSearch =
        image.title.toLowerCase().includes(searchText) ||
        image.description.toLowerCase().includes(searchText);
      const matchCategory =
        selectedCategory === "all" || image.category === selectedCategory;

      return matchSearch && matchCategory;
    });

    this.renderGallery();
  }

  renderGallery() {
    const container = $("#galleryContainer");
    container.empty();

    if (this.filteredImages.length === 0) {
      container.html(
        '<div class="col-12"><p class="text-center text-muted">Изображения не найдены</p></div>'
      );
      return;
    }

    this.filteredImages.forEach((image) => {
      const html = `
        <div class="col">
          <div class="card h-100 shadow-sm gallery-item cursor-pointer" data-image-id="${image.id}">
            <img src="${image.image}" class="card-img-top" alt="${image.title}" style="height: 250px; object-fit: cover; cursor: pointer;" />
            <div class="card-body">
              <h5 class="card-title gallery-title">${image.title}</h5>
              <p class="card-text gallery-description text-muted small">${image.description}</p>
            </div>
          </div>
        </div>
      `;
      container.append(html);
    });
  }

  highlightText() {
    const searchText = $("#highlightSearch").val().toLowerCase();

    if (!searchText) {
      // Remove all highlights
      $(".gallery-title, .gallery-description").each(function () {
        const originalText = $(this).data("original-text") || $(this).text();
        $(this).html(originalText).removeData("original-text");
      });
      return;
    }

    $(".gallery-title, .gallery-description").each(function () {
      const originalText = $(this).data("original-text") || $(this).text();
      $(this).data("original-text", originalText);

      const regex = new RegExp(`(${searchText})`, "gi");
      const highlightedText = originalText.replace(
        regex,
        '<mark style="background-color: yellow; color: black;">$1</mark>'
      );
      $(this).html(highlightedText);
    });
  }

  showImage(imageId) {
    const image = this.images.find((img) => img.id === imageId);
    if (image) {
      $("#modalTitle").text(image.title);
      $("#modalImage").attr("src", image.image).attr("alt", image.title);
      $("#modalDescription").text(image.description);
      new bootstrap.Modal(document.getElementById("imageModal")).show();
    }
  }
}

$(document).ready(() => {
  new GalleryManager();
});
