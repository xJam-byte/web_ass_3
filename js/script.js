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

  // --- Task 4: Change Background Color ---
  const colorChanger = document.getElementById("color-changer");

  // Check if the color changer button exists on the page
  if (colorChanger) {
    // A predefined list of background colors to cycle through
    const colors = ["#f8f9fa", "#e9ecef", "#6c757d", "#495057", "#343a40"];
    const body = document.body;
    let currentIndex = 0;

    // Add a click event listener to the button
    colorChanger.addEventListener("click", () => {
      // Move to the next color in the array, looping back to the start if at the end
      currentIndex = (currentIndex + 1) % colors.length;
      body.style.transition = "background-color 0.5s ease"; // Add a smooth transition
      body.style.backgroundColor = colors[currentIndex]; // Apply the new color
    });
  }

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
