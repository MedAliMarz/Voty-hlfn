import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class VoterGuard implements CanActivate {
    constructor(
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const role = localStorage.getItem('role').replace(/"/g, "");
        if (role && role == 'voter') {
            // authorized, since he's a voter
            return true;
        }

        // a different role, unauthorized, redirect to landing page logically
        this.router.navigate(['/landing']); // ikr should be '/' later
        return false;
    }
}