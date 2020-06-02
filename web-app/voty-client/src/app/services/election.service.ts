import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// election model
import {Election} from '../models/election.model';
import { Voter } from '../models/voter.model';
@Injectable({
  providedIn: 'root'
})
export class ElectionService {
  url='api/election'
  constructor(private httpClient:HttpClient) { }

  getElection(electionId:string){
    return this.httpClient.get<Election>(`${this.url}/${electionId}`)
  }
  getElectionVoters(electionId:string){
    return this.httpClient.get<Voter[]>(`${this.url}/${electionId}/voters`)
  }
  getElectionCandidates(electionId:string){
    return this.httpClient.get<Voter[]>(`${this.url}/${electionId}/candidates`)
  }
  getElections(){
    return this.httpClient.get<Election[]>(`${this.url}`)
  }
  createElection(newElection){
    console.log("election ser ",newElection)
    return this.httpClient.post<Election>(`${this.url}`,newElection)
  }
  updateElection(electionId,electionData){
    return this.httpClient.put<Election>(`${this.url}/${electionId}`,electionData)
  }
  activateElection(electionId){
    return this.httpClient.put<Election>(`api/activateElection`,{electionId})
  }
  getStanding(electionId){
    return this.httpClient.post('api/standing',{electionId})
  }
}
