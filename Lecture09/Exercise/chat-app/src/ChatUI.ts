import { User, ChatMessage } from "./types.js";
import { ApiService } from "./ApiService.js";

export class ChatUI {
    // Forms
    private registerForm: HTMLFormElement;
    private loginForm: HTMLFormElement;
    private messageForm: HTMLFormElement;
    // Error info
    private registerMessage: HTMLElement;
    private loginMessage: HTMLElement;
    private messageInfo: HTMLElement;
    // Displays
    private userList: HTMLElement;
    private chatPartner: HTMLElement;
    private chatMessages: HTMLElement;
    // Variable
    private selectedChatPartnerId: string | null;

    constructor() {
        // Forms
        this.registerForm = document.getElementById("registerForm") as HTMLFormElement;
        this.loginForm = document.getElementById("loginForm") as HTMLFormElement;
        this.messageForm = document.getElementById("messageForm") as HTMLFormElement;
        // Error info
        this.registerMessage = document.getElementById("registerMessage") as HTMLElement;
        this.loginMessage = document.getElementById("loginMessage") as HTMLElement;
        this.messageInfo = document.getElementById("messageInfo") as HTMLElement;
        // Displays
        this.userList = document.getElementById("userList") as HTMLElement;
        this.chatPartner = document.getElementById("chat-partner") as HTMLElement;
        this.chatMessages = document.getElementById("chat-messages") as HTMLElement;
        // Variable
        this.selectedChatPartnerId = null;
    }

    init(): void {
        this.registerForm.addEventListener("submit", (e) => this.handleRegister(e));
        this.loginForm.addEventListener("submit", (e) => this.handleLogin(e));
        this.messageForm.addEventListener("submit", (e) => this.handleSendMessage(e));
    }

    selectChatPartner(chatPartner: User): void {
        this.selectedChatPartnerId = chatPartner.id;
        this.chatPartner.textContent = chatPartner.name;
        this.showConversation(chatPartner.id);
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

        this.showUsers();

        // reset chat if someone registers with a different account than the current
        this.chatMessages.innerHTML = "";
        this.chatPartner.innerHTML = "";
        this.selectedChatPartnerId = null;
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

        this.showUsers();

        // reset chat if someone logs in with a different account than the current
        this.chatMessages.innerHTML = "";
        this.chatPartner.innerHTML = "";
        this.selectedChatPartnerId = null;
    }

    private async showUsers() {
        if (ApiService.getToken() === null) {
            this.userList.textContent = "Error: you have to be logged in to show users!";
            return;
        }

        const usersResp = await ApiService.getUsers();

        if (!Array.isArray(usersResp)) {
            this.userList.textContent = "Error! " + usersResp.error;
            return;
        }

        this.userList.innerHTML = "";
        for (const user of usersResp) {
            const div = document.createElement("div");
            div.textContent = `User: ${user.name} (ID: ${user.id}), group: ${user.group_id}`; // or just user.name
            div.addEventListener("click", () => this.selectChatPartner(user));
            this.userList.appendChild(div);
        }
    }

    private async handleSendMessage(event: Event) {
        event.preventDefault(); // stops default behavior (no sending form to action, method get/post or page reload), use own fetch()
        this.messageInfo.innerHTML = "";

        const formData = new FormData(this.messageForm);
        const message = formData.get("message") as string;

        if (ApiService.getToken() === null) {
            this.messageInfo.textContent = "Error: you have to be logged in to send a message!";
            return;
        }
        if (this.selectedChatPartnerId === null) {
            this.messageInfo.textContent = "Error: you have to select a user to send a message!";
            return;
        }

        const sendMessageResp = await ApiService.sendMessage(String(ApiService.getUserId()), this.selectedChatPartnerId, message);

        // API returns success=true when successful
        if (sendMessageResp.success !== true) {
            this.messageInfo.textContent = "Error: " + sendMessageResp.error;
            return;
        }
        
        const divLine = document.createElement("div"); // whole line with message-item in it
        divLine.classList.add('messageLine');
        divLine.classList.add('sent');

        const divLineItem = document.createElement("div"); // message-item
        divLineItem.textContent = message;
        divLineItem.classList.add('bubble');

        divLine.appendChild(divLineItem);
        this.chatMessages.appendChild(divLine);

        this.messageForm.reset();
    }

    private async showConversation(otherUserId: string): Promise<void> {
        if (ApiService.getToken() === null) {
            this.chatMessages.textContent = "Error: you have to be logged in to display conversations!";
            return;
        }

        const conversationResp = await ApiService.getConversation(String(ApiService.getUserId()), otherUserId);

        if (!Array.isArray(conversationResp)) {
            this.chatMessages.textContent = "Error! " + conversationResp.error;
            return;
        }

        this.chatMessages.innerHTML = "";
        for (const message of conversationResp) {
            const divLine = document.createElement("div"); // whole line with message-item in it
            divLine.classList.add('messageLine');
            if (message.sender_id === ApiService.getUserId()) {
                divLine.classList.add('sent');
            } else {
                divLine.classList.add('received');
            }

            const divLineItem = document.createElement("div"); // message-item
            divLineItem.textContent = message.message;
            divLineItem.classList.add('bubble');

            divLine.appendChild(divLineItem);
            this.chatMessages.appendChild(divLine);
        }
    }
}