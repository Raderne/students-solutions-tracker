import { getUser, updateUser } from "../firebase/auth.js";

const admin = JSON.parse(localStorage.getItem("admin"));
const teacher = JSON.parse(localStorage.getItem("teacher"));

if (admin === null && teacher === null) {
  window.location.href = "../index.html";
}

document.addEventListener("DOMContentLoaded", async () => {
  const nameInput = document.getElementById("name");
  const surnameInput = document.getElementById("surname");
  const classNameSelect = document.getElementById("class");
  const branchNameSelect = document.getElementById("branch");
  const tcNoInput = document.getElementById("TCNO");
  const studentNoInput = document.getElementById("studentNo");
  const editButton = document.getElementById("register");
  const resultText = document.getElementById("result");

  const urlParams = new URLSearchParams(window.location.search);
  const tcNo = urlParams.get("tcNo");

  const user = await getUser(tcNo);
  fillInformation(user);

  editButton.addEventListener("click", async () => {
    let loader = `
          <i class="fa-solid fa-spinner loader"></i>
      `;
    editButton.innerHTML = loader;

    const name = nameInput.value;
    const surname = surnameInput.value;
    const className =
      classNameSelect.options[classNameSelect.selectedIndex].innerText;
    const branchName =
      branchNameSelect.options[branchNameSelect.selectedIndex].innerText;
    const tcNo = tcNoInput.value;
    const studentNo = studentNoInput.value;

    const updatedUser = {
      name,
      surname,
      className,
      branchName,
      tcNo,
      studentNo,
      RegisterYear: user?.RegisterYear,
    };

    const response = await updateUser(updatedUser);

    if (response.success) {
      resultText.innerText = "Başarıyla güncellendi!";
      resultText.style.display = "block";

      setTimeout(() => {
        resultText.innerText = "";
        resultText.style.display = "none";
        editButton.innerHTML = "Güncelle";
      }, 3000);
    } else {
      resultText.innerText = response.message;
      resultText.style.display = "block";
      resultText.style.background = "red";
      editButton.innerHTML = "Güncelle";
    }
  });
});

const fillInformation = (user) => {
  const nameInput = document.getElementById("name");
  const surnameInput = document.getElementById("surname");
  const classNameSelect = document.getElementById("class");
  const branchNameSelect = document.getElementById("branch");
  const tcNoInput = document.getElementById("TCNO");
  const studentNoInput = document.getElementById("studentNo");

  nameInput.value = user.name;
  surnameInput.value = user.surname;
  tcNoInput.value = user.tcNo;
  studentNoInput.value = user.studentNo;

  for (let i = 0; i < classNameSelect.options.length; i++) {
    if (classNameSelect.options[i].innerText === user.className) {
      classNameSelect.options[i].selected = true;
      break;
    }
  }

  for (let i = 0; i < branchNameSelect.options.length; i++) {
    if (branchNameSelect.options[i].innerText === user.branchName) {
      branchNameSelect.options[i].selected = true;
      break;
    }
  }
};
