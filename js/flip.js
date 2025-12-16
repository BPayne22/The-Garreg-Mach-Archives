document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    card.addEventListener("click", () => {
      card.classList.toggle("flip");

      const ageElement = card.parentElement.querySelector("#age");
      if (ageElement) {
        const baseAgeAttr = ageElement.dataset.baseAge;

        // Only adjust if a numeric base age exists
        if (baseAgeAttr) {
          const baseAge = parseInt(baseAgeAttr, 10);
          if (card.classList.contains("flip")) {
            ageElement.textContent = baseAge + 5;
          } else {
            ageElement.textContent = baseAge;
          }
        } else {
          // Leave "???" or "Secret" untouched
          ageElement.textContent = ageElement.textContent;
        }
      }
    });
  });
});