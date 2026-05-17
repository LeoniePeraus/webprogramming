import { Injectable, signal } from '@angular/core';
import { User } from '../message/user-list/user-list.component';
import { ChatMessage } from '../message/conversation/conversation.component';

interface UsersResponse {
    users: User[];
    error: string | null;
};

interface conversationResponse {
    chatMessages: ChatMessage[];
    error: string | null;
};

const initialLoginStatus = {
    loggedIn: false,
    loginError: "",
    id: "",
    username: "",
    token: ""
};

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private apiUrl = `http://webp-ilv-backend.cs.technikum-wien.at/messenger/`;

    private _loginStatus = signal(initialLoginStatus);
    public loginStatus = this._loginStatus.asReadonly();

    constructor() { }

    /**
     * logs in and updates signal loginStatus
     * @param username 
     * @param password 
     * @returns 
     */
    async login(username: string, password: string): Promise<void> {
        try {
            const response = await fetch(this.apiUrl + "login.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ // like body: `username_or_email=${email}&password=${password}`
                    username_or_email: username,
                    password: password
                })
            });

            if (!response.ok) {
                this._loginStatus.set({
                    loggedIn: false,
                    loginError: `${response.status}`,
                    id: "",
                    username: "",
                    token: ""
                });
            }

            const data = await response.json();
            this._loginStatus.set({
                loggedIn: true,
                loginError: "",
                id: data.id,
                username: username,
                token: data.token
            });

        } catch (err) {
            this._loginStatus.set({
                loggedIn: false,
                loginError: "Invalid response",
                id: "",
                username: "",
                token: ""
            });
        }
    }

    /**
     * logs out and updates signal loginStatus
     */
    logout() {
        this._loginStatus.set(initialLoginStatus);
    }

    // other API calls
    async getUsers(): Promise<UsersResponse> {
        try {
            const response = await fetch(`${this.apiUrl}get_users.php?token=${this.loginStatus().token}&id=${this.loginStatus().id}`, {
                method: "GET"
            });

            if (!response.ok) {
                return {
                    users: [],
                    error: `${response.status}`
                };
            }

            const users = await response.json();
            return {
                users,
                error: null
            };
        } catch (err) {
            return {
                users: [],
                error: "Invalid response"
            };
        }
    }

    async getConversation(user1_id: string, user2_id: string): Promise<conversationResponse> {
        try {
            const response = await fetch(`${this.apiUrl}get_conversation.php?token=${this.loginStatus().token}&user1_id=${user1_id}&user2_id=${user2_id}`, {
                method: "GET"
            });

            if (!response.ok) {
                return {
                    chatMessages: [],
                    error: `${response.status}`
                };
            }

            const chatMessages = await response.json();
            return {
                chatMessages,
                error: null
            };
        } catch (err) {
            return {
                chatMessages: [],
                error: "Invalid response"
            };
        }
    }

    async sendMessage(senderId: string, receiverId: string, message: string ): Promise<{ error?: string }> {
        try {
            const response = await fetch(this.apiUrl + "send_message.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `token=${this.loginStatus().token}&sender_id=${senderId}&receiver_id=${receiverId}&message=${message}`
            });

            if (!response.ok) {
                return { error: `${response.status}` };
            }

            const data = await response.json();
            if (!data.success) {
                return { error: data.error };
            }
            return {};
        } catch (err) {
            return { error: "Invalid response" };
        }
    }
}
