"use strict";

// Define variables
let email = $("#email");
let password = $("#password");
let nome = $("#nome");
let bairro = $("#bairro");
let newPassword = $("#newPassword");
let confirm = $("#confirm");
let emailError = $("#emailError");
let passwordError = $("#passwordError");
let nomeError = $("#nomeError");
let bairroError = $("#bairroError");
let confirmError = $("#confirmError");

if ($("#name")) nome = $("#name");
if ($("#verifyPassword")) confirm = $("#verifyPassword");

// Validation e message toggle
if (email.length > 0) {
  email[0].addEventListener(
    "input",
    function () {
      if (email[0].validity.valid) {
        emailError.text("");
        emailError.removeClass("block").addClass("hidden");
      } else {
        emailError.text("Digite um e-mail válido.");
        emailError.removeClass("hidden").addClass("block");
      }
    },
    false
  );
}

if (password.length > 0) {
  password[0].addEventListener(
    "input",
    function () {
      if (password[0].validity.valid) {
        passwordError.text("");
        passwordError.removeClass("block").addClass("hidden");
      } else {
        passwordError.text("Senha precisa ter mais de 4 caracteres");
        passwordError.removeClass("hidden").addClass("block");
      }
    },
    false
  );
}

if (nome.length > 0) {
  nome[0].addEventListener(
    "input",
    function () {
      if (nome[0].validity.valid) {
        nomeError.text("");
        nomeError.removeClass("block").addClass("hidden");
      } else {
        nomeError.text("Nome precisa ter 3 caracteres ou mais.");
        nomeError.removeClass("hidden").addClass("block");
      }
    },
    false
  );
}

if (bairro.length > 0) {
  bairro[0].addEventListener(
    "input",
    function () {
      if (bairro[0].validity.valid) {
        bairroError.text("");
        bairroError.removeClass("block").addClass("hidden");
      } else {
        bairroError.text("Bairro precisa ter 3 caracteres ou mais.");
        bairroError.removeClass("hidden").addClass("block");
      }
    },
    false
  );
}

if (newPassword.length > 0) {
  newPassword[0].addEventListener(
    "input",
    function () {
      if (newPassword[0].validity.valid) {
        passwordError.text("");
        passwordError.removeClass("block").addClass("hidden");
      } else {
        passwordError.text("Senha precisa ter 3 caracteres ou mais.");
        passwordError.removeClass("hidden").addClass("block");
      }
    },
    false
  );
}

if (confirm.length > 0) {
  confirm[0].addEventListener(
    "input",
    function () {
      if (confirm[0].validity.valid) {
        confirmError.text("");
        confirmError.removeClass("block").addClass("hidden");
      } else {
        confirmError.text("Confirmação precisa ter 3 caracteres ou mais.");
        confirmError.removeClass("hidden").addClass("block");
      }
    },
    false
  );
}
