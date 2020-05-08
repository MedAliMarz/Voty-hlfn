import { Injectable } from '@angular/core';
import {User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { VoterService } from './voter.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginUrl ='api/login'
  logoutUrl = 'api/logout'
  isAdmin:boolean;
  isLogged:boolean;
  loggedUser:any
  constructor(private httpClient:HttpClient,
    private voterService:VoterService) { }

  login(user){
    return this.httpClient.post(this.loginUrl,user).pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      console.log('login auth ,',JSON.stringify(user['token']),user)
      localStorage.setItem('jwt', JSON.stringify(user['token']));
      this.loggedUser = user;
      return user;
  }));
  }
  logout(){
    localStorage.removeItem('jwt');
    
    return this.httpClient.post(this.logoutUrl,{}).pipe(
      tap(response=>{
        this.loggedUser = null;
      })
    )
  }
  refresh(){
    this.voterService.getVoter(this.loggedUser.voterId)
      .subscribe(voter=>{
        this.loggedUser= voter;
      })
  }
}
