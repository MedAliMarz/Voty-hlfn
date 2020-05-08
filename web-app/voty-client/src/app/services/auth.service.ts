import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { VoterService } from './voter.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginUrl ='api/login'
  logoutUrl = 'api/logout'
  isAdmin:boolean;
  isLogged:boolean;
  loggedUser = null;
  constructor(private httpClient:HttpClient,
    private voterService:VoterService,
    private router:Router) { }

  login(user){
    return this.httpClient.post(this.loginUrl,user).pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      console.log('login auth ,',JSON.stringify(user['token']),user);
      localStorage.setItem('jwt', JSON.stringify(user['token']));
      localStorage.setItem('role', JSON.stringify(user['type']));
      localStorage.setItem('userId', JSON.stringify(user['voterId']));
      localStorage.setItem('loggedUser', JSON.stringify(user));
      this.loggedUser = user;
      return user;
  }));
  }
  logout(){
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('loggedUser');
    // fixed redirection
    this.router.navigate(['/login']);
    
    return this.httpClient.post(this.logoutUrl,{}).pipe(
      tap(response=>{
        this.loggedUser = null;
        this.router.navigate(['/login']);
      })
    );
  }
  refresh(){
    const currentUserId = localStorage.getItem('userId').replace(/"/g, "");
    console.log("###REFRESH=>CurrenUserId => " + currentUserId);
    this.voterService.getVoter(currentUserId)
      .subscribe(voter=>{
        this.loggedUser= voter;
        console.log("###LOGGED_USER => " + this.loggedUser);
        // since voter doesn't have a token, we need to add it from local storage
        // we need to strip out the double quotes that surround our jwt token
        this.loggedUser.token = localStorage.getItem('jwt').replace(/"/g, "");
      }, 
      (error) => {
        console.log("ERROR =>" + error);
      })
  }
}
