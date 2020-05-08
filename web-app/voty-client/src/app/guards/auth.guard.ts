import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // removed initial refresh()
        const currentUser = JSON.parse(localStorage.getItem('loggedUser'));
        const token = localStorage.getItem('jwt').replace(/"/g, "");
        if (currentUser && token) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], /*{ queryParams: { returnUrl: state.url }}*/ );
        return false;
    }
}