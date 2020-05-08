import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let token = localStorage.getItem('jwt');
        console.log('token ', token );
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token.replace(/"/g, "")}`
                }
            });
        }
        console.log('request', request);
        return next.handle(request);
    }
}