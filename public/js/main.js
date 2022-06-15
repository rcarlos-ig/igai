"use strict";

// Replace texts
function replaceStrings() {
  const replaceableElements = document.querySelectorAll(".replace");

  for (const item of replaceableElements) {
    item.innerHTML = item.innerHTML.replace(/coes/gi, "ções");
    item.innerHTML = item.innerHTML.replace(/cao/gi, "ção");
    item.innerHTML = item.innerHTML.replace(/codigo/gi, "código");
    item.innerHTML = item.innerHTML.replace(/cercaTela/gi, "Cerca/Tela");
    item.innerHTML = item.innerHTML.replace(/eletricas/gi, "elétricas");
    item.innerHTML = item.innerHTML.replace(/hidraulicas/gi, "hidráulicas");
    item.innerHTML = item.innerHTML.replace(/sanitarias/gi, "sanitárias");
    item.innerHTML = item.innerHTML.replace(/predio/gi, "prédio");
    item.innerHTML = item.innerHTML.replace(/reservatorio/gi, "reservatório");
    item.innerHTML = item.innerHTML.replace(/calcada/gi, "calçada");
  }
}

// Toggle "inativa" schools on the dashboard
function inativasToggle() {
  const ativa = document.getElementById("ativa");

  if (ativa) {
    ativa.addEventListener("change", function () {
      const table = Tabulator.findTable("#tabulatorTable");

      if (this.checked) {
        for (const row of table[0].rowManager.rows) {
          if (!row.data.ativa) row.getElement().classList.remove("hidden");
        }
      } else {
        for (const row of table[0].rowManager.rows) {
          if (!row.data.ativa) row.getElement().classList.add("hidden");
        }
      }
    });
  }
}

// Functions on page load
document.addEventListener("DOMContentLoaded", function () {
  // Toggle the Page Load animation
  document.querySelector(".loader-trigger").style.display = "none";

  // Replace texts
  replaceStrings();

  // Toggle "inativa" schools on the dashboard
  inativasToggle();
});
