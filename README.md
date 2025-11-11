# ElectroStore — Final Project (Frontend)



## Команда и роли
- Nurkasym — каталог (products.html), поиск/фильтры, сравнение.
- Abzal — профиль (profile.html).
- Mirzan — карточки товара (product-detail.html), корзина/чекаут.
- Abylaikhan — главная/о нас/контакты, анимации, тема и i18n.

## Страницы (минимум по 2 на участника)
- Nurkasym: products.html, compare.html
- Abzal: login.html, signup.html, profile.html
- Mirzan: product-detail.html, cart.html, checkout.html
- Abylaikhan: index.html, about.html, contact.html, gallery.html

## Соответствие требованиям
1) Responsiveness (10) — Bootstrap 5 Grid + кастомные медиазапросы (css/style.css).  
2) Hosting (5) — задеплоено на Netlify (ссылка выше).  
3) Light/Dark + LocalStorage (5) — переключатель [data-theme-toggle], ключ: theme = "light"|"dark"; применяется к html[data-bs-theme].  
4) Design (25) — единые отступы/радиусы/тени, контраст проверен, нет “пустых” элементов.  
5) Enhanced JS (25)  
   - Search/Filter: по названию/категориям/цене/рейтингу в каталоге.  
     - Ключи: lastSearch, lastFilters (восстановление при перезагрузке).  
   - Все кнопки работают: корзина/удаление/сброс фильтров/сравнение/пагинация.  
6) Creative Animation (10) — hover-эффект на карточках (zoom), анимированные кнопки (shadow/ripple), SVG-иконки с небольшим transform.  
7) External API (15) — Fake Store API для каталога:  
   - GET https://fakestoreapi.com/products — список товаров  
   - GET https://fakestoreapi.com/products/categories — категории  
   - Рендер в products.html, сохранение результатов в localStorage.fetchedAt и localStorage.productsCache.  
   *(Фолбэк: локальные данные при ошибке сети.)*  
8) Presentation (5) — каждый участник демонстрирует свои страницы и код.

## Как запустить локально
1. Открой index.html (или Live Server).  
2. Интернет-доступ обязателен для API/Bootstrap CDN.  
3. Для GitHub Pages/Netlify — просто залей репо.

## Технологии
- HTML5, CSS3, Bootstrap 5
- Vanilla JS (ES6+), Fetch API, LocalStorage
- SVG/Bootstrap Icons

## Ключи LocalStorage
- theme — "light"/"dark"  
- users, currentUser — авторизация  
- cart — товары в корзине  
- lastSearch, lastFilters — состояние каталога  
- productsCache, fetchedAt — кэш API

## Валидация (кратко)
- Email: базовый RFC-паттерн  
- Пароль: ≥8, (?=.*[a-z])(?=.*[A-Z])(?=.*\d)  
- Телефон: ^\+7\d{10}$  
- Required: HTML5 + JS-подсказки

## Чек-лист перед сдачей
- [ ] Сайт открывается по публичной ссылке  
- [ ] Тёмная/светлая темы сохраняются  
- [ ] Поиск/фильтры/сравнение — работают и сохраняются  
- [ ] API грузится; при оффлайне — фолбэк  
- [ ] Все кнопки и формы — без “заглушек”  
- [ ] README обновлён (ссылки/роли/фичи)

## Известные ограничения
- Данные API — публичные, могут меняться
