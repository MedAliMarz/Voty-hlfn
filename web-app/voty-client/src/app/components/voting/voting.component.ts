import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Voter } from 'src/app/models/voter.model';
import {VoterService} from 'src/app/services/voter.service';
import {CandidateService} from 'src/app/services/candidate.service';
import {AuthService} from 'src/app/services/auth.service';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss']
})
export class VotingComponent implements OnInit {
  @ViewChild("dialog") dialog:TemplateRef<any>
  constructor(private dialogService:NbDialogService,
    private voterService:VoterService,
    private candidateService:CandidateService,
    public authService:AuthService,
    private toastService:NbToastrService) { }
  voteForm:FormGroup
  isSpinner:boolean = false
  candidates:Voter[];
  loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  ngOnInit(): void {
    this.voteForm = new FormGroup({
      candidateEmail: new FormControl('',[Validators.required]),

    })
    this.isSpinner = true
    this.loadCandidates();
  }
  vote(){
    console.log("voting for ", this.voteForm.value)
    let ref = this.dialogService.open(this.dialog,{context:"Make sure of candidate choice before procceding !"});
    ref.onClose.subscribe(value=> {
      if(value){
        console.log('User validated the vote')
        this.isSpinner = true
        this.initVote()
      }else{
        console.log('User declined the vote')
      }
    })
  }
  initVote(){
    this.isSpinner = false;
    let voteData ={
      voter_email:this.loggedUser.email,
      candidate_email:this.voteForm.value.candidateEmail,
      electionId:this.loggedUser.electionId
    }
    console.log('voteData', voteData)
    this.voterService.vote(voteData)
      .subscribe(vote=>{
        console.log("voting vote res ", vote)
        this.authService.refresh()
        this.isSpinner = false
        this.toastService.show("Congrats, your vote is recorded","Vote",{status:'success',duration:4000})
      
      }
      ,err=>{
        console.log("voting err", err)
        this.isSpinner = false
        this.toastService.show("Something wrong, vote later","Vote",{status:'danger'})

      })
    
    
  }
  loadCandidates(){
    
    this.candidateService.getCandidates()
      .subscribe(
        candidates=>{
          console.log(candidates)
          console.log('loggedUser.electionId ', this.loggedUser.electionId)
          this.candidates = candidates.filter(candidate=>{
            return (candidate.electionId == this.loggedUser.electionId)
          })
          console.log(this.candidates)
          this.isSpinner = false

      },
      err=>{
        console.log("Problem in loading candidates")
        this.isSpinner = false

      })
  }
}
