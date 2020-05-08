import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { ElectionService } from 'src/app/services/election.service';
import { Election } from 'src/app/models/election.model';
import {NbCalendarRange} from '@nebular/theme'
import { Voter } from 'src/app/models/voter.model';
@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.scss']
})
export class ElectionComponent implements OnInit {
  isSpinner:boolean;
  isSpinnerVoters:boolean;
  electionId:string
  election:Election
  electionVoters:Voter[]
  candidacy_range: NbCalendarRange<Date>;;
  voting_range: NbCalendarRange<Date>;;

  constructor(private router:Router,
    private toastService:NbToastrService,
    private electionService:ElectionService,
    private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.electionId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('electionId', this.electionId)
    this.isSpinner = true;
    this.loadElection()
  }
  loadElection(){
    Date.now()
    this.electionService.getElection(this.electionId)
      .subscribe(
        election=>{
        this.election = election;
        this.candidacy_range={
          start:new Date(this.election.candidacy_startDate.toString()),
          end:new Date(this.election.candidacy_endDate.toString())
        }
        this.voting_range={
          start:new Date(this.election.voting_startDate.toString()),
          end:new Date(this.election.voting_endDate.toString())
        }
        this.toastService.show('Election loaded successfully','Election',{status:'success'})
        this.isSpinner = false;
        this.isSpinnerVoters = true;
        this.loadVoters()
        
        
        },
        err=>{
          
        this.isSpinner = false;
        this.router.navigateByUrl('/admin')
        this.toastService.show('Problem occured in loading the specified election','Election',{status:'warning'})
      })
  }
  loadVoters(){
    this.electionService.getElectionVoters(this.election.electionId)
      .subscribe(voters=>{
        this.electionVoters = voters.map(voter=>voter['Record'])
        console.log('this.electionVoters', this.electionVoters)
        this.toastService.show('Voters loaded successfully','Election voters',{status:'success'})

        
        this.isSpinnerVoters = false;
      },err =>{
        console.log(err)
        
        this.router.navigateByUrl('/admin')
        this.toastService.show('Problem occured in loading voters','Election voters',{status:'warning'})
        this.isSpinnerVoters = false;

      })
  }
  handleRangeChange(data){
    console.log(data)
  }
}