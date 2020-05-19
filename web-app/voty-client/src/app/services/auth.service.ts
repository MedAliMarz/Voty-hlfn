import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { VoterService } from './voter.service';
import { Router } from '@angular/router';
import { AdminService } from './admin.service';
import { SuperAdminService } from './superadmin.service';
import { Observable,Subject, BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginUrl ='api/login'
  logoutUrl = 'api/logout'
  isLogged:Subject<boolean>;
  loggedUser = null;
  role:Subject<string>;
  constructor(private httpClient:HttpClient,
    private voterService:VoterService,
    private adminService:AdminService,
    private superAdminService:SuperAdminService,
    private router:Router) { 
      this.isLogged = new BehaviorSubject<boolean>(false)
      this.role = new Subject()
    }

  login(user){
    console.log("###LOGIN_USER### => " ,user);
    return this.httpClient.post(this.loginUrl,user).pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      console.log('login auth ,',JSON.stringify(user['token']),user);
      localStorage.setItem('jwt', JSON.stringify(user['token']));
      localStorage.setItem('role', JSON.stringify(user['type']));
      localStorage.setItem('loggedUser', JSON.stringify(user));
      this.loggedUser = user;
      
      // routing after login success
      if(user['type'] == 'voter') {
        localStorage.setItem('userId', JSON.stringify(this.loggedUser['voterId']));
        this.router.navigateByUrl('/voter');
      }
      else if(user['type'] == 'admin') {
        localStorage.setItem('userId', JSON.stringify(this.loggedUser['email']));
        this.router.navigateByUrl('/admin');
      }
      else if(user['type'] == 'superadmin') {
        localStorage.setItem('userId', JSON.stringify(this.loggedUser['email']));
        this.router.navigateByUrl('/superadmin');
      }
      this.isLogged.next(true)
      this.role.next(user['type']);
      return user;
  }));
  }
  logout(){
    
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('loggedUser');
    // fixed redirection
    this.isLogged.next(false);
    this.role.next('');
    //this.router.navigate(['/login']);
    
    return this.httpClient.post(this.logoutUrl,{}).pipe(
      tap(response=>{
        localStorage.removeItem('jwt');
        this.loggedUser = null;
        
        this.router.navigate(['/login']);
      })
    );
  }
  refresh(){
    const currentUserId = localStorage.getItem('userId').replace(/"/g, "");
    const currentRole = localStorage.getItem('role').replace(/"/g, "");
    console.log("###REFRESH=>CurrenUserId => " + currentUserId,currentRole);
    if(!currentUserId || !currentRole){
      return
    }
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
          this.isLogged.next(true)
          this.role.next(currentRole)
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
        this.isLogged.next(true)
        this.role.next(currentRole)
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
        this.isLogged.next(true)
        this.role.next(currentRole)
      }, 
      (error) => {
        console.log("ERROR =>" + error);
      })
    }
  }
}
/*
constructor() 
public schoolObservable = new Observable(observer => {
   observer.next(this.schoolID);
   this.updateObservable = (newValue) => {
      observer.next(newValue); observer.complete(); 
    }; 
  });
*/