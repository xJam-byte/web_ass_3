document.addEventListener("DOMContentLoaded", function () {
  // --- Task 1: Form Validation ---
  // This code finds all forms that need validation and applies the logic.
  const formsToValidate = document.querySelectorAll(".needs-validation");

  // Loop through each form and add the submit event listener
  Array.from(formsToValidate).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        // Check if the form is valid according to HTML5 constraints (like 'required')
        if (!form.checkValidity()) {
          event.preventDefault(); // Stop the form from submitting
          event.stopPropagation(); // Stop it from bubbling up
        } else {
          event.preventDefault(); // Also stop the form from submitting on success for this demo

          // Show a success alert based on which form was submitted
          if (form.id === "subscribeForm") {
            alert("Вы успешно подписались на рассылку!");
          } else if (form.id === "checkoutForm") {
            alert("Ваш заказ успешно оформлен!");
          } else {
            alert("Форма успешно отправлена!");
          }

          // If the form is inside a modal, close the modal
          const modal = form.closest(".modal");
          if (modal) {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
          }

          // Remove validation classes and reset the form fields
          form.classList.remove("was-validated");
          form.reset();
        }

        // Add Bootstrap's validation class to show feedback messages
        form.classList.add("was-validated");
      },
      false
    );
  });

  // Находим кнопку-переключатель
  const themeChanger = document.getElementById("color-changer");
  // Находим корневой элемент <html>
  const htmlElement = document.documentElement;

  // Проверяем, что кнопка существует
  if (themeChanger) {
    // Добавляем обработчик клика
    themeChanger.addEventListener("click", () => {
      // Проверяем текущую тему
      if (htmlElement.getAttribute("data-bs-theme") === "dark") {
        // Если тема темная, меняем на светлую
        htmlElement.setAttribute("data-bs-theme", "light");
      } else {
        // Иначе — меняем на темную
        htmlElement.setAttribute("data-bs-theme", "dark");
      }
    });
  }

  // (остальной твой код для валидации формы и т.д. может оставаться здесь)
  // --- Task 5: Display Current Date and Time ---
  const datetimeElement = document.getElementById("datetime");

  // Check if the date/time element exists on the page
  if (datetimeElement) {
    function updateDateTime() {
      const now = new Date();
      // Format the date and time for Russian locale
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      datetimeElement.textContent = now.toLocaleDateString("ru-RU", options);
    }

    // Call the function once to display the time immediately
    updateDateTime();
    // Set the function to be called every minute to keep the time updated
    setInterval(updateDateTime, 1000 * 60);
  }
});

document.querySelectorAll(".blog-card h2").forEach((t) => {
  t.addEventListener("click", () => {
    const p = t.nextElementSibling;
    p.style.display = p.style.display === "none" ? "block" : "none";
  });
});

// const bg = document.createElement("button");
// bg.textContent = "Фон";
// Object.assign(bg.style, { position: "fixed", bottom: "20px", right: "20px" });
// document.body.append(bg);
// const c = ["#f0f8ff", "#fff3e0", "#e0f7fa", "#fce4ec"],
//   i = { v: 0 };
// bg.onclick = () => {
//   document.body.style.background = c[i.v++ % c.length];
// };

const d = document.createElement("div");
Object.assign(d.style, {
  position: "fixed",
  bottom: "10px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "rgba(0,0,0,0.6)",
  color: "#fff",
  padding: "4px 8px",
  borderRadius: "6px",
});
document.body.append(d);
setInterval(() => (d.textContent = new Date().toLocaleString("ru-RU")), 1000);

const p = document.createElement("div");
Object.assign(p.style, {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "none",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.6)",
});
p.innerHTML = `<div style="background:white;padding:20px;border-radius:10px;text-align:center;">
  <h3>Подписка</h3><input type="email" placeholder="Ваш email"><br><br>
  <button id="c">Закрыть</button></div>`;
document.body.append(p);
const b = document.createElement("button");
b.textContent = "Подписаться";
Object.assign(b.style, { position: "fixed", bottom: "20px", left: "20px" });
document.body.append(b);
b.onclick = () => (p.style.display = "flex");
p.querySelector("#c").onclick = () => (p.style.display = "none");

let isLight = true;

function changeTheme() {
  const body = document.body;
  const btn = document.getElementById("themeBtn");
  const color = isLight ? "#080669ff" : "#ffffff";
  const text = isLight ? "#ffffff" : "#080669ff";
  const icon = isLight ? "темная тема" : "светлая тема";

  body.style.setProperty("background-color", color, "important");
  body.style.setProperty("color", text, "important");

  btn.textContent = icon;
  isLight = !isLight;
}

document.getElementById("themeBtn").addEventListener("click", changeTheme);
