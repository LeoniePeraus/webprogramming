import { ApiService } from "./ApiService.js";
import { ChatUI } from "./ChatUI.js";
// my main
const ui = new ChatUI();
ui.init();
// not used!
async function main() {
    // 1) Possibly register or login a user
    const loginResp = await ApiService.loginUser("test@example.com", "password123");
    if (loginResp.error) {
        console.error("Login failed:", loginResp.error);
        return;
    }
    console.log("Login success, token:", ApiService.getToken(), "UserID:", ApiService.getUserId());
    // 2) Fetch the user list
    const usersResp = await ApiService.getUsers();
    console.log("All users:", usersResp);
    // 3) Send a message to a hardcoded user
    const sending = await ApiService.sendMessage("1", "2", "Hello from TypeScript!");
    console.log("Message sent?", sending);
    // 4) Render a chat UI
    const container = document.getElementById("chat-container");
    if (container) {
        const ui = new ChatUI();
        // For next week, you'd do something like:
        // ui.renderConversation(container, {id: "1", name: "Me", group_id: "1"}, {id: "2", name: "Bob", group_id: "1"});
    }
}
// main();
