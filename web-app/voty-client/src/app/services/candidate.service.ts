import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// voter / candidate model
import {Voter} from '../models/voter.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  url='api/candidate'

  constructor(private httpClient:HttpClient) { }

  getCandidate(candidateId:string){
    console.log('candidate id in candidate auth', candidateId)
    return this.httpClient.get<Voter>(`${this.url}/${candidateId}`)
  }
  getCandidates(){
    return this.httpClient.get<Voter[]>(`${this.url}`)
  }
  createCandidate(newCandidate){
    console.log("candiate ",newCandidate)
    return this.httpClient.post<Voter>(`${this.url}`,newCandidate)
  }
  updateCandidacy(updatedCandidate){
    // updatedCandidate : {electionId, voterId,data,isActive}
    return this.httpClient.put<Voter>(`${this.url}`,updatedCandidate)
  }
}
