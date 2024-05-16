import { loginTeachersAdmin } from "./auth.js";

const teacher = JSON.parse(localStorage.getItem("teacher"));

if (teacher !== null) {
  window.location.href = "../Panel/index.html";
}

document.addEventListener("DOMContentLoaded", async () => {
  const usernameInput = document.getElementById("username");
  const lastNameInput = document.getElementById("lastName");
  const tcNoInput = document.getElementById("TCNO");
  const loginButton = document.getElementById("login");

  usernameInput.value = teacher?.username || "";
  lastNameInput.value = teacher?.lastName || "";

  const login = async (username, lastName, tcNo) => {
    try {
      if (!username || !lastName || !tcNo) {
        return { success: false, message: "Lütfen tüm alanları doldurunuz" };
      }

      const response = await loginTeachersAdmin(username, lastName, tcNo);

      return response;
    } catch (error) {
      console.log("in index", error.message);
      return { success: false, message: error.message };
    }
  };

  loginButton.addEventListener("click", async () => {
    let loader = `
            <i class="fa-solid fa-spinner loader"></i>
        `;

    const username = usernameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const tcNo = tcNoInput.value.trim();

    loginButton.innerHTML = loader;

    const response = await login(username, lastName, tcNo);

    if (response?.success) {
      window.location.href = "../Panel/index.html";
    } else {
      loginButton.innerHTML = "Giriş Başarısız";
      loginButton.style.backgroundColor = "red";
      setTimeout(() => {
        loginButton.innerHTML = "Giriş Yap";
        loginButton.style.backgroundColor = "#007bff";
      }, 1000);
    }
  });
});
