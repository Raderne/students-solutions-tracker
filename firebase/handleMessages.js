import { getMessages, updateMessage } from "./dersler.js";

document.addEventListener("DOMContentLoaded", async () => {
  const messagesBox = document.querySelector(".messagesBox");
  const messagesContainer = document.querySelector(".messages");
  const badge = document.querySelector(".badge");

  window.onload = async () => {
    const messages = await getMessages();

    messagesBox.addEventListener("click", async () => {
      messagesContainer.classList.toggle("show");
      if (messagesContainer.classList.contains("show")) {
        badge.style.display = "none";
        messages.forEach((message) => {
          if (!message.read) {
            updateMessage(message.id);
          }
        });
      }
    });

    if (!messages) {
      return;
    }

    if (messages.length === 0) {
      badge.style.display = "none";
      return;
    }

    badge.textContent = messages.filter((message) => !message.read).length;

    if (badge.textContent === "0") {
      badge.style.display = "none";
    }

    messages.forEach(async (message, index) => {
      const messageDate = new Date(message.date).toLocaleTimeString();

      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message");
      messageDiv.innerHTML = `
        <div class="message-header">
            <span class="message-title">${message.sender}</span>
            <span class="message-time">${messageDate}</span>
        </div>
        <div class="message-content">
          <p>${message.message}</p>
        </div>
        ${index === messages.length - 1 ? "" : "<div class='separator'></div>"}
      `;

      messagesContainer.appendChild(messageDiv);
    });
  };
});
