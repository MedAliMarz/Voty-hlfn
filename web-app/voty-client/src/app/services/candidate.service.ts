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

  getCandidate(candidate_email:string){
    console.log('candidate email in candidate auth', candidate_email)
    return this.httpClient.get<Voter>(`${this.url}/${candidate_email}`)
  }
  getCandidates(){
    return this.httpClient.get<Voter[]>(`${this.url}`)
  }
  createCandidate(newCandidate){
    console.log("candiate ",newCandidate)
    return this.httpClient.post<Voter>(`${this.url}`,newCandidate)
  }
  toggleCandidacy(toggleData){
    // toggleData : {electionId, voterId}
    return this.httpClient.put<Voter>(`api/toggleCandidate`,toggleData)
  }
}
