// Logout Modal
const logoutModal = document.querySelector("#logoutModal");
const openLogoutModal = document.querySelector("#logoutModalOpen");
const closeLogoutModal = document.querySelector("#logoutModalClose");

openLogoutModal.addEventListener("click", () => {
  logoutModal.showModal();
  closeLogoutModal.blur();
});

closeLogoutModal.addEventListener("click", () => {
  logoutModal.classList.add("hide");
  logoutModal.addEventListener("animationend", function () {
    logoutModal.classList.remove("hide");
    logoutModal.close();
    logoutModal.removeEventListener("animationend", arguments.callee, false);
  }, false)
});