import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Voter } from 'src/app/models/voter.model';
import {VoterService} from 'src/app/services/voter.service';
import {ElectionService} from 'src/app/services/election.service';
import {AuthService} from 'src/app/services/auth.service';
import { Election } from 'src/app/models/election.model';

@Component({
  selector: 'app-voting',
  templateUrl: './voting.component.html',
  styleUrls: ['./voting.component.scss']
})
export class VotingComponent implements OnInit {
  @ViewChild("dialog") dialog:TemplateRef<any>
  constructor(private dialogService:NbDialogService,
    private voterService:VoterService,
    private electionService:ElectionService,
    public authService:AuthService,
    private toastService:NbToastrService) { }
  voteForm:FormGroup
  isSpinner:boolean = false
  candidates:Voter[];
  election:Election
  timer_data = null;
  hasEnded:boolean=false;
  hasStarted:boolean=false;
  loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  ngOnInit(): void {

    this.loadVotingTime()
    this.voteForm = new FormGroup({
      candidateId: new FormControl('',[Validators.required]),

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
      voterId:this.loggedUser.voterId,
      candidateId:this.voteForm.value.candidateId,
      electionId:this.loggedUser.electionId
    }
    console.log('voteData', voteData)
    this.voterService.vote(voteData)
      .subscribe(vote=>{
        console.log("voting vote res ", vote);
        this.authService.refresh();
        this.isSpinner = false;
        this.loggedUser.hasVoted = true;
        this.toastService.show("Congrats, your vote is recorded","Vote",{status:'success',duration:4000})
      }
      ,err=>{
        console.log("voting err", err)
        this.isSpinner = false
        this.toastService.show("Something wrong, vote later","Vote",{status:'danger'})

      })
    
    
  }
  loadCandidates(){
    
    this.electionService.getElectionCandidates(this.loggedUser.electionId)
      .subscribe(
        candidates=>{
          console.log(candidates)
          console.log('loggedUser.electionId ', this.loggedUser.electionId)
          this.candidates = candidates;
          console.log(this.candidates)
          this.isSpinner = false

      },
      err=>{
        console.log("Problem in loading candidates")
        this.isSpinner = false

      })
  }
  loadVotingTime(){
    this.electionService.getElection(this.loggedUser.electionId)
      .subscribe(
        election=>{
          this.election = election;
          let start = election.voting_startDate;
          let end = election.voting_endDate;
          this.initTimers(start,end)
        },
        err=>{

        }
      )
  }
  initTimers(startDate,endDate){
    var countDownDate = new Date(endDate).getTime();
    var countUpDate = new Date(startDate).getTime();
    // Update the count down every 1 second
    var now = new Date().getTime();
    if(now < countUpDate){
      var distance = countDownDate - now;

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      this.timer_data = `Election will start in ${days}d ${hours}h ${minutes}m ${seconds}s`
    }else{
      this.hasStarted = true;
    var x = setInterval(() => {
      var now = new Date().getTime();
      var distance = countDownDate - now;

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        this.timer_data = "Election Phase Has Ended!";
        clearInterval(x);
        this.hasEnded =true  
      }
      
      this.timer_data =  `Election ends in ${days}d ${hours}h ${minutes}m ${seconds}s`
    
      }, 1000);
    }
  }
}
