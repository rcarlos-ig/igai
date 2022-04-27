function senhaOlho() {
  const passwordInput = document.getElementById("password");
  const eyeIcon = document.getElementById("senha-olho");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.add("senha-olho-riscado");
  } else {
    passwordInput.type = "password";
    eyeIcon.classList.remove("senha-olho-riscado");
  }
}
