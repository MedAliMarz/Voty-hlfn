import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { VoterService } from './voter.service';
import { Router } from '@angular/router';
import { AdminService } from './admin.service';
import { SuperAdminService } from './superadmin.service';

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
    private adminService:AdminService,
    private superAdminService:SuperAdminService,
    private router:Router) { }

  login(user){
    console.log("###LOGIN_USER### => " ,user);
    return this.httpClient.post(this.loginUrl,user).pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      console.log('login auth ,',JSON.stringify(user['token']),user);
      localStorage.setItem('jwt', JSON.stringify(user['token']));
      localStorage.setItem('role', JSON.stringify(user['type']));
      localStorage.setItem('email', JSON.stringify(user['email']));
      localStorage.setItem('loggedUser', JSON.stringify(user));
      this.loggedUser = user;
      // routing after login success
      if(user['type'] == 'voter') {
        this.router.navigateByUrl('/voter');
      }
      else if(user['type'] == 'admin') {
        this.router.navigateByUrl('/admin');
      }
      else if(user['type'] == 'superadmin') {
        this.router.navigateByUrl('/superadmin');
      }
      return user;
  }));
  }
  logout(){
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
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
    const currentUserId = localStorage.getItem('email').replace(/"/g, "");
    console.log("###REFRESH=>CurrenUserId => " + currentUserId);
    const currentRole = localStorage.getItem('role').replace(/"/g, "");
    if(currentRole == 'voter') {
      this.voterService.getVoter(currentUserId)
        .subscribe(voter=>{
          this.loggedUser= voter;
          console.log("###LOGGED_USER => " + this.loggedUser);
          // since voter doesn't have a token, we need to add it from local storage
          // we need to strip out the double quotes that surround our jwt token
          this.loggedUser.token = localStorage.getItem('jwt').replace(/"/g, "");
          // this update is essential for voting, since the hasVoted will be updated
          localStorage.setItem('loggedUser', JSON.stringify(voter));
        }, 
        (error) => {
          console.log("ERROR =>" + error);
        })
    }
    else if(currentRole == 'admin') {
      this.adminService.getAdmin(currentUserId)
      .subscribe(admin=>{
        this.loggedUser= admin;
        console.log("###LOGGED_USER => " + this.loggedUser);
        // since admin doesn't have a token, we need to add it from local storage
        // we need to strip out the double quotes that surround our jwt token
        this.loggedUser.token = localStorage.getItem('jwt').replace(/"/g, "");
        localStorage.setItem('loggedUser', JSON.stringify(admin));
      }, 
      (error) => {
        console.log("ERROR =>" + error);
      })
    }
    else if(currentRole == 'superadmin') {
      this.superAdminService.getSuperAdmin(currentUserId)
      .subscribe(superAdmin=>{
        this.loggedUser= superAdmin;
        console.log("###LOGGED_USER => " + this.loggedUser);
        // since admin doesn't have a token, we need to add it from local storage
        // we need to strip out the double quotes that surround our jwt token
        this.loggedUser.token = localStorage.getItem('jwt').replace(/"/g, "");
        localStorage.setItem('loggedUser', JSON.stringify(superAdmin));
      }, 
      (error) => {
        console.log("ERROR =>" + error);
      })
    }
  }
}
