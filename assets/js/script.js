const user = localStorage.getItem("user");
if (!user) {
  window.location.href = "./index.html";
}
const currentUser = JSON.parse(user);

const body = document.querySelector("body"),
  modeToggle = body.querySelector(".mode-toggle"),
  sidebar = body.querySelector("nav"),
  sidebarToggle = body.querySelector(".sidebar-toggle"),
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
  updateMainContentStyle();
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
  } else {
    localStorage.setItem("status", "open");
  }
  updateMainContentStyle();
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "./index.html";
});

// Define the media query for mobile screens
const mediaQuery = window.matchMedia("(max-width: 1000px)");

// Function to update main content style based on media query match
function updateMainContentStyle() {
  if (sidebar.classList.contains("close") || mediaQuery.matches) {
    mainContent.style.marginLeft = "0";
    mainContent.style.width = "100%";
  } else {
    mainContent.style.marginLeft = "250px";
    mainContent.style.width = "calc(100% - 250px)";
  }
}

// Attach listener to media query to handle changes
mediaQuery.addEventListener("change", updateMainContentStyle);

// Initial call to set the correct style on page load
updateMainContentStyle();
