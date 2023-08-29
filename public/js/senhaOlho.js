function senhaOlho(input, icon) {
  console.log(input, icon);
  const passwordInput = document.getElementById(input);
  const eyeIcon = document.getElementById(icon);

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.classList.add("senha-olho-riscado");
  } else {
    passwordInput.type = "password";
    eyeIcon.classList.remove("senha-olho-riscado");
  }
}
