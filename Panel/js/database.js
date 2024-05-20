import { getAllUsers, deleteUser } from "../../firebase/auth.js";
import {
  collection,
  doc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";
import { db } from "../../firebase/firebaseConfig.js";

const admin = JSON.parse(localStorage.getItem("admin"));
const teacher = JSON.parse(localStorage.getItem("teacher"));

if (admin === null && teacher === null) {
  window.location.href = "../index.html";
}

const deleteStudent = async (id, users, container) => {
  const user = users.find((user) => user.tcNo === id);

  try {
    await deleteUser(user);

    const newUsers = users.filter((user) => user.tcNo !== id);
    renderUsers(newUsers, container);
  } catch (error) {
    console.log(error.message);
  }
};

const addMessageModal = async (tcNo, users) => {
  const user = users.find((user) => user.tcNo === tcNo);

  const modal = document.createElement("div");
  modal.classList.add("modalMessage");
  modal.style.display = "flex";
  modal.innerHTML = `
    <div class="modal-content">
    <span class="close">&times;</span>
    <h2>${user?.name} ${user?.surname}'ye mesaj gönder</h2>
    <form>
    <label for="sender">Gönderen:</label>
    <input type="text" name="sender" id="sender" value="${teacher?.username} ${teacher?.lastName}" required />
    <label for="message">Mesajınız:</label>
    <textarea name="message" id="message" cols="30" rows="10" required></textarea>
    <button type="submit">Gönder</button>
    </form>
    </div>
`;

  document.getElementById("wrapper").appendChild(modal);

  const closeBtn = document.querySelector(".close");
  closeBtn.addEventListener("click", () => {
    modal.remove();
  });

  const submitBtn = document.querySelector("button[type='submit']");
  submitBtn.addEventListener("click", async (e) => {
    submitBtn.innerHTML = `
  <i class="fa-solid fa-spinner loader"></i>
  `;
    e.preventDefault();
    const message = document.getElementById("message").value;
    const sender = document.getElementById("sender").value;
    if (!message) return;

    const response = await createMessage(message, sender, tcNo);
    if (response) {
      modal.remove();
      return;
    } else {
      alert("Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
      return;
    }
  });
};

const renderUsers = async (users, container) => {
  container.innerHTML = "";

  users = users.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  users.forEach((user) => {
    container.innerHTML += `
  <div class="student">
  <div class="student-info">
  <h5 style="width: 30%">${user?.name} ${user?.surname}</h5>
  <p style="width: 25%">Tc No: ${user?.tcNo}</p>
  <p style="width: 25%">Öğ No: ${user?.studentNo}</p>
  <p style="width: 10%; text-align: center;">${user?.className}</p>
  <p style="width: 10%; text-align: center;">${user?.branchName}</p>
  <button class="message-student" data-tcno="${user?.tcNo}">
  <i class="fa-solid fa-envelope"></i>
  </button>
  </div>
  <div class="student-actions">
  <button class="edit-student" data-tcno="${user?.tcNo}">Düzenle</button>
  <button class="delete-student" data-tcno="${user?.tcNo}">Sil</button>
  </div>
  </div>
  `;
  });

  const deleteStudentBtn = document.querySelectorAll(".delete-student");
  deleteStudentBtn.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      let loader = `
    <i class="fa-solid fa-spinner loader"></i>
    `;
      e.target.innerHTML = loader;
      const id = e.target.getAttribute("data-tcno");
      try {
        await deleteStudent(id, users, container);
      } catch (error) {
        console.log(error.message);
        loading = false;
      }
    });
  });

  const editStudentBtn = document.querySelectorAll(".edit-student");
  editStudentBtn.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.getAttribute("data-tcno");
      window.location.href = `./editStudents.html?tcNo=${id}`;
    });
  });

  const messageStudentBtn = document.querySelectorAll(".message-student");
  messageStudentBtn.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = btn.getAttribute("data-tcno");
      addMessageModal(id, users);
    });
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const allStudents = document.getElementById("allStudents");
  const classFilter = document.getElementById("class-filter");
  const branchFilter = document.getElementById("branch-filter");

  const users = await getAllUsers();
  renderUsers(users, allStudents);

  classFilter.addEventListener("change", async (e) => {
    if (e.target.selectedIndex === 0) {
      branchFilter.selectedIndex = 0;
      return renderUsers(users, allStudents);
    }

    branchFilter.selectedIndex = 0;

    const filteredUsers = users.filter(
      (user) => user.className === e.target.value
    );

    return renderUsers(filteredUsers, allStudents);
  });

  branchFilter.addEventListener("change", async (e) => {
    if (e.target.selectedIndex === 0) return renderUsers(users);

    if (classFilter.selectedIndex === 0) {
      const filteredUsers = users.filter(
        (user) => user.branchName === e.target.value
      );

      return renderUsers(filteredUsers, allStudents);
    } else {
      const filteredUsers = users.filter(
        (user) =>
          user.branchName === e.target.value &&
          user.className === classFilter.value
      );

      return renderUsers(filteredUsers, allStudents);
    }
  });
});

export const createMessage = async (message, sender = "", tcNo) => {
  if (!message || !tcNo) {
    return;
  }

  try {
    const docRef = doc(db, "messages", tcNo);
    const inboxRef = collection(docRef, "inbox");

    await addDoc(inboxRef, {
      message: message,
      sender,
      to: tcNo,
      read: false,
      date: new Date().toLocaleString(),
    });

    return true;
  } catch (error) {
    console.log("create message", error.message);
    return false;
  }
};
