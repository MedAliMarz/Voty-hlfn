import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NbToastrService, NbThemeService, NbDialogService } from '@nebular/theme';
import { ElectionService } from 'src/app/services/election.service';
import { Election } from 'src/app/models/election.model';
import {NbCalendarRange} from '@nebular/theme'
import { Voter } from 'src/app/models/voter.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-election',
  templateUrl: './election.component.html',
  styleUrls: ['./election.component.scss']
})
export class ElectionComponent implements OnInit {
  @ViewChild("dialog") dialog:TemplateRef<any>

  
  isSpinner:boolean;
  isSpinnerVoters:boolean;
  isModify:boolean = false;
  
  electionId:string
  election:Election
  electionVoters:Voter[]
  candidacy_range: NbCalendarRange<Date>;;
  voting_range: NbCalendarRange<Date>;;

  candidacy_start_hour:string;
  candidacy_end_hour:string;
  voting_start_hour:string;
  voting_end_hour:string;

  electionForm:FormGroup;
  constructor(private router:Router,
    private toastService:NbToastrService,
    private electionService:ElectionService,
    private activatedRoute:ActivatedRoute,
    private dialogService:NbDialogService,
    private themeService:NbThemeService,
    public authService:AuthService) { }

  ngOnInit(): void {
    this.isModify = false;
    this.electionId = this.activatedRoute.snapshot.paramMap.get('id');
    this.themeService.changeTheme('dark')
    console.log('electionId', this.electionId)
    this.isSpinner = true;
    this.electionForm = new FormGroup({
      name : new FormControl({value:'',disabled:true},[]),
      description : new FormControl({value:'',disabled:!this.isModify},[Validators.required]),
      organisation : new FormControl({value:'',disabled:!this.isModify},[Validators.required]),
    })
    this.loadElection()
  }


  
  toggleModification(){
    this.isModify = !this.isModify;
    this.isModify?this.electionForm.enable():this.electionForm.disable()
  }
  loadElection(){
    Date.now()
    this.electionService.getElection(this.electionId)
      .subscribe(
        election=>{
        this.election = election;
        this.electionForm.setValue({
          'name':this.election.name,
          'description':this.election.description,
          'organisation':this.election.organisation,
        })
        let candidacy_startDate = new Date(this.election.candidacy_startDate.toString())
        let candidacy_endDate = new Date(this.election.candidacy_endDate.toString())
        let voting_startDate = new Date(this.election.voting_startDate.toString())
        let voting_endDate = new Date(this.election.voting_endDate.toString())
        this.candidacy_range={
          start:candidacy_startDate,
          end:candidacy_endDate
        }
        this.voting_range={
          start:voting_startDate,
          end:voting_endDate
        }
        this.candidacy_start_hour = [candidacy_startDate.getHours().toString().padStart(2,'0'),candidacy_startDate.getMinutes().toString().padStart(2,'0')].join(':') 
        this.candidacy_end_hour = [candidacy_endDate.getHours().toString().padStart(2,'0'),candidacy_endDate.getMinutes().toString().padStart(2,'0')].join(':') 
        this.voting_start_hour = [voting_startDate.getHours().toString().padStart(2,'0'),voting_startDate.getMinutes().toString().padStart(2,'0')].join(':') 
        this.voting_end_hour = [voting_endDate.getHours().toString().padStart(2,'0'),voting_endDate.getMinutes().toString().padStart(2,'0')].join(':') 

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
        this.electionVoters = voters;
        console.log('this.electionVoters', this.electionVoters);
        this.toastService.show('Voters loaded successfully','Election voters',{status:'success'})

        
        this.isSpinnerVoters = false;
      },err =>{
        console.log(err)
        
        this.router.navigateByUrl('/admin')
        this.toastService.show('Problem occured in loading voters','Election voters',{status:'warning'})
        this.isSpinnerVoters = false;

      })
  }
  modifyElection(){
    console.log("modif ",this.electionForm.value)
    let ref = this.dialogService.open(this.dialog,{context:"Make sure of the changes!"});
    ref.onClose.subscribe(value=> {
      if(value){
        console.log('User validated the modifications')
        this.isSpinner = true
        this.patchElection()
      }else{
        console.log('User declined the modifications')
      }
    })
  }
  patchElection(){
    this.electionService.updateElection(this.election.electionId,this.electionForm.value)
      .subscribe(
        election=>{
          this.election = election
          this.isSpinner = false
          this.toggleModification();
          this.toastService.show('Election patched successfully','Election',{status:'success'})
        
        },
        err=>{
          this.isSpinner = false
          this.isModify = false
          this.toastService.show('Election patched failed','Election',{status:'warning'})
          this.electionForm.setValue({
            'name':this.election.name,
            'description':this.election.description,
            'organisation':this.election.organisation,
          })
        }
      )
  }
  activateElection(){
    let ref = this.dialogService.open(this.dialog,{context:"Are you sure to approve this election ?!"});
    ref.onClose.subscribe(value=> {
      if(value){

        this.isSpinner = true
        this.electionService.activateElection(this.electionId)
          .subscribe(
            election=>{
              this.toastService.show('Election has been approved','Election',{status:'success'})
              this.election = election
              this.isSpinner = false
            }
            ,err=>{
              this.toastService.show('Election approving has failed','Election',{status:'warning'})
              this.isSpinner = false
            }
          )
      }else{

      }
    })
  }
  handleCandidacyRangeChange(data){
    console.log(data)
    this.candidacy_range={
      start:new Date(this.election.candidacy_startDate.toString()),
      end:new Date(this.election.candidacy_endDate.toString())
    }
    
  }
  handleVotingRangeChange(data){
    console.log(data)
    this.voting_range={
      start:new Date(this.election.voting_startDate.toString()),
      end:new Date(this.election.voting_endDate.toString())
    }
  }
}