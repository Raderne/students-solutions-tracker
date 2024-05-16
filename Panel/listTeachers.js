import { deleteTeacher, getAllTeachers } from "../firebase/auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  const allTeachers = document.getElementById("allTeachers");
  const teachers = await getAllTeachers();

  const renderUsers = async (users) => {
    allTeachers.innerHTML = "";

    users = users.sort((a, b) => {
      return a.username.localeCompare(b.username);
    });

    users.forEach((user) => {
      allTeachers.innerHTML += `
        <div class="teacher">
        <div class="teacher-info">
        <h5 style="width: 30%">${user?.username} ${user?.lastName}</h5>
            <p style="width: 25%">Tc No: ${user?.TCNO}</p>
        </div>
        <div class="teacher-actions">
        <!-- <button class="edit-teacher" data-tcno="${user?.TCNO}">Düzenle</button> -->
        <button class="delete-teacher" data-tcno="${user?.TCNO}">Sil</button>
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
          await deleteTeacher(id);
        } catch (error) {
          console.log(error.message);
          loading = false;
        }
      });
    });

    // const editStudentBtn = document.querySelectorAll(".edit-student");
    // editStudentBtn.forEach((btn) => {
    //   btn.addEventListener("click", async (e) => {
    //     const id = e.target.getAttribute("data-tcno");
    //     window.location.href = `./editStudents.html?tcNo=${id}`;
    //   });
    // });
  };

  await renderUsers(teachers);
});
