import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// admin model
import {Admin} from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  url='api/admin'

  constructor(private httpClient:HttpClient) { }

  getAdmin(email:string){
    return this.httpClient.get<Admin>(`${this.url}/${email}`)
  }
  getAdmins(){
    return this.httpClient.get<Admin[]>(`${this.url}`)
  }
  createAdmin(newAdmin){
    console.log("creating admin: ",newAdmin)
    return this.httpClient.post<Admin>(`${this.url}`,newAdmin)
  }
}
