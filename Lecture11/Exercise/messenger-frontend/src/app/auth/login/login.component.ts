import { Component, inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
    username: string = "";
    password: string = "";
    apiService = inject(ApiService);
    loginStatus = this.apiService.loginStatus;

    async login() {
        await this.apiService.login(this.username, this.password);
    }

    logout() {
        this.username = "";
        this.password = "";
        this.apiService.logout();
    }
}
