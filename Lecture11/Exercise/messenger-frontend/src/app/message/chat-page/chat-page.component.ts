import { Component } from '@angular/core';
import { UserListComponent } from "../user-list/user-list.component";
import { ConversationComponent } from "../conversation/conversation.component";

@Component({
  selector: 'app-chat-page',
  imports: [UserListComponent, ConversationComponent],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.css',
})
export class ChatPageComponent {}
