import { Routes } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { LoginComponent } from './auth/login/login.component';
import { loginGuard } from './guards/login-guard';
import { ChatPageComponent } from './message/chat-page/chat-page.component';

export const routes: Routes = [
    { path: '', component: IntroComponent, title: "MessengerApp" },
    { path: 'login', component: LoginComponent, title: "Login" },
    { path: 'chat', component: ChatPageComponent, title: "Chat", canActivate: [loginGuard] }
];
