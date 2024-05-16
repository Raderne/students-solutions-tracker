import { createAdminUser } from "../firebase/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  const nameInput = document.getElementById("name");
  const surnameInput = document.getElementById("surname");
  const tcNoInput = document.getElementById("TCNO");
  const registerButton = document.getElementById("addTeacher");

  const addTeacher = async (name, surname, tcNo) => {
    try {
      if (!name || !surname || !tcNo) {
        return { success: false, message: "Lütfen tüm alanları doldurunuz" };
      }

      const response = await createAdminUser(name, surname, tcNo);

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

    const name = nameInput.value.trim();
    const surname = surnameInput.value.trim();
    const tcNo = tcNoInput.value.trim();

    registerButton.innerHTML = loader;

    const response = await addTeacher(name, surname, tcNo);

    if (response?.success) {
      clearInputs();
      registerButton.innerHTML = "Öğretmen Eklendi";
      registerButton.style.backgroundColor = "green";
      setTimeout(() => {
        registerButton.innerHTML = "Öğretmen Ekle";
        registerButton.style.backgroundColor = "#007bff";
      }, 2000);
    } else {
      registerButton.innerHTML = response?.message;
      registerButton.style.backgroundColor = "red";
      setTimeout(() => {
        registerButton.innerHTML = "Öğretmen Ekle";
        registerButton.style.backgroundColor = "#007bff";
      }, 2000);
    }
  });

  const clearInputs = () => {
    nameInput.value = "";
    surnameInput.value = "";
    tcNoInput.value = "";
  };
});
