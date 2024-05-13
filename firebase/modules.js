import {
  createModule,
  deleteModule,
  getModules,
  getStudentsTotalScoreLeaderBoard,
} from "./dersler.js";
import { modules } from "../assets/js/common.js";

const currentUser = JSON.parse(localStorage.getItem("user"));

const body = document.querySelector("body");
const modileLinks = document.getElementById("module-links");
const moduleName = document.getElementById("moduleName");
const addTextBtn = document.getElementById("add");
const activityContainer = document.querySelector(".modules-data");
const subeName = document.getElementById("subeName");

let selectedModule = "Matematik";

document.addEventListener("DOMContentLoaded", async () => {
  await getAllDataByModule(selectedModule);
  moduleName.textContent = selectedModule;
  subeName.textContent = currentUser?.branchName;

  modules.forEach((module) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.classList.add("link-name");
    span.textContent = module;
    li.appendChild(span);
    modileLinks.appendChild(li);

    span.addEventListener("click", async () => {
      if (selectedModule === module) return;
      selectedModule = module;
      moduleName.textContent = module;

      activityContainer.innerHTML = "";
      await getAllDataByModule(selectedModule);
    });
  });

  addTextBtn.addEventListener("click", () => {
    addTextBtn.disabled = true;
    addModal(addTextBtn);
  });
});

const addModal = (addBtn) => {
  const modal = document.createElement("div");
  modal.id = "modal";

  const title = document.createElement("h2");
  title.textContent = selectedModule + "'e Ekle";

  const subjectName = document.createElement("input");
  subjectName.type = "text";
  subjectName.placeholder = "Konu";
  subjectName.pattern = "[A-Za-z ]*";
  subjectName.classList.add("subject-name");

  const date = document.createElement("input");
  date.type = "date";
  date.value = new Date().toISOString().split("T")[0];

  const solved = document.createElement("input");
  solved.type = "number";
  solved.min = 0;
  solved.placeholder = "Çözüldü";
  solved.pattern = "[0-9]*";
  solved.required = true;
  solved.classList.add("solved");

  const submit = document.createElement("button");
  submit.textContent = "Ekle";
  submit.classList.add("submit");

  const close = document.createElement("i");
  close.classList.add("fas", "fa-times", "close");

  modal.appendChild(title);
  modal.appendChild(subjectName);
  modal.appendChild(date);
  modal.appendChild(solved);
  modal.appendChild(submit);
  modal.appendChild(close);
  body.appendChild(modal);

  close.addEventListener("click", () => {
    body.removeChild(modal);
    addBtn.disabled = false;
  });

  let subject = "";
  let tarih = date.value;
  let solvedValue = "";

  subjectName.addEventListener("input", (e) => {
    subject = e.target.value;
    subject = subject.trim();
  });

  date.addEventListener("input", (e) => {
    tarih = e.target.value;
  });

  solved.addEventListener("input", (e) => {
    solvedValue = e.target.value;
  });

  submit.addEventListener("click", async () => {
    if (!tarih || !solvedValue) {
      alert("Lütfen tüm alanları doldurunuz.");
      return;
    }

    await addActivity(subject, tarih, solvedValue, modal);
    addBtn.disabled = false;
  });
};

const addActivity = async (subject, tarih, solvedValue, modalContainer) => {
  // clear activity container
  activityContainer.innerHTML = "";

  // add data to firestore database
  await createModule(selectedModule, subject, tarih, solvedValue);

  // view data on the screen
  await getAllDataByModule(selectedModule);

  body.removeChild(modalContainer);
  const celebrate = document.createElement("div");
  celebrate.classList.add("celebrate");
  celebrate.innerHTML = `
        <dotlottie-player
        src="https://lottie.host/07cbc002-86c6-4ad7-b798-4c60624e5bce/ovDfolelyN.json"
        background="transparent"
        speed="0.85"
        style="width: 100%; height: 100%;"
        loop
        autoplay
      >
      </dotlottie-player>
  `;

  body.appendChild(celebrate);

  setTimeout(() => {
    body.removeChild(celebrate);
  }, 2000);
};

const getAllDataByModule = async (module) => {
  const { success, modules } = await getModules(module);

  // sort modules by date
  modules.sort((a, b) => {
    return new Date(a.tarih) - new Date(b.tarih);
  });

  if (!success) return;

  modules?.forEach((module) => {
    const moduleContainer = document.createElement("div");
    moduleContainer.classList.add("activity-data");

    for (let index = 0; index < 3; index++) {
      const data = document.createElement("div");
      data.classList.add("data");

      const dataValue = document.createElement("span");
      dataValue.classList.add("data-title");

      if (index == 0) {
        dataValue.textContent = module?.tarih;
      } else if (index == 1) {
        dataValue.textContent = module?.name;
        data.style.width = "20%";
      } else {
        dataValue.textContent = module?.solved;
      }

      data.appendChild(dataValue);
      moduleContainer.appendChild(data);
    }

    const deleteBtn = document.createElement("i");
    deleteBtn.classList.add("fas", "fa-trash", "delete");
    deleteBtn.setAttribute("data-id", module.id);

    deleteBtn.addEventListener("click", async (e) => {
      const id = e.target.getAttribute("data-id");
      await deleteModule(selectedModule, id);
      activityContainer.removeChild(moduleContainer);
    });

    moduleContainer.appendChild(deleteBtn);

    activityContainer.appendChild(moduleContainer);
  });
};

const getLeaderBoard = async (result, container) => {
  container.innerHTML = "";

  let leaderboardHtml = "";
  result?.forEach((student, index) => {
    let { name, surname, className, branch, userId, totalScore } = student;
    leaderboardHtml += `
      <div class="leaderboard-item ${index == 0 ? "winner" : ""}">
        <span style="width: 10% !important; text-align: start;">${
          index + 1
        }</span>
        <div>
          <span style='${
            userId === currentUser.tcNo ? "color: var(--user-color)" : ""
          }; font-weight: 700; font-size: 1.2rem;'>${name} ${surname}</span>
          <span style="font-size: 0.85rem !important;">${className} ${branch}</span>
        </div>
        <span>${totalScore}</span>
      </div>
    `;

    container.innerHTML = leaderboardHtml;
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const leaderBoardContainer = document.querySelector(".leaderboard-data");
  const branchLeaderBoard = document.querySelector(".leaderbord-branch");
  const refreshBtn = document.getElementById("refresh");
  refreshBtn.disabled = true;

  setTimeout(() => {
    refreshBtn.disabled = false;
    getStudentsTotalScoreLeaderBoard().then((results) => {
      getLeaderBoard(results, leaderBoardContainer);
    });

    // for a branch
    getStudentsTotalScoreLeaderBoard(
      currentUser?.branchName,
      currentUser?.className
    )
      .then((results) => {
        getLeaderBoard(results, branchLeaderBoard);
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, 1000);

  refreshBtn.addEventListener("click", async () => {
    refreshBtn.disabled = true;
    getStudentsTotalScoreLeaderBoard()
      .then((results) => {
        // add loader

        let loader = `
          <p class="loader">
            <i class="fa-solid fa-spinner"></i>
          </p>
        `;

        document.querySelector(".leaderboard-data").innerHTML = loader;

        setTimeout(() => {
          getLeaderBoard(results, leaderBoardContainer);
          refreshBtn.disabled = false;
        }, 2000);
      })
      .catch(() => {
        alert("Bir hata oluştu. Lütfen tekrar deneyiniz.");
        refreshBtn.disabled = false;
      });

    // for a branch
    getStudentsTotalScoreLeaderBoard(
      currentUser?.branchName,
      currentUser?.className
    ).then((results) => {
      // add loader
      let loader = `
      <p class="loader">
        <i class="fa-solid fa-spinner"></i>
      </p>
    `;

      branchLeaderBoard.innerHTML = loader;
      setTimeout(() => {
        getLeaderBoard(results, branchLeaderBoard);
        refreshBtn.disabled = false;
      }, 2000);
    });
  });
});