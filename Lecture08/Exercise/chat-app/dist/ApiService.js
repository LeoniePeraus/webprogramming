const API_URL = "http://webp-ilv-backend.cs.technikum-wien.at/messenger/";
export class ApiService {
    static getToken() {
        return this.token;
    }
    static getUserId() {
        return this.userId;
    }
    static setAuth(token, userId) {
        this.token = token;
        this.userId = userId;
    }
    // Registration
    static async registerUser(name, email, password, group_id) {
        // POST /registrieren.php with FormData or JSON
        try {
            const response = await fetch(API_URL + "registrieren.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    name,
                    email,
                    password,
                    group_id
                })
            });
            if (!response.ok) {
                return { success: false, error: `${response.status}` };
            }
            return await response.json();
        }
        catch (err) {
            return { success: false, error: "Invalid response" };
        }
    }
    // Login
    static async loginUser(email, password) {
        // POST /login.php
        try {
            const response = await fetch(API_URL + "login.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    username_or_email: email,
                    password: password
                })
            });
            if (!response.ok) {
                return { success: false, error: `${response.status}` };
            }
            return await response.json();
        }
        catch (err) {
            return { success: false, error: "Invalid response" };
        }
    }
    // Get Users
    static async getUsers() {
        // GET /get_users.php
        try {
            const response = await fetch(`${API_URL}get_users.php?token=${this.token}&id=${this.userId}`, {
                method: "GET"
            });
            if (!response.ok) {
                return { error: `${response.status}` };
            }
            return await response.json();
        }
        catch (err) {
            return { error: "Invalid response" };
        }
    }
    // Send Message
    static async sendMessage(senderId, receiverId, message) {
        // POST /send_message.php
        try {
            const response = await fetch(API_URL + "send_message.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `token=${this.token}&sender_id=${senderId}&receiver_id=${receiverId}&message=${message}`
            });
            if (!response.ok) {
                return { success: false, error: `${response.status}` };
            }
            return await response.json();
        }
        catch (err) {
            return { success: false, error: "Invalid response" };
        }
    }
}
ApiService.token = null;
ApiService.userId = null;
