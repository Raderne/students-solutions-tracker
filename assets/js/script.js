const user = localStorage.getItem("user");
if (!user) {
  window.location.href = "./index.html";
}
const currentUser = JSON.parse(user);

const body = document.querySelector("body"),
  modeToggle = body.querySelector(".mode-toggle");
sidebar = body.querySelector("nav");
sidebarToggle = body.querySelector(".sidebar-toggle");
mainContent = body.querySelector(".main");

const logoutBtn = document.getElementById("logout-btn");

const userName = document.querySelector(".logo_name");
const className = document.querySelector(".logo_subtitle");
userName.textContent = currentUser.name + " " + currentUser.surname;
className.textContent = currentUser.className;

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
  body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if (getStatus && getStatus === "close") {
  sidebar.classList.toggle("close");
  mainContent.style.marginLeft = "0";
  mainContent.style.width = "100%";
}

modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    localStorage.setItem("mode", "dark");
  } else {
    localStorage.setItem("mode", "light");
  }
});

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
  if (sidebar.classList.contains("close")) {
    localStorage.setItem("status", "close");
    mainContent.style.marginLeft = "0";
    mainContent.style.width = "100%";
  } else {
    localStorage.setItem("status", "open");
    mainContent.style.marginLeft = "250px";
    mainContent.style.width = "calc(100% - 250px)";
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "./index.html";
});