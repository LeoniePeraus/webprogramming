import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { SignalService } from '../../services/signal.service';

export interface User {
    id: string;
    name: string;
    group_id: string;
}

@Component({
  selector: 'app-user-list',
  imports: [],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent implements OnInit {
    readonly contacts = signal<User[]>([]);
    error = signal<string | null>(null);

    constructor(
        private apiService: ApiService,
        private signalService: SignalService
    ) {}

    ngOnInit(): void {
        this.getUserList();
    }

    async getUserList(): Promise<void> {
        const result = await this.apiService.getUsers();
        if (result.error) {
            this.error.set(result.error);
        } else {
            this.contacts.set(result.users);
        }
    }

    selectUser(user: User) {
        this.signalService.selectedUser.set(user);
    }
}
