"use strict";

// Functions on page load
document.addEventListener("DOMContentLoaded", function () {
  // Toggle the Page Load animation
  document.querySelector(".loader-trigger").style.display = "none";

  // Zebra pattern for the tables
  const visibleRows = document.querySelectorAll("tbody > tr:not(.hidden)");

  for (let i = 0; i < visibleRows.length; i++) {
    if (i % 2 !== 0) {
      const rowCells = visibleRows[i].children;

      for (const cell of rowCells) {
        cell.classList.add("zebrado");
      }
    }
  }

  // Replace texts
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

  // Toggle "inativa" schools on the dashboard
  const ativa = document.getElementById("ativa");

  if (ativa) {
    ativa.addEventListener("change", function () {
      const rows = document.querySelectorAll("#escolas tbody tr");

      if (this.checked) {
        for (const row of rows) {
          if (row.classList.contains("hidden")) {
            row.classList.remove("hidden");
          }
        }
      } else {
        for (const row of rows) {
          if (row.classList.contains("inativa")) {
            row.classList.add("hidden");
          }
        }
      }
    });
  }
});
