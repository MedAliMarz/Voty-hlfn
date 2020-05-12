import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// voter model
import {Voter} from '../models/voter.model';

@Injectable({
  providedIn: 'root'
})
export class VoterService {
  url='api/voter'

  constructor(private httpClient:HttpClient) { }

  getVoter(email:string){
    return this.httpClient.get<Voter>(`${this.url}/${email}`)
  }
  getVoters(){
    return this.httpClient.get<Voter[]>(`${this.url}`)
  }
  createVoter(newVoter){
    console.log("election ser ",newVoter)
    return this.httpClient.post<Voter>(`${this.url}`,newVoter)
  }
  vote(voteData){
    return this.httpClient.post<Voter>(`api/vote`,voteData)
  }
}
