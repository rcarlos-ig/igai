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
      if (email.validity.valid) {
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
      if (password.validity.valid) {
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
      if (nome.validity.valid) {
        nomeError.innerHTML = "";
        nomeError.classList.remove("block");
        nomeError.classList.add("hidden");
      } else {
        nomeError.innerHTML = "Nome precisa ter 3 caracteres ou mais.";
        nomeError.classList.remove("hidden");
        nomeError.classList.add("block");
      }
    },
    false
  );
}

if (bairro) {
  bairro.addEventListener(
    "input",
    function () {
      if (bairro.validity.valid) {
        bairroError.innerHTML = "";
        bairroError.classList.remove("block");
        bairroError.classList.add("hidden");
      } else {
        bairroError.innerHTML = "Bairro precisa ter 3 caracteres ou mais.";
        bairroError.classList.remove("hidden");
        bairroError.classList.add("block");
      }
    },
    false
  );
}

if (ocupacao) {
  ocupacao.addEventListener(
    "input",
    function () {
      if (ocupacao.validity.valid) {
        ocupacaoError.innerHTML = "";
        ocupacaoError.classList.remove("block");
        ocupacaoError.classList.add("hidden");
      } else {
        ocupacaoError.innerHTML = "Ocupação precisa ter 3 caracteres ou mais.";
        ocupacaoError.classList.remove("hidden");
        ocupacaoError.classList.add("block");
      }
    },
    false
  );
}

if (newPassword) {
  newPassword.addEventListener(
    "input",
    function () {
      if (newPassword.validity.valid) {
        passwordError.innerHTML = "";
        passwordError.classList.remove("block");
        passwordError.classList.add("hidden");
      } else {
        passwordError.innerHTML = "Senha precisa ter 3 caracteres ou mais.";
        passwordError.classList.remove("hidden");
        passwordError.classList.add("block");
      }
    },
    false
  );
}

if (confirmation) {
  confirmation.addEventListener(
    "input",
    function () {
      if (confirmation.validity.valid) {
        confirmError.innerHTML = "";
        confirmError.classList.remove("block");
        confirmError.classList.add("hidden");
      } else {
        confirmError.innerHTML =
          "Confirmação precisa ter 3 caracteres ou mais.";
        confirmError.classList.remove("hidden");
        confirmError.classList.add("block");
      }
    },
    false
  );
}
