import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

export const loginGuard: CanActivateFn = () => {
    const apiService = inject(ApiService);
    const router = inject(Router);

    const isLoggedIn: boolean = apiService.loginStatus().loggedIn;
    if (isLoggedIn) {
        return true;
    }

    router.navigate(['/login']);
    return false;
};
