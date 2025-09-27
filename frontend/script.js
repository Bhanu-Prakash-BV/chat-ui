const sendBtn = document.getElementById("sendBtn");
const messageInput = document.getElementById("messageInput");
const chatMessages = document.getElementById("chatMessages");

const maskIcon = document.querySelector(".mask-icon");
let isAnonymous = false; 


maskIcon.addEventListener("click", () => {
  isAnonymous = !isAnonymous;

  const anonStatus = document.getElementById("anonStatus");

  if (isAnonymous) {
    anonStatus.style.display = "block";
  } else {
    anonStatus.style.display = "none";
  }
  chatMessages.scrollTop = chatMessages.scrollHeight;
});


const API_URL = 'http://localhost:3000/messages';


function loadMessages() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      chatMessages.innerHTML = '';
      data.forEach(msg => renderMessage(msg));
      chatMessages.scrollTop = chatMessages.scrollHeight;
    })
    .catch(err => console.error('Error loading messages:', err));
}


function renderMessage(msg) {
  const msgBlock = document.createElement("div");
  msgBlock.classList.add("message-block");

  
  if (msg.username === "You") {
    msgBlock.style.justifyContent = "flex-end";
    const bubble = document.createElement("div");
    bubble.classList.add("bubble", "user");
    bubble.innerHTML = `
      <span class="text">${msg.message}</span>
      <span class="time">${new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span>
    `;
    msgBlock.appendChild(bubble);

  } else {
    
    msgBlock.style.justifyContent = "flex-start";
    const avatarWrapper = document.createElement("div");
    avatarWrapper.classList.add("avatar-wrapper");

    const avatar = document.createElement("img");
    avatar.src = (msg.username === "Anonymous" || !msg.avatar) ? "images/anon-avatar.png" : msg.avatar;
    avatar.alt = msg.username;

    avatarWrapper.appendChild(avatar);

    if (msg.message === "Hello!") {
        const activeDot = document.createElement("span");
        activeDot.classList.add("active-dot");
        avatarWrapper.appendChild(activeDot);
    }

    
    if (msg.isActive) {
        const activeDot = document.createElement("span");
        activeDot.classList.add("active-dot");
        avatarWrapper.appendChild(activeDot);
    }

    const bubble = document.createElement("div");
    bubble.classList.add("bubble", "other");
    bubble.innerHTML = `
      <span class="username">${msg.username}</span>
      <span class="text">${msg.message}</span>
      <span class="time">${new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span>
    `;

    msgBlock.appendChild(avatarWrapper);
    msgBlock.appendChild(bubble);
  }

  chatMessages.appendChild(msgBlock);
}



function sendMessage() {
  const text = messageInput.value.trim();
  if (text === "") return;

  const payload = {
    username: isAnonymous ? 'Anonymous' : 'You',
    message: text,
    timestamp: new Date(),
    avatar: null 
  };

  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then(data => {
    renderMessage(data);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    messageInput.value = "";
  })
  .catch(err => console.error('Error sending message:', err));
}


sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", e => { if (e.key === "Enter") sendMessage(); });


window.addEventListener('load', loadMessages);