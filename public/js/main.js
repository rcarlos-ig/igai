"use strict";

// Get all text nodes in a given container
// Source: http://stackoverflow.com/a/4399718/560114
function getTextNodesIn(node, includeWhitespaceNodes) {
  let textNodes = [],
    nonWhitespaceMatcher = /\S/;

  function getTextNodes(node) {
    if (node.nodeType == 3) {
      if (includeWhitespaceNodes || nonWhitespaceMatcher.test(node.nodeValue)) {
        textNodes.push(node);
      }
    } else {
      for (let i = 0, len = node.childNodes.length; i < len; ++i) {
        getTextNodes(node.childNodes[i]);
      }
    }
  }

  getTextNodes(node);
  return textNodes;
}

// Replace every ocurrency of a string in the document Body
function replaceAllStrings(str, newString) {
  const textNodes = getTextNodesIn($("body")[0], false);
  const re = new RegExp(`\\b${str}\\b`, "g");

  let i = textNodes.length;
  let node;

  while (i--) {
    node = textNodes[i];
    node.textContent = node.textContent.replace(re, newString);
  }
}

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

  // Zebra pattern for the tables
  const escolas = $("#escolas > tbody > tr").not(".hidden");

  escolas.each(function (index) {
    if (index % 2 !== 0) {
      $(this).children("td").addClass("zebrado");
    }
  });

  // Replace defined strings on the document body
  replaceAllStrings("instalacoes", "instalações");
  replaceAllStrings("eletricas", "elétricas");
  replaceAllStrings("hidraulicas", "hidráulicas");
  replaceAllStrings("sanitarias", "sanitárias");
  replaceAllStrings("impermeabilizacao", "impermeabilização");
  replaceAllStrings("predio", "prédio");
  replaceAllStrings("reservatorio", "reservatório");
  replaceAllStrings("cercaTela", "Cerca/Tela");
  replaceAllStrings("iluminacao", "iluminação");
  replaceAllStrings("calcada", "calçada");

  // Set the audit button route based on the selected options
  if ($("#auditForm")) {
    const selectSort = $("select[id^='auditSort']");
    const selectOrder = $("#auditOrder");

    selectSort.on("change", function () {
      let sort = $(this).children().filter(":selected").val();
      let order = $("#auditOrder").children().filter(":selected").val();

      $("#auditForm").attr("action", "/audit?sort=" + sort + "&order=" + order);
    });

    selectOrder.on("change", function () {
      let sort = $("#auditSort").children().filter(":selected").val();
      let order = $(this).children().filter(":selected").val();

      $("#auditForm").attr("action", "/audit?sort=" + sort + "&order=" + order);
    });
  }

  // Trigger the Page Load animation
  $(".button[id!='logoutModalClose'], a").on("click", function () {
    $(".loader-trigger").removeClass("hidden");
  })

  // Logout Modal
  $("#logoutModalOpen").on("click", function () {
    $(".logout-modal-hide").removeClass("hidden");
  })

  $("#logoutModalClose").on("click", function () {
    $(".logout-modal-hide").addClass("hidden");
  })
});
