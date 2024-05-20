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

const moduleImage = [
  "./assets/images/calculating.png",
  "./assets/images/fizik.png",
  "./assets/images/alchemy.png",
  "./assets/images/dna.png",
  "./assets/images/languages.png",
  "./assets/images/text-books.png",
  "./assets/images/book.png",
];

document.addEventListener("DOMContentLoaded", async () => {
  await getAllDataByModule(selectedModule);
  moduleName.textContent = selectedModule;
  subeName.textContent = currentUser?.branchName;

  modules.forEach((module, index) => {
    const li = document.createElement("li");

    const img = document.createElement("img");
    img.src = moduleImage[index];
    img.alt = module;

    const span = document.createElement("span");
    span.classList.add("link-name");
    span.textContent = module;
    li.style.display = "flex";
    li.style.alignItems = "center";
    li.style.gap = "10px";
    img.style.cursor = "pointer";
    li.appendChild(img);
    li.appendChild(span);

    modileLinks.appendChild(li);

    const clickHandler = async () => {
      if (selectedModule === module) return;
      selectedModule = module;
      moduleName.textContent = module;
      activityContainer.innerHTML = "";
      await getAllDataByModule(selectedModule);
      moduleImageContainer.innerHTML = "";
      const selectedImg = document.createElement("img");
      selectedImg.src = moduleImage[index];
      selectedImg.alt = module;
      moduleImageContainer.appendChild(selectedImg);
    };

    span.addEventListener("click", clickHandler);
    img.addEventListener("click", clickHandler);
  });
  const style = document.createElement("style");
  style.textContent = `
      @media (max-width: 400px) {
          .link-name {
              opacity: 0;
          }
      }
  `;
  document.head.appendChild(style);

  const style2 = document.createElement("style");
  style.textContent = `
      @media (max-width: 1000px) {
          .link-name {
              opacity: 0;
          }
      }
  `;
  document.head.appendChild(style2);
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
  if (selectedModule === "Kitap") {
    subjectName.placeholder = "Kitap Adı";
  } else {
    subjectName.placeholder = "Konu";
  }
  subjectName.type = "text";
  subjectName.pattern = "[A-Za-z ]*";
  subjectName.classList.add("subject-name");

  const date = document.createElement("input");
  date.type = "date";
  date.value = new Date().toISOString().split("T")[0];

  const solved = document.createElement("input");
  solved.type = "number";
  solved.min = 0;
  if (selectedModule === "Kitap") {
    solved.placeholder = "Sayfa Sayı";
  } else {
    solved.placeholder = "Çözüldü";
  }
  solved.pattern = "[0-9]*";
  solved.required = true;
  solved.classList.add("solved");

  const correctSolved = document.createElement("input");
  correctSolved.type = "number";
  correctSolved.placeholder = "doğru cevaplar";
  correctSolved.pattern = "[0-9]*";
  correctSolved.required = true;
  correctSolved.classList.add("solved");

  const wrongSolved = document.createElement("input");
  wrongSolved.type = "number";
  wrongSolved.placeholder = "yanlış cevaplar";
  wrongSolved.pattern = "[0-9]*";
  wrongSolved.required = true;
  wrongSolved.classList.add("solved");

  const submit = document.createElement("button");
  submit.textContent = "Ekle";
  submit.classList.add("submit");

  const close = document.createElement("i");
  close.classList.add("fas", "fa-times", "close");

  modal.appendChild(title);
  modal.appendChild(subjectName);
  modal.appendChild(date);
  modal.appendChild(solved);
  if (selectedModule !== "Kitap") {
    modal.appendChild(correctSolved);
    modal.appendChild(wrongSolved);
  }
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
  let correctAnswer = 0;
  let wrongAnswer = 0;

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

  correctSolved.addEventListener("input", (e) => {
    correctAnswer = e.target.value;
  });

  wrongSolved.addEventListener("input", (e) => {
    wrongAnswer = e.target.value;
  });

  submit.addEventListener("click", async () => {
    submit.disabled = true;

    if (!tarih || !solvedValue) {
      alert("Lütfen tüm alanları doldurunuz.");
      return;
    }

    await addActivity(
      subject,
      tarih,
      solvedValue,
      correctAnswer,
      wrongAnswer,
      modal
    );
    addBtn.disabled = false;
    addBtn.innerText = "Ekle";
  });
};

const addActivity = async (
  subject,
  tarih,
  solvedValue,
  correct,
  wrong,
  modalContainer
) => {
  // clear activity container
  activityContainer.innerHTML = "";

  // add data to firestore database
  await createModule(
    selectedModule,
    subject,
    tarih,
    solvedValue,
    correct,
    wrong
  );

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
  }, 1000);
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

    for (let index = 0; index < 5; index++) {
      const data = document.createElement("div");
      data.classList.add("data");

      const dataValue = document.createElement("span");
      dataValue.classList.add("data-title");

      if (index == 0) {
        dataValue.textContent = module?.tarih;
      } else if (index == 1) {
        dataValue.textContent = module?.name;
        data.style.width = "20%";
      } else if (index == 2) {
        dataValue.textContent = module?.solved;
      } else if (index == 3) {
        if (
          module?.correct === undefined ||
          module?.correct === "" ||
          module?.correct === 0
        )
          continue;
        dataValue.textContent = module?.correct;
        dataValue.style.color = "green";
      } else {
        if (
          module?.wrong === undefined ||
          module?.correct === "" ||
          module?.correct === 0
        )
          continue;
        dataValue.textContent = module?.wrong;
        dataValue.style.color = "red";
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
