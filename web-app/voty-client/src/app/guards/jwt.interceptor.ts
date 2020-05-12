import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { catchError } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class JwtInterceptor implements HttpInterceptor {

    constructor(private authenticationService: AuthService,
        private router:Router,
        private toastService:NbToastrService) { }

    private handleError(err: HttpErrorResponse): Observable<any> {
        let errorMsg;
        if (err.error instanceof Error) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMsg = `An error occurred: ${err.error.message}`;
            this.toastService.show('Some problem occured, repeat the action','Warning',{status:"warning"})
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMsg = `Backend returned code ${err.status}, body was: ${err.error}`;
            console.log(errorMsg)
        }
        if (err.status === 404 || err.status === 403) {

            this.toastService.show('unauthorized access','Problem',{status:"danger"})
            localStorage.removeItem('jwt');
            localStorage.removeItem('loggedUser');
            localStorage.removeItem('role');
            this.router.navigateByUrl(`/login`);
        }
        console.error(errorMsg);
        return Observable.throw(errorMsg);
    }
    

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
        return next.handle(request).pipe(catchError(err => this.handleError(err)));
    }
}