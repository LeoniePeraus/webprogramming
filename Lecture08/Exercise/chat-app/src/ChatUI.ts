import { User, ChatMessage } from "./types.js";
import { ApiService } from "./ApiService.js";

export class ChatUI {
    private registerForm: HTMLFormElement;
    private loginForm: HTMLFormElement;
    private usersForm: HTMLFormElement;
    private messageForm: HTMLFormElement;

    private registerMessage: HTMLElement;
    private loginMessage: HTMLElement;
    private usersDisplay: HTMLElement;
    private messageInfo: HTMLElement;

    constructor() {
        // Possibly attach event listeners or forms
        this.registerForm = document.getElementById("registerForm") as HTMLFormElement;
        this.loginForm = document.getElementById("loginForm") as HTMLFormElement;
        this.usersForm = document.getElementById("usersForm") as HTMLFormElement;
        this.messageForm = document.getElementById("messageForm") as HTMLFormElement;

        this.registerMessage = document.getElementById("registerMessage") as HTMLElement;
        this.loginMessage = document.getElementById("loginMessage") as HTMLElement;
        this.usersDisplay = document.getElementById("usersDisplay") as HTMLElement;
        this.messageInfo = document.getElementById("messageInfo") as HTMLElement;
    }

    init() {
        this.registerForm.addEventListener("submit", (e) => this.handleRegister(e));
        this.loginForm.addEventListener("submit", (e) => this.handleLogin(e));
        this.usersForm.addEventListener("submit", (e) => this.showUsers(e));
        this.messageForm.addEventListener("submit", (e) => this.handleMessage(e));
    }

    private async handleRegister(event: Event) {
        event.preventDefault(); // stops default behavior (no sending form to action, method get/post or page reload), use own fetch()

        const formData = new FormData(this.registerForm);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const group_id = formData.get("group_id") as string;

        const registerUserResp = await ApiService.registerUser(name, email, password, group_id);

        // API returns success=true and id when successful
        if (registerUserResp.success !== true || !(typeof registerUserResp.id === "string" || typeof registerUserResp.id === "number")) {
            this.registerMessage.textContent = "Error: " + registerUserResp.error;
            return;
        }
        this.registerMessage.textContent = `Registration successful! New user ID: ${registerUserResp.id}`;
        this.registerForm.reset();
    }

    private async handleLogin(event: Event) {
        event.preventDefault(); // stops default behavior (no sending form to action, method get/post or page reload), use own fetch()

        const formData = new FormData(this.loginForm);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

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

    private async showUsers(event: Event) {
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

    private async handleMessage(event: Event) {
        event.preventDefault(); // stops default behavior (no sending form to action, method get/post or page reload), use own fetch()

        const formData = new FormData(this.messageForm);
        const message = formData.get("message") as string;

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
    async renderConversation(
        container: HTMLElement,
        currentUser: User,
        receiver: User
    ): Promise<void> {
        // 1) fetch the conversation from get_conversation.php (next week's feature)
        // 2) build HTML for each ChatMessage
        // 3) Insert into container
        // 4) style differently if msg.sender_id == currentUser.id
    }
}