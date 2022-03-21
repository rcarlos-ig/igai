// Logout Modal
const logoutModal = document.querySelector("#logoutModal");
const openLogoutModal = document.querySelector("#logoutModalOpen");
const closeLogoutModal = document.querySelector("#logoutModalClose");

openLogoutModal.addEventListener("click", () => {
  logoutModal.showModal();
  closeLogoutModal.blur();
});

closeLogoutModal.addEventListener("click", () => {
  logoutModal.close();
});
