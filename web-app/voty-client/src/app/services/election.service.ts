import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// election model
import {Election} from '../models/election.model';
@Injectable({
  providedIn: 'root'
})
export class ElectionService {
  url='api/election'
  constructor(private httpClient:HttpClient) { }

  getElection(electionId:string){
    return this.httpClient.get<Election>(`${this.url}/${electionId}`)
  }
  getElections(){
    return this.httpClient.get<Election[]>(`${this.url}`)
  }
  createElection(newElection){
    console.log("election ser ",newElection)
    return this.httpClient.post<Election>(`${this.url}`,newElection)
  }
}
