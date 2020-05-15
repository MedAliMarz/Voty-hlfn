import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// super admin model
import {SuperAdmin} from '../models/superadmin.model';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {
  url='api/superadmin'

  constructor(private httpClient:HttpClient) { }

  getSuperAdmin(email:string){
    return this.httpClient.get<SuperAdmin>(`${this.url}/${email}`)
  }

}
