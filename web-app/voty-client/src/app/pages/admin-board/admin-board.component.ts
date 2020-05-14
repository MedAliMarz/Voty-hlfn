import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn ,AbstractControl, ValidationErrors} from '@angular/forms';
import { NbThemeService, NbToastrService, NbDialogService } from '@nebular/theme';
import { ElectionService } from 'src/app/services/election.service';
import { VoterService } from 'src/app/services/voter.service'
import { CandidateService } from 'src/app/services/candidate.service'

import async from 'async'; 
// election model
import {Election} from '../../models/election.model';
// smart table
import { LocalDataSource } from 'ng2-smart-table';
@Component({
  selector: 'app-admin-board',
  templateUrl: './admin-board.component.html',
  styleUrls: ['./admin-board.component.scss']
})
export class AdminBoardComponent implements OnInit {
  @ViewChild('stepper') stepper;
  @ViewChild("dialog") dialog:TemplateRef<any>
  elections:Election[]
  isHidden:boolean=true;
  isSpinner:boolean=false;
  isLoading : boolean= true;
  // date = Date;
  electionSubmitted = false;
  createdElection:Election = null;
  votersSumbitted = false;
  constructor(private dialogService:NbDialogService,private toastService:NbToastrService,
    private themeService:NbThemeService,private electionService:ElectionService,
    private voterService:VoterService,private candidateService:CandidateService) { }
  settings = {
    add: {
      inputClass:'',
      addButtonContent: '+',
      createButtonContent: '&#9745;',
      cancelButtonContent: '&#9746;',
    },
    edit: {
      inputClass:'',
      editButtonContent: '&#9998;',
      saveButtonContent: '&#9745;',
      cancelButtonContent: '&#9746;',
    },
    delete: {
      inputClass:'',
      deleteButtonContent: '&#10005;',
      confirmDelete: true,
    },
    columns: {
      
      firstName: {
        title: 'First Name'
      },
      lastName: {
        title: 'Last Name'
      },
      email: {
        title: 'Email'
      },
      data: {
        title: 'Data'
      }
    }
  };
  electionForm:FormGroup;
  votersForm:FormGroup;
  votersDataSource:LocalDataSource
  

  startingDay:Date;
  ngOnInit(): void {
    this.themeService.changeTheme("dark");
   
    this.loadElections()
    this.electionForm = new FormGroup({
      name : new FormControl('',[Validators.required]),
      description : new FormControl('',[Validators.required]),
      organisation : new FormControl('',[Validators.required]),
      candidacy_range : new FormControl('',[Validators.required]),
      voting_range : new FormControl('',[Validators.required]),
      candidacy_start_hour : new FormControl('',[Validators.required,]),
      candidacy_end_hour : new FormControl('',[Validators.required,]),
      voting_start_hour : new FormControl('',[Validators.required,]),
      voting_end_hour : new FormControl('',[Validators.required,]),
    },{validators:[candidacyPhaseValidator,votingPhaseValidator]})
    this.votersDataSource = new LocalDataSource()
    this.votersForm = new FormGroup({

    });
  }
  createElection(){
    let ref = this.dialogService.open(this.dialog,{context:"Are you sure to create the election"});
    ref.onClose.subscribe(value=> {
      if(value){
        this.isSpinner=true;
        this.initElection()
      }else{
        console.log("User refused creation")
      }
    })
  }
  initElection(){
    if(!this.electionForm.invalid && !this.electionSubmitted){
      this.electionSubmitted = true
      let admin_email = localStorage.getItem('email').replace(/"/g, "");
      let newElection = this.electionForm.value;
      // add the admin's email, we need it to verify that he's allowed to create the election
      newElection.admin_email = admin_email;
      newElection.candidacy_startDate = this.modifDate(newElection.candidacy_range.start,newElection.candidacy_start_hour).toString()
      newElection.candidacy_endDate = this.modifDate(newElection.candidacy_range.end,newElection.candidacy_end_hour).toString()
      newElection.voting_startDate = this.modifDate(newElection.voting_range.start,newElection.voting_start_hour).toString()
      newElection.voting_endDate = this.modifDate(newElection.voting_range.end,newElection.voting_end_hour).toString()

      this.electionService.createElection(newElection)
        .subscribe(election=>{
          this.createdElection = election;
          this.electionSubmitted = true;
          this.toastService.show('A new election is successfully created','Election Created',{status:'success'})
          
          this.loadElections()
          this.isSpinner =false;
          this.stepper.next()
        },err => {
          this.isSpinner =false;
          this.toastService.show('An error occured while creating the election','Error',{status:'warning'})
        })
    }

  }
  createVoters(){
    console.log('Creating voters ',this.votersDataSource['data'] )
    let ref = this.dialogService.open(this.dialog,{context:"Are you sure to add the voters"});
    ref.onClose.subscribe(value=> {
      if(value){
        console.log("continue with adding")
        this.isSpinner=true;
        this.initVoters();
      }else{
        console.log("user refused adding voters")

      }
    })
  }
  initVoters(){
    
    if(!this.votersSumbitted && this.votersDataSource['data'].length && this.createdElection)
    {
      let voters =  this.votersDataSource['data']
        .map(voter=>{
        voter['electionId'] = this.createdElection['electionId'];
        voter['admin_email'] = localStorage.getItem('email').replace(/"/g, "");
        return voter;
        })
        async.eachOfSeries(voters, (voter, index, callback)=> {

          // Perform creation of each voter
          
          this.voterService.createVoter(voter)
            .subscribe(
              voter=>{
                this.toastService.show(`Voter ${voter.firstName} ${voter.lastName} is added`,"Adding Voters",{duration:2000})
                callback();
              },
              err=>{
                this.toastService.show(`Voter ${voter.firstName} ${voter.lastName} has not been added`,"Adding Voters",{status:"info",duration:1000})
                callback(err);
              })

          console.log('File processed');
          
          
      }, (err) =>{
          // if any of the voter creation produced an error
          this.isSpinner=false;

          if( err ) {
            console.log('One of the voter wasn\'t registered ',err);
            this.toastService.show(`Problem in adding voters`,"Adding Voters",{status:'warning'})
          } else {
            this.toastService.show(`All voter have been added`,"Adding Voters",{status:'success'})
            this.votersSumbitted = true;
            this.stepper.next()
          }
      });
      
      
      
    }
  }
  toggleCreation(){
    this.isHidden = !this.isHidden;
  }
  loadElections(){
    this.isLoading=true;
    this.electionService.getElections()
      .subscribe(elections=>{
        this.elections = elections.map(obj=>obj['Record'])
        this.isLoading=false;
        console.log('elections', this.elections)
      },
      (err)=>{
        this.isLoading=false;
      })
  }
  finishCreation(){
    this.stepper.reset();
    this.isHidden = true;
  }
  modifDate(date,hours){
    let s = hours.split(':')
    let d = new Date(date)
    d.setHours(parseInt(s[0]),parseInt(s[1]))
    return d
  }
  ngOnDestroy(){
    this.themeService.changeTheme("default");
  }
  getMin(d):Date{
    let min = new Date(d)
    min.setDate(min.getDate()-1)
    return min
  }
  getMax(d):Date{
    let max = new Date(d)
    max.setDate(max.getDate()+30)
    return max
  }

}


const votingPhaseValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  console.log('voting validator !')
  console.log(control.errors)
  const candidacyRange = control.get('candidacy_range');
  const candidacy_start_hour = control.get('candidacy_start_hour')
  const candidacy_end_hour = control.get('candidacy_end_hour')

  const votingRange = control.get('voting_range');
  const voting_start_hour = control.get('voting_start_hour')
  const voting_end_hour = control.get('voting_end_hour')

  if((votingRange.invalid && votingRange.touched) || (voting_start_hour.invalid && voting_start_hour.touched) || (voting_end_hour.invalid && voting_end_hour.touched)){
    return {voting_range_error:'One of the voting period is invalid'}
  }else{
    let range= votingRange.value
    if(Date.parse(range.start) == Date.parse(range.end)){
      let start_hour= voting_start_hour.value.split(':')
      let end_hour= voting_end_hour.value.split(':')
      let shv = parseInt(start_hour[0])*60 + parseInt(start_hour[1]) 
      let ehv = parseInt(end_hour[0])*60 + parseInt(end_hour[1])
      if(shv+30 <= ehv ){
        return null;
      }else{
        return {voting_range_error:"voting period also must be atleast 30 min long"}
      }
    }else {
      return null
    }
  }
  
}

const candidacyPhaseValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  console.log('candidacy validator !')
  console.log(control.errors)
  const candidacyRange = control.get('candidacy_range');
  const candidacy_start_hour = control.get('candidacy_start_hour')
  const candidacy_end_hour = control.get('candidacy_end_hour')
  console.log("candidacyRange ",candidacyRange.value)
  if((candidacyRange.invalid && candidacyRange.touched) || (candidacy_start_hour.invalid && candidacy_start_hour.touched) || (candidacy_end_hour.invalid && candidacy_end_hour.touched)){
    return {candidacy_range_error:'One of the candidacy period inputs is invalid'}
  }else{
    let range= candidacyRange.value
    if(Date.parse(range.start) == Date.parse(range.end)){
      console.log("candidacy same day");
      
      let start_hour= candidacy_start_hour.value.split(':')
      let end_hour= candidacy_end_hour.value.split(':')
      let shv = parseInt(start_hour[0])*60 + parseInt(start_hour[1]) 
      let ehv = parseInt(end_hour[0])*60 + parseInt(end_hour[1])
      console.log('s, e',shv,ehv)

      if(shv+30 <= ehv ){
        return null;
      }else{
        return {candidacy_range_error:"candidacy period must be atleast 30 min long"}
      }
    }else {
      return null
    }
  }

};
