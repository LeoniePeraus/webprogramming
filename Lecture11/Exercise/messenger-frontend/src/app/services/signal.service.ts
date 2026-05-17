import { Injectable, signal } from '@angular/core';
import { User } from '../message/user-list/user-list.component';

@Injectable({
  providedIn: 'root',
})
export class SignalService {
    // signals used in more than one component
    selectedUser = signal<User | null>(null);
}
