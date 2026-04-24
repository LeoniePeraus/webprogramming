import { User } from "./types.js";

export interface ApiResponse {
    success?: boolean;
    error?: string;
    token?: string;
    id?: string; // e.g. user ID after register or login
}

const API_URL = "http://webp-ilv-backend.cs.technikum-wien.at/messenger/";

export class ApiService {
    private static token: string | null = null;
    private static userId: string | null = null;

    static getToken(): string | null {
        return this.token;
    }
    static getUserId(): string | null {
        return this.userId;
    }
    static setAuth(token: string, userId: string) {
        this.token = token;
        this.userId = userId;
    }

    // Registration
    static async registerUser(
        name: string,
        email: string,
        password: string,
        group_id: string
    ): Promise<ApiResponse> {
        // POST /registrieren.php with FormData or JSON
        try {
            const response = await fetch(API_URL + "registrieren.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ // like body: `name=${name}&email=${email}&password=${password}&group_id=${group_id}`
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
        } catch (err) {
            return { success: false, error: "Invalid response" };
        }
    }

    // Login
    static async loginUser(
        email: string,
        password: string
    ): Promise<ApiResponse> {
        // POST /login.php
        try {
            const response = await fetch(API_URL + "login.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ // like body: `username_or_email=${email}&password=${password}`
                    username_or_email: email,
                    password: password
                })
            });

            if (!response.ok) {
                return { success: false, error: `${response.status}` };
            }

            return await response.json();
        } catch (err) {
            return { success: false, error: "Invalid response" };
        }
    }

    // Get Users
    static async getUsers(): Promise<User[] | { error?: string }> {
        // GET /get_users.php
        try {
            const response = await fetch(`${API_URL}get_users.php?token=${this.token}&id=${this.userId}`, {
                method: "GET"
            });

            if (!response.ok) {
                return { error: `${response.status}` };
            }

            return await response.json();
        } catch (err) {
            return { error: "Invalid response" };
        }
    }

    // Send Message
    static async sendMessage(
        senderId: string,
        receiverId: string,
        message: string
    ): Promise<ApiResponse> {
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
        } catch (err) {
            return { success: false, error: "Invalid response" };
        }
    }
}