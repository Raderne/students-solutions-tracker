import { createUser } from "../../firebase/auth.js";

const admin = JSON.parse(localStorage.getItem("admin"));
const teacher = JSON.parse(localStorage.getItem("teacher"));

if (admin === null && teacher === null) {
  window.location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("name");
  const surnameInput = document.getElementById("surname");
  const classNameSelect = document.getElementById("class");
  const branchNameSelect = document.getElementById("branch");
  const tcNoInput = document.getElementById("TCNO");
  const studentNoInput = document.getElementById("studentNo");
  const registerButton = document.getElementById("register");
  const resultText = document.getElementById("result");

  const register = async (
    name,
    surname,
    className,
    branchName,
    tcNo,
    studentNo
  ) => {
    try {
      if (
        !name ||
        !surname ||
        !className ||
        !branchName ||
        !tcNo ||
        !studentNo
      ) {
        return { success: false, message: "Lütfen tüm alanları doldurunuz" };
      }

      const response = await createUser(
        name,
        surname,
        className,
        branchName,
        tcNo,
        studentNo
      );

      return response;
    } catch (error) {
      console.log("in index", error.message);
      return { success: false, message: error.message };
    }
  };

  registerButton.addEventListener("click", async () => {
    let loader = `
          <i class="fa-solid fa-spinner loader"></i>
      `;

    const name = nameInput.value;
    const surname = surnameInput.value;
    const className =
      classNameSelect.options[classNameSelect.selectedIndex].innerText;
    const branchName =
      branchNameSelect.options[branchNameSelect.selectedIndex].innerText;
    const tcNo = tcNoInput.value;
    const studentNo = studentNoInput.value;

    registerButton.innerHTML = loader;

    const result = await register(
      name,
      surname,
      className,
      branchName,
      tcNo,
      studentNo
    );
    if (result?.success) {
      resultText.innerText = "Öğrenci başarıyla oluşturuldu!";
      resultText.style.display = "block";

      setTimeout(() => {
        resultText.innerText = "";
        resultText.style.display = "none";
        registerButton.innerHTML = "Kaydet";
      }, 2000);

      clearInputs();
    } else {
      resultText.style.display = "block";
      resultText.style.background = "red";
      resultText.innerText = result?.message;
      registerButton.innerHTML = "Kaydet";
    }
  });

  const clearInputs = () => {
    nameInput.value = "";
    surnameInput.value = "";
    tcNoInput.value = "";
    studentNoInput.value = "";
    classNameSelect.selectedIndex = 0;
    branchNameSelect.selectedIndex = 0;

    nameInput.focus();
  };
});
