import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
@Injectable()
export class LogoutGuard implements CanActivate {
    constructor(private router: Router) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const token = localStorage.getItem('jwt');
        if (token) {
            this.router.navigate(['/']);
            return false;
        }
        else {
            this.router.navigate(['/login']);
            return true;
        }
    }
}