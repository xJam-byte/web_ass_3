const ElectroStoreApp = (() => {
  const STORAGE_KEY = "electrostore-preferred-theme";
  const LANGUAGE_KEY = "electrostore-language";
  const SOUND_PRESETS = {
    success: { freq: 520, type: "sine", duration: 0.32 },
    toggle: { freq: 360, type: "triangle", duration: 0.22 },
    error: { freq: 180, type: "sawtooth", duration: 0.4 },
    click: { freq: 800, type: "square", duration: 0.1 },
  };

  const AudioContextCtor =
    typeof window !== "undefined" &&
    (window.AudioContext || window.webkitAudioContext);
  const audioCtx =
    typeof AudioContextCtor === "function" ? new AudioContextCtor() : null;

  // Translation data
  const translations = {
    ru: {
      news_title: "Новости технологий",
      all_news: "Все новости",
      technology: "Технологии",
      gadgets: "Гаджеты",
      ai: "ИИ",
      greeting_title: "Персональное приветствие",
      enter_name: "Введите ваше имя",
      greet_me: "Поприветствовать меня",
      rate_products: "Оцените наши товары",
      rate_description: "Кликните на звезду, чтобы поставить оценку",
      interactive_features: "Интерактивные функции",
      time_display: "Текущее время",
      time_description: "Нажмите кнопку, чтобы увидеть текущее время",
      show_time: "Показать время",
      random_fact: "Случайный факт",
      fact_description: "Получите интересный факт о технологиях",
      get_fact: "Получить факт"
    },
    en: {
      news_title: "Technology News",
      all_news: "All News",
      technology: "Technology",
      gadgets: "Gadgets",
      ai: "AI",
      greeting_title: "Personal Greeting",
      enter_name: "Enter your name",
      greet_me: "Greet me",
      rate_products: "Rate our products",
      rate_description: "Click on a star to rate",
      interactive_features: "Interactive Features",
      time_display: "Current Time",
      time_description: "Click button to see current time",
      show_time: "Show Time",
      random_fact: "Random Fact",
      fact_description: "Get an interesting fact about technology",
      get_fact: "Get Fact"
    },
    kk: {
      news_title: "Технология жаңалықтары",
      all_news: "Барлық жаңалықтар",
      technology: "Технология",
      gadgets: "Гаджеттер",
      ai: "ЖИ",
      greeting_title: "Жеке сәлемдеме",
      enter_name: "Атыңызды енгізіңіз",
      greet_me: "Мені сәлемдеңіз",
      rate_products: "Біздің өнімдерді бағалаңыз",
      rate_description: "Баға беру үшін жұлдызға басыңыз",
      interactive_features: "Интерактивті функциялар",
      time_display: "Ағымдағы уақыт",
      time_description: "Ағымдағы уақытты көру үшін батырманы басыңыз",
      show_time: "Уақытты көрсету",
      random_fact: "Кездейсоқ факт",
      fact_description: "Технология туралы қызықты факт алыңыз",
      get_fact: "Факт алу"
    }
  };

  // News data
  const newsData = {
    all: [
      { id: 1, title: "Новый iPhone с революционными камерами", category: "tech", image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=400&auto=format&fit=crop", content: "Apple представила новую линейку iPhone с улучшенными камерами и процессором A17 Pro." },
      { id: 2, title: "ИИ в повседневной жизни", category: "ai", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=400&auto=format&fit=crop", content: "Искусственный интеллект становится неотъемлемой частью нашей повседневной жизни." },
      { id: 3, title: "Умные часы нового поколения", category: "gadgets", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop", content: "Новое поколение умных часов с расширенными возможностями мониторинга здоровья." },
      { id: 4, title: "Квантовые компьютеры", category: "tech", image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=400&auto=format&fit=crop", content: "Прорыв в области квантовых вычислений открывает новые возможности." },
      { id: 5, title: "VR-гарнитуры будущего", category: "gadgets", image: "https://images.unsplash.com/photo-1593305625442-30a8c232ec69?q=80&w=400&auto=format&fit=crop", content: "Виртуальная реальность становится все более реалистичной и доступной." },
      { id: 6, title: "Машинное обучение в медицине", category: "ai", image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=400&auto=format&fit=crop", content: "ИИ помогает врачам ставить более точные диагнозы." }
    ]
  };

  // Random facts about technology
  const techFacts = [
    "Первый компьютер весил 27 тонн и занимал площадь 167 квадратных метров.",
    "Смартфон в вашем кармане мощнее компьютеров, которые отправили человека на Луну.",
    "Интернет состоит из более чем 1 миллиарда веб-сайтов.",
    "Каждый день в мире создается 2.5 квинтиллиона байт данных.",
    "Первый email был отправлен в 1971 году.",
    "Средний человек проверяет свой телефон 150 раз в день.",
    "Квантовые компьютеры могут решать задачи за секунды, на которые обычным компьютерам потребовались бы миллионы лет."
  ];

  const api = {
    init() {
      this.initValidation();
      this.initThemeToggles();
      this.initLiveDateTime();
      this.initBlogInteractions();
      this.initLanguageSelector();
      this.initNewsFeed();
      this.initGreeting();
      this.initRatingSystem();
      this.initInteractiveFeatures();
      this.initKeyboardNavigation();
    },

    initValidation() {
      const forms = document.querySelectorAll("form.needs-validation");
      if (!forms.length) return;

      forms.forEach((form) => {
        const successMessage =
          form.dataset.successMessage || "Форма успешно отправлена!";
        const shouldReset = form.dataset.resetOnSubmit !== "false";

        form.addEventListener(
          "submit",
          (event) => {
            if (!form.checkValidity()) {
              event.preventDefault();
              event.stopPropagation();
              playSound("error");
            } else {
              event.preventDefault();

              if (typeof bootstrap !== "undefined") {
                const modal = form.closest(".modal");
                if (modal) {
                  bootstrap.Modal.getOrCreateInstance(modal).hide();
                }
              }

              showNotification(successMessage, "success");

              if (shouldReset) {
                form.reset();
                form.classList.remove("was-validated");
              }
            }

            form.classList.add("was-validated");
          },
          false
        );

        form.addEventListener("reset", () => {
          form.classList.remove("was-validated");
        });
      });
    },

    initThemeToggles() {
      const toggles = document.querySelectorAll("[data-theme-toggle]");
      if (!toggles.length) return;

      const root = document.documentElement;
      const storedTheme = localStorage.getItem(STORAGE_KEY);

      if (storedTheme) {
        root.setAttribute("data-bs-theme", storedTheme);
      }

      const syncToggleText = () => {
        const currentTheme =
          root.getAttribute("data-bs-theme") === "dark" ? "dark" : "light";

        toggles.forEach((btn) => {
          btn.setAttribute("aria-pressed", currentTheme === "dark");

          const targetTheme = currentTheme === "light" ? "dark" : "light";
          const labelKey =
            targetTheme === "dark" ? "themeLabelDark" : "themeLabelLight";
          const iconKey =
            targetTheme === "dark" ? "themeIconDark" : "themeIconLight";

          const label = btn.dataset[labelKey];
          const icon = btn.dataset[iconKey];

          if (label || icon) {
            btn.textContent = `${icon ? `${icon} ` : ""}${label || ""}`.trim();
          }
        });
      };

      syncToggleText();

      toggles.forEach((btn) => {
        btn.addEventListener("click", () => {
          const currentTheme =
            root.getAttribute("data-bs-theme") === "dark" ? "dark" : "light";
          const nextTheme = currentTheme === "dark" ? "light" : "dark";

          root.setAttribute("data-bs-theme", nextTheme);
          localStorage.setItem(STORAGE_KEY, nextTheme);
          syncToggleText();
          playSound("toggle");
        });
      });
    },

    initLiveDateTime() {
      const nodes = Array.from(
        document.querySelectorAll("[data-live-datetime]")
      );
      const fallback = document.getElementById("datetime");

      if (fallback && !nodes.includes(fallback)) {
        nodes.push(fallback);
      }

      if (!nodes.length) return;

      const getOptions = (mode) => {
        switch (mode) {
          case "date":
            return { year: "numeric", month: "long", day: "numeric" };
          case "time":
            return { hour: "2-digit", minute: "2-digit" };
          case "seconds":
            return { hour: "2-digit", minute: "2-digit", second: "2-digit" };
          default:
            return {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            };
        }
      };

      const update = () => {
        const now = new Date();
        nodes.forEach((node) => {
          const mode = node.dataset.liveDatetime || "datetime";
          node.textContent = now.toLocaleString("ru-RU", getOptions(mode));
        });
      };

      update();

      const requiresSeconds = nodes.some(
        (node) => (node.dataset.liveDatetime || "").includes("seconds")
      );

      const interval = requiresSeconds ? 1000 : 60_000;
      setInterval(update, interval);
    },

    initBlogInteractions() {
      const headings = document.querySelectorAll(".blog-card h2");
      if (!headings.length) return;

      headings.forEach((heading) => {
        const excerpt = heading.nextElementSibling;
        if (!excerpt) return;

        heading.setAttribute("role", "button");
        heading.setAttribute("tabindex", "0");
        heading.setAttribute("aria-expanded", "true");

        const toggle = () => {
          const isHidden = excerpt.hasAttribute("hidden");
          if (isHidden) {
            excerpt.removeAttribute("hidden");
            heading.setAttribute("aria-expanded", "true");
          } else {
            excerpt.setAttribute("hidden", "");
            heading.setAttribute("aria-expanded", "false");
          }
          playSound("toggle");
        };

        heading.addEventListener("click", toggle);
        heading.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle();
          }
        });
      });
    },

    // Language Selector Implementation
    initLanguageSelector() {
      const langButtons = document.querySelectorAll('[data-lang]');
      if (!langButtons.length) return;

      const currentLang = localStorage.getItem(LANGUAGE_KEY) || 'ru';
      this.setLanguage(currentLang);

      langButtons.forEach(button => {
        button.addEventListener('click', () => {
          const lang = button.dataset.lang;
          this.setLanguage(lang);
          localStorage.setItem(LANGUAGE_KEY, lang);
          playSound('click');
        });
      });
    },

    setLanguage(lang) {
      // Update active button
      document.querySelectorAll('[data-lang]').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) {
          btn.classList.add('active');
        }
      });

      // Update translations
      const langData = translations[lang] || translations.ru;
      document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        if (langData[key]) {
          element.textContent = langData[key];
        }
      });

      // Update placeholders
      document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.dataset.translatePlaceholder;
        if (langData[key]) {
          element.placeholder = langData[key];
        }
      });
    },

    // News Feed Implementation
    initNewsFeed() {
      const newsContainer = document.getElementById('newsContainer');
      const categoryButtons = document.querySelectorAll('[data-category]');
      
      if (!newsContainer || !categoryButtons.length) return;

      // Load initial news
      this.loadNews('all');

      categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
          const category = button.dataset.category;
          
          // Update active button
          categoryButtons.forEach(btn => {
            btn.classList.remove('active', 'btn-primary');
            btn.classList.add('btn-outline-primary');
          });
          button.classList.add('active', 'btn-primary');
          button.classList.remove('btn-outline-primary');

          this.loadNews(category);
          playSound('click');
        });
      });
    },

    loadNews(category) {
      const newsContainer = document.getElementById('newsContainer');
      if (!newsContainer) return;

      let news = newsData.all;
      if (category !== 'all') {
        news = newsData.all.filter(item => item.category === category);
      }

      newsContainer.innerHTML = '';
      
      news.forEach((item, index) => {
        const newsCard = document.createElement('div');
        newsCard.className = 'col';
        newsCard.innerHTML = `
          <div class="card h-100 shadow-sm news-card" style="animation-delay: ${index * 0.1}s">
            <img src="${item.image}" class="card-img-top" alt="${item.title}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${item.title}</h5>
              <p class="card-text flex-grow-1">${item.content}</p>
              <button class="btn btn-outline-primary mt-auto" onclick="ElectroStoreApp.showFullNews(${item.id})">
                Читать далее
              </button>
            </div>
          </div>
        `;
        newsContainer.appendChild(newsCard);
      });
    },

    showFullNews(newsId) {
      const news = newsData.all.find(item => item.id === newsId);
      if (!news) return;

      const modal = document.createElement('div');
      modal.className = 'modal fade';
      modal.innerHTML = `
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${news.title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <img src="${news.image}" class="img-fluid mb-3" alt="${news.title}">
              <p>${news.content}</p>
            </div>
          </div>
        </div>
      `;
      
      document.body.appendChild(modal);
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
      
      modal.addEventListener('hidden.bs.modal', () => {
        modal.remove();
      });
    },

    // Dynamic Greeting Implementation
    initGreeting() {
      const greetButton = document.getElementById('greetButton');
      const userNameInput = document.getElementById('userName');
      const greetingMessage = document.getElementById('greetingMessage');
      const greetingText = document.getElementById('greetingText');

      if (!greetButton || !userNameInput || !greetingMessage || !greetingText) return;

      greetButton.addEventListener('click', () => {
        const name = userNameInput.value.trim();
        if (!name) {
          showNotification('Пожалуйста, введите ваше имя', 'error');
          return;
        }

        const currentHour = new Date().getHours();
        let greeting;
        
        if (currentHour < 12) {
          greeting = `Доброе утро, ${name}! ☀️`;
        } else if (currentHour < 18) {
          greeting = `Добрый день, ${name}! 🌞`;
        } else {
          greeting = `Добрый вечер, ${name}! 🌙`;
        }

        greetingText.textContent = greeting;
        greetingMessage.style.display = 'block';
        greetingMessage.classList.add('bounce-in');
        
        playSound('success');
        
        // Animate the greeting
        setTimeout(() => {
          greetingMessage.style.transform = 'scale(1.05)';
          setTimeout(() => {
            greetingMessage.style.transform = 'scale(1)';
          }, 200);
        }, 100);
      });
    },

    // Rating System Implementation
    initRatingSystem() {
      const ratingStars = document.querySelectorAll('.rating-stars');
      
      ratingStars.forEach(starContainer => {
        const stars = starContainer.querySelectorAll('i');
        const product = starContainer.dataset.product;
        
        stars.forEach((star, index) => {
          star.addEventListener('click', () => {
            const rating = index + 1;
            
            // Update visual state
            stars.forEach((s, i) => {
              if (i < rating) {
                s.classList.add('active');
                s.classList.remove('bi-star');
                s.classList.add('bi-star-fill');
              } else {
                s.classList.remove('active');
                s.classList.remove('bi-star-fill');
                s.classList.add('bi-star');
              }
            });

            // Store rating
            localStorage.setItem(`rating_${product}`, rating);
            
            // Show feedback
            showNotification(`Спасибо за оценку ${rating} звезд!`, 'success');
            playSound('success');
            
            // Add animation
            starContainer.style.transform = 'scale(1.1)';
            setTimeout(() => {
              starContainer.style.transform = 'scale(1)';
            }, 200);
          });

          star.addEventListener('mouseenter', () => {
            stars.forEach((s, i) => {
              if (i <= index) {
                s.style.color = '#ffc107';
              }
            });
          });

          star.addEventListener('mouseleave', () => {
            const currentRating = parseInt(localStorage.getItem(`rating_${product}`) || '0');
            stars.forEach((s, i) => {
              if (i < currentRating) {
                s.style.color = '#ffc107';
              } else {
                s.style.color = '#dee2e6';
              }
            });
          });
        });

        // Load saved rating
        const savedRating = parseInt(localStorage.getItem(`rating_${product}`) || '0');
        if (savedRating > 0) {
          stars.forEach((s, i) => {
            if (i < savedRating) {
              s.classList.add('active');
              s.classList.remove('bi-star');
              s.classList.add('bi-star-fill');
            }
          });
        }
      });
    },

    // Interactive Features Implementation
    initInteractiveFeatures() {
      // Time display button
      const showTimeBtn = document.getElementById('showTimeBtn');
      const timeDisplay = document.getElementById('timeDisplay');
      
      if (showTimeBtn && timeDisplay) {
        showTimeBtn.addEventListener('click', () => {
          const now = new Date();
          const timeString = now.toLocaleTimeString('ru-RU');
          timeDisplay.textContent = `Текущее время: ${timeString}`;
          timeDisplay.style.display = 'block';
          timeDisplay.classList.add('fade-in');
          playSound('click');
        });
      }

      // Random fact button
      const randomFactBtn = document.getElementById('randomFactBtn');
      const factDisplay = document.getElementById('factDisplay');
      
      if (randomFactBtn && factDisplay) {
        randomFactBtn.addEventListener('click', () => {
          const randomFact = techFacts[Math.floor(Math.random() * techFacts.length)];
          factDisplay.textContent = randomFact;
          factDisplay.style.display = 'block';
          factDisplay.classList.add('slide-in-left');
          playSound('success');
        });
      }
    },

    // Keyboard Navigation Implementation
    initKeyboardNavigation() {
      // Add keyboard navigation for rating stars
      const ratingStars = document.querySelectorAll('.rating-stars');
      
      ratingStars.forEach(starContainer => {
        const stars = starContainer.querySelectorAll('i');
        
        starContainer.addEventListener('keydown', (event) => {
          const currentActive = starContainer.querySelector('.active');
          const currentIndex = currentActive ? Array.from(stars).indexOf(currentActive) : -1;
          
          switch(event.key) {
            case 'ArrowLeft':
              event.preventDefault();
              if (currentIndex > 0) {
                stars[currentIndex - 1].click();
              }
              break;
            case 'ArrowRight':
              event.preventDefault();
              if (currentIndex < stars.length - 1) {
                stars[currentIndex + 1].click();
              }
              break;
            case 'Enter':
            case ' ':
              event.preventDefault();
              if (currentActive) {
                currentActive.click();
              }
              break;
          }
        });
      });

      // Add keyboard shortcuts
      document.addEventListener('keydown', (event) => {
        // Ctrl + T for theme toggle
        if (event.ctrlKey && event.key === 't') {
          event.preventDefault();
          const themeToggle = document.querySelector('[data-theme-toggle]');
          if (themeToggle) {
            themeToggle.click();
          }
        }
        
        // Ctrl + L for language selector
        if (event.ctrlKey && event.key === 'l') {
          event.preventDefault();
          const langButtons = document.querySelectorAll('[data-lang]');
          const currentLang = localStorage.getItem(LANGUAGE_KEY) || 'ru';
          const currentIndex = Array.from(langButtons).findIndex(btn => btn.dataset.lang === currentLang);
          const nextIndex = (currentIndex + 1) % langButtons.length;
          langButtons[nextIndex].click();
        }
      });
    },
  };

  function playSound(name = "success") {
    if (!audioCtx) return;

    const preset = SOUND_PRESETS[name] || SOUND_PRESETS.success;

    if (audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = preset.type;
    oscillator.frequency.value = preset.freq;

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    const now = audioCtx.currentTime;
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      now + preset.duration
    );

    oscillator.start(now);
    oscillator.stop(now + preset.duration + 0.05);
  }

  // Advanced JavaScript Concepts Implementation
  const ProductManager = {
    products: [
      { id: 1, name: "Смартфон Pro X", price: 75000, category: "phones", rating: 0 },
      { id: 2, name: "Ноутбук UltraBook 15", price: 120000, category: "laptops", rating: 0 },
      { id: 3, name: "Наушники SoundWave", price: 15000, category: "audio", rating: 0 }
    ],

    // Higher-order function: filter products by category
    filterByCategory(category) {
      return this.products.filter(product => product.category === category);
    },

    // Higher-order function: map products to display format
    mapToDisplayFormat(products) {
      return products.map(product => ({
        ...product,
        displayPrice: `${product.price.toLocaleString()} ₽`,
        isExpensive: product.price > 50000
      }));
    },

    // Higher-order function: forEach to update ratings
    updateRatings(ratings) {
      ratings.forEach((rating, index) => {
        if (this.products[index]) {
          this.products[index].rating = rating;
        }
      });
    },

    // Method using objects and arrays
    getProductStats() {
      const totalProducts = this.products.length;
      const totalValue = this.products.reduce((sum, product) => sum + product.price, 0);
      const averageRating = this.products.reduce((sum, product) => sum + product.rating, 0) / totalProducts;
      
      return {
        totalProducts,
        totalValue,
        averageRating: averageRating.toFixed(1),
        categories: [...new Set(this.products.map(p => p.category))]
      };
    }
  };

  // Animation Manager using objects and methods
  const AnimationManager = {
    animations: {
      fadeIn: 'fade-in',
      slideInLeft: 'slide-in-left',
      slideInRight: 'slide-in-right',
      bounceIn: 'bounce-in'
    },

    applyAnimation(element, animationType, duration = 500) {
      if (!element || !this.animations[animationType]) return;
      
      element.classList.add(this.animations[animationType]);
      
      setTimeout(() => {
        element.classList.remove(this.animations[animationType]);
      }, duration);
    },

    // Chain animations
    chainAnimations(elements, animationType, delay = 100) {
      elements.forEach((element, index) => {
        setTimeout(() => {
          this.applyAnimation(element, animationType);
        }, index * delay);
      });
    }
  };

  function showNotification(message, tone = "success") {
    let container = document.getElementById("feedback-messages");

    if (!container) {
      container = document.createElement("div");
      container.id = "feedback-messages";
      Object.assign(container.style, {
        position: "fixed",
        top: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "1080",
        width: "min(90vw, 420px)",
        pointerEvents: "none",
      });
      document.body.append(container);
    }

    const alert = document.createElement("div");
    alert.className = `alert alert-${tone} shadow-sm fade show`;
    alert.setAttribute("role", "status");
    alert.textContent = message;

    container.append(alert);

    const removeAfter = 3200;
    setTimeout(() => {
      alert.classList.remove("show");
      setTimeout(() => {
        alert.remove();
        if (!container.childElementCount) {
          container.remove();
        }
      }, 200);
    }, removeAfter);

    playSound(tone === "error" ? "error" : "success");
  }

  // Export all functions and objects
  api.playSound = playSound;
  api.showNotification = showNotification;
  api.ProductManager = ProductManager;
  api.AnimationManager = AnimationManager;
  api.showFullNews = api.showFullNews;

  return api;
})();

// Make functions globally available
window.ElectroStoreApp = ElectroStoreApp;
window.ProductManager = ElectroStoreApp.ProductManager;
window.AnimationManager = ElectroStoreApp.AnimationManager;

document.addEventListener("DOMContentLoaded", () => {
  ElectroStoreApp.init();
  
  // Initialize advanced features
  console.log("Product Stats:", ProductManager.getProductStats());
  
  // Demonstrate higher-order functions
  const expensiveProducts = ProductManager.mapToDisplayFormat(
    ProductManager.products.filter(p => p.price > 50000)
  );
  console.log("Expensive Products:", expensiveProducts);
});
