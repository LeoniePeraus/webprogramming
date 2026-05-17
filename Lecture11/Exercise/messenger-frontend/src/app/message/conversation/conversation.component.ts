import { Component, effect, signal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SignalService } from '../../services/signal.service';
import { User } from '../user-list/user-list.component';
import { FormsModule } from '@angular/forms';

export interface ChatMessage {
    sender_id: string;
    receiver_id: string;
    message: string;
    timestamp: string;
}

@Component({
  selector: 'app-conversation',
  imports: [FormsModule],
  templateUrl: './conversation.component.html',
  styleUrl: './conversation.component.css',
})
export class ConversationComponent {
    currentUserId: string = "";
    selectedUser: User | null = null;
    
    newMessage: string = ""; // from input field

    messages = signal<ChatMessage[]>([]);
    error = signal<string | null>(null);
    isLoading = signal<boolean>(false);

    constructor(
        private apiService: ApiService,
        private signalService: SignalService
    ) {
        effect(() => { // automatically reruns when a signal inside changes
            this.selectedUser = signalService.selectedUser();
            if (!this.selectedUser) { return; }
            this.loadConversation();
        });
    }

    async loadConversation(): Promise<void> {
        if (!this.selectedUser) { return; }

        this.isLoading.set(true);

        this.currentUserId = this.apiService.loginStatus().id;
        const result = await this.apiService.getConversation(this.currentUserId, this.selectedUser.id);
        if (result.error) {
            this.error.set(result.error);
        } else {
            this.messages.set(result.chatMessages);
            this.scrollToBottom();
        }

        this.isLoading.set(false);
    }

    async sendMessage(): Promise<void> {
        if (!this.selectedUser) { return; }

        const messageToAdd: ChatMessage = {
            sender_id: this.currentUserId,
            receiver_id: this.selectedUser.id,
            message: this.newMessage.trim(),
            timestamp: new Date().toISOString()
        };

        const result = await this.apiService.sendMessage(messageToAdd.sender_id, messageToAdd.receiver_id, messageToAdd.message);
        if (result.error) {
            this.error.set(result.error);
        } else {
            this.messages.update(msgs => [...msgs, messageToAdd]); // same as .update(msgs => msgs.concat(messagesToAdd)) or .set([...this.messages(), messageToAdd])
            this.newMessage = "";
            this.scrollToBottom();
        }
    }

    scrollToBottom(): void {
        setTimeout(() => {
            const container = document.getElementById('chat-messages');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }, 0); // because Angular needs time to render new message first before scrolling
    }

    // just for prettier layout
    isNewDay(previousTimestamp: string, currentTimestamp: string): boolean {
        const previousDate = previousTimestamp.split(' ')[0];
        const currentDate = currentTimestamp.split(' ')[0];
        return previousDate !== currentDate;
    }

    formatDate(timestamp: string): string {
        const date = new Date(timestamp);
        return date.toLocaleDateString('de-AT');
    }

    formatTime(timestamp: string): string {
        return timestamp.split(' ')[1].slice(0, 5);
    }
}
