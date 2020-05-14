import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
    constructor(
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const role = localStorage.getItem('role').replace(/"/g, "");
        if (role && role == 'admin') {
            // authorized, since he's an admin
            return true;
        }

        // a different role, unauthorized, redirect to landing page logically
        this.router.navigate(['/landing']); // ikr should be '/' later
        return false;
    }
}