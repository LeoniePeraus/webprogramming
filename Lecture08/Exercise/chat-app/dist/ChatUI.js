import { ApiService } from "./ApiService.js";
export class ChatUI {
    constructor() {
        // Possibly attach event listeners or forms
        this.registerForm = document.getElementById("registerForm");
        this.loginForm = document.getElementById("loginForm");
        this.usersForm = document.getElementById("usersForm");
        this.messageForm = document.getElementById("messageForm");
        this.registerMessage = document.getElementById("registerMessage");
        this.loginMessage = document.getElementById("loginMessage");
        this.usersDisplay = document.getElementById("usersDisplay");
        this.messageInfo = document.getElementById("messageInfo");
    }
    init() {
        this.registerForm.addEventListener("submit", (e) => this.handleRegister(e));
        this.loginForm.addEventListener("submit", (e) => this.handleLogin(e));
        this.usersForm.addEventListener("submit", (e) => this.showUsers(e));
        this.messageForm.addEventListener("submit", (e) => this.handleMessage(e));
    }
    async handleRegister(event) {
        event.preventDefault(); // stops default behavior (no sending form to action, method get/post or page reload), use own fetch()
        const formData = new FormData(this.registerForm);
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");
        const group_id = formData.get("group_id");
        const registerUserResp = await ApiService.registerUser(name, email, password, group_id);
        // API returns success=true and id when successful
        if (registerUserResp.success !== true || !(typeof registerUserResp.id === "string" || typeof registerUserResp.id === "number")) {
            this.registerMessage.textContent = "Error: " + registerUserResp.error;
            return;
        }
        this.registerMessage.textContent = `Registration successful! New user ID: ${registerUserResp.id}`;
        this.registerForm.reset();
    }
    async handleLogin(event) {
        event.preventDefault(); // stops default behavior (no sending form to action, method get/post or page reload), use own fetch()
        const formData = new FormData(this.loginForm);
        const email = formData.get("email");
        const password = formData.get("password");
        const loginUserResp = await ApiService.loginUser(email, password);
        // API returns token and id when successful
        if (typeof loginUserResp.token !== "string" || !(typeof loginUserResp.id === "string" || typeof loginUserResp.id === "number")) {
            this.loginMessage.textContent = "Error: " + loginUserResp.error;
            return;
        }
        this.loginMessage.textContent = `Login successful! Token: ${loginUserResp.token}`;
        ApiService.setAuth(loginUserResp.token, loginUserResp.id);
        this.loginForm.reset();
    }
    async showUsers(event) {
        // e.g. calls ApiService.getUsers() and lists them in a <ul>
        event.preventDefault(); // stops default behavior (no sending form to action, method get/post or page reload), use own fetch()
        if (ApiService.getToken() === null) {
            this.usersDisplay.textContent = "Error: you have to be logged in to show users!";
            return;
        }
        const usersResp = await ApiService.getUsers();
        if (!Array.isArray(usersResp)) {
            this.usersDisplay.textContent = "Error! " + usersResp.error;
            return;
        }
        this.usersDisplay.innerHTML = "";
        const ul = document.createElement("ul");
        for (const user of usersResp) {
            const li = document.createElement("li");
            li.textContent = `User: ${user.name} (ID: ${user.id}), group: ${user.group_id}`;
            ul.appendChild(li);
        }
        this.usersDisplay.appendChild(ul);
    }
    async handleMessage(event) {
        event.preventDefault(); // stops default behavior (no sending form to action, method get/post or page reload), use own fetch()
        const formData = new FormData(this.messageForm);
        const message = formData.get("message");
        if (ApiService.getToken() === null) {
            this.messageInfo.textContent = "Error: you have to be logged in to send a message!";
            return;
        }
        const sendMessageResp = await ApiService.sendMessage(String(ApiService.getUserId()), "1723", message);
        // API returns success=true when successful
        if (sendMessageResp.success !== true) {
            this.messageInfo.textContent = "Error: " + sendMessageResp.error;
            return;
        }
        this.messageInfo.textContent = `Message successfully sent! From: (ID: ${ApiService.getUserId()}) To: (ID: 1723) Message: ${message}`;
        this.messageForm.reset();
    }
    // not used and not implemented - maybe that's for next week
    async renderConversation(container, currentUser, receiver) {
        // 1) fetch the conversation from get_conversation.php (next week's feature)
        // 2) build HTML for each ChatMessage
        // 3) Insert into container
        // 4) style differently if msg.sender_id == currentUser.id
    }
}
