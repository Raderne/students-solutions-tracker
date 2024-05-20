import {
  getStudentDetails,
  getStudentsDataByClassName,
} from "../../firebase/studentObservation.js";
import { classes } from "../../assets/js/common.js";

const displayBranches = (constainer) => {
  classes.map((item, index) => {
    const card = document.createElement("div");
    card.classList.add("class-card");
    if (index === 0) card.classList.add("active");
    card.innerText = item;

    constainer.appendChild(card);
  });
};

const StudentsDataByClassName = async (
  container,
  className,
  branchName = null
) => {
  getStudentsDataByClassName(className, branchName)
    .then((data) => {
      displayStudentsDataByClassName(data, container);
    })
    .catch((err) => console.log(err.message));
};

// Modal
const displayStudentDetails = async (studentId) => {
  document.body.style.overflow = "hidden";
  const modal = document.querySelector(".modal-wrapper");
  const studentsDataWrapper = document.querySelector(".all-student-data");
  const studentName = document.getElementById("student_name");
  const studentClassNameWrapper = document.getElementById("student_className");
  const closeModal = document.querySelector(".close");

  modal.style.display = "flex";

  const data = await getStudentDetails(studentId);
  const { user, modules } = data;

  if (data?.success === false) {
    alert("Error");
    return;
  } else {
    closeModal.addEventListener("click", () => {
      document.body.style.overflow = "auto";
      studentsDataWrapper.innerHTML = `
        <div class="">
          <i class="fa-solid fa-spinner loader"></i>
        </div>
      `;
      modal.style.display = "none";
    });

    studentName.innerText = user?.name + " " + user?.surname;
    studentClassNameWrapper.innerText = user?.className + " " + user?.branch;

    setTimeout(() => {
      studentsDataWrapper.innerHTML = "";
      modules?.map((module) => {
        const { Subject, tarih, name, solved, correct, wrong } = module;
        studentsDataWrapper.innerHTML += `
            <div class="">
              <p style="width: 15%;">${Subject}</p>
              <p style="width: 15%;">${tarih}</p>
              <p style="width: 20%; word-wrap: break-word;">${name}</p>
              <p style="width: 20%;">${solved} Çözülmüş</p>
              <p style="color: green; width: 15%;">${
                correct !== 0 ? correct + " Doğru" : "YOK"
              }</p>
              <p style="color: red; width: 15%;">${
                wrong !== 0 ? wrong + " Yanlış" : "YOK"
              }</p>
            </div>
        `;
      });
    }, 2000);
  }
};

const displayStudentsDataByClassName = async (data, container) => {
  container.innerHTML = "";
  console.log(data);

  if (data.length === 0) {
    container.innerHTML = `Veri mevcut değildir`;
  } else {
    data.map((student, idx) => {
      container.innerHTML += `
      <div class="student ${idx === 0 ? "winner" : ""}">
      <h2 style="width: 30%;">${student?.name} ${student?.surname}</h2>
      <div class="student-details" data-id="${student?.userId}">
      <p>Çözümleri Detaylar</p>
      </div>
      <p>TcNo: ${student?.userId}</p>
      <p>${student?.branch}</p>
      <p class="total" style="width: 10%;">Toplam ${student?.totalScore}</p>
      </div>
      `;
    });

    const studentsDetailsContainer =
      document.querySelectorAll(".student-details");

    studentsDetailsContainer.forEach(async (item) => {
      item.addEventListener("click", async () => {
        const selectedStudentId = item.getAttribute("data-id");
        await displayStudentDetails(selectedStudentId);
      });
    });
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  let selectedClassName = classes[0];

  const cardsContainer = document.querySelector(".students-cards");
  const studentsContainer = document.querySelector(".students");
  const branchesContainer = document.querySelectorAll(".branch");

  displayBranches(cardsContainer);
  await StudentsDataByClassName(studentsContainer, selectedClassName);

  const classesCards = document.querySelectorAll(".class-card");
  classesCards.forEach((card) => {
    card.addEventListener("click", async () => {
      branchesContainer.forEach((c) => c.classList.remove("active"));
      studentsContainer.innerHTML = `
        <div class="student">
          <div class="student-details">
            <p class="loader">
              <i class="fa-solid fa-spinner"></i>
            </p>
          </div>
        </div>
      `;
      const selectedClass = card.innerText;
      selectedClassName = selectedClass;
      classesCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      setTimeout(async () => {
        await StudentsDataByClassName(studentsContainer, selectedClass);
      }, 1500);
    });
  });

  branchesContainer.forEach((branch) => {
    branch.addEventListener("click", async () => {
      const selectedBranch = branch.innerText;
      studentsContainer.innerHTML = `
        <div class="student">
          <div class="student-details">
            <p class="loader">
              <i class="fa-solid fa-spinner"></i>
            </p>
          </div>
        </div>
      `;

      branchesContainer.forEach((c) => c.classList.remove("active"));
      branch.classList.add("active");
      setTimeout(async () => {
        await StudentsDataByClassName(
          studentsContainer,
          selectedClassName,
          selectedBranch
        );
      }, 1500);
    });
  });
});
