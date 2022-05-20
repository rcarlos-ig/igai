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
    item.innerHTML = item.innerHTML.replace(/cercaTela/gi, "Cerca/Tela");
    item.innerHTML = item.innerHTML.replace(/eletricas/gi, "elétricas");
    item.innerHTML = item.innerHTML.replace(/hidraulicas/gi, "hidráulicas");
    item.innerHTML = item.innerHTML.replace(/sanitarias/gi, "sanitárias");
    item.innerHTML = item.innerHTML.replace(/predio/gi, "prédio");
    item.innerHTML = item.innerHTML.replace(/reservatorio/gi, "reservatório");
    item.innerHTML = item.innerHTML.replace(/calcada/gi, "calçada");
  }
});

// jQuery functions on Page Load
$(function () {
  // Hide and show "inactive" schools on the Dashboard page
  if ($("#ativa")) {
    const checkbox = $("#ativa");

    checkbox.on("change", function () {
      if (checkbox.is(":checked")) {
        $("#escolas tbody tr").each(function () {
          if ($(this).hasClass("hidden")) {
            $(this).fadeIn(400).removeClass("hidden").addClass("inativa");
          }
        });
      } else {
        $("#escolas tbody tr").each(function () {
          if ($(this).hasClass("inativa")) {
            $(this).fadeOut(400).removeClass("inativa").addClass("hidden");
          }
        });
      }
    });
  }
});
