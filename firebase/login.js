import { loginAdmin, loginUser } from "./auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const tcNoInput = document.getElementById("TCNO");
  const studentNoInput = document.getElementById("studentNo");
  const loginButton = document.getElementById("login");

  loginButton.addEventListener("click", async () => {
    if (!tcNoInput.value || !studentNoInput.value) {
      alert("Lütfen tüm alanları doldurunuz");
      return;
    }

    if (tcNoInput.value === "admin") {
      const response = await loginAdmin(tcNoInput.value, studentNoInput.value);
      if (!response.success) {
        alert(response.message);
        return;
      } else {
        localStorage.setItem("admin", true);
        window.location.href = "../Panel/index.html";
        return;
      }
    }

    const tcNo = tcNoInput.value;
    const studentNo = studentNoInput.value;

    const response = await loginUser(tcNo, studentNo);
    if (response.success) {
      window.location.href = "./AnaSayfa.html";
    } else {
      alert(response.message);
    }
  });
});
