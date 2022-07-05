"use strict";

// Define variables
let email = document.getElementById("email");
let password = document.getElementById("password");
let nome = document.getElementById("nome");
let bairro = document.getElementById("bairro");
let ocupacao = document.getElementById("ocupacao");
let newPassword = document.getElementById("newPassword");
let confirmation = document.getElementById("confirm");
let emailError = document.getElementById("emailError");
let passwordError = document.getElementById("passwordError");
let nomeError = document.getElementById("nomeError");
let bairroError = document.getElementById("bairroError");
let ocupacaoError = document.getElementById("ocupacaoError");
let confirmError = document.getElementById("confirmError");

if (document.getElementById("name")) nome = document.getElementById("name");
if (document.getElementById("verifyPassword"))
  confirmation = document.getElementById("verifyPassword");

// Validation e message toggle
if (email) {
  email.addEventListener(
    "input",
    function () {
      if (email.value.length === 0 || email.validity.valid) {
        emailError.style.visibility = "hidden";
      } else {
        emailError.style.visibility = "visible";
      }
    },
    false
  );
}

if (password) {
  password.addEventListener(
    "input",
    function () {
      if (password.value.length === 0 || password.validity.valid) {
        passwordError.style.visibility = "hidden";
      } else {
        passwordError.style.visibility = "visible";
      }
    },
    false
  );
}

if (nome) {
  nome.addEventListener(
    "input",
    function () {
      if (nome.value.length === 0 || nome.validity.valid) {
        nomeError.style.visibility = "hidden";
      } else {
        nomeError.style.visibility = "visible";
      }
    },
    false
  );
}

if (bairro) {
  bairro.addEventListener(
    "input",
    function () {
      if (bairro.value.length === 0 || bairro.validity.valid) {
        bairroError.style.visibility = "hidden";
      } else {
        bairroError.style.visibility = "visible";
      }
    },
    false
  );
}

if (ocupacao) {
  ocupacao.addEventListener(
    "input",
    function () {
      if (ocupacao.value.length === 0 || ocupacao.validity.valid) {
        ocupacaoError.style.visibility = "hidden";
      } else {
        ocupacaoError.style.visibility = "visible";
      }
    },
    false
  );
}

if (newPassword) {
  newPassword.addEventListener(
    "input",
    function () {
      if (newPassword.value.length === 0 || newPassword.validity.valid) {
        passwordError.style.visibility = "hidden";
      } else {
        passwordError.style.visibility = "visible";
      }
    },
    false
  );
}

if (confirmation) {
  confirmation.addEventListener(
    "input",
    function () {
      if (confirmation.value.length === 0 || confirmation.validity.valid) {
        confirmError.style.visibility = "hidden";
      } else {
        confirmError.style.visibility = "visible";
      }
    },
    false
  );
}
