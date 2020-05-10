import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })

export class LoginGuard implements CanActivate {
    constructor(private router: Router,
                private authService: AuthService) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if(localStorage.length >= 3) {
            const token = localStorage.getItem('jwt').replace(/"/g, "");
            const role = localStorage.getItem('role').replace(/"/g, "");
            const userId = localStorage.getItem('userId').replace(/"/g, "");
            console.log("##TOKEN## => " + token);
            console.log("##ROLE## => " + role);
            console.log("##USER_ID## => " + userId);

            if (token && userId && role) {
                this.authService.refresh();
                if(role == 'voter') {
                    console.log("in voter =>");
                    this.router.navigate(['/voter']);
                }
                else if(role == 'admin') {
                    console.log("in admin =>");
                    this.router.navigate(['/admin']);
                }
                return false;
            }
        }
        return true;
    }
}