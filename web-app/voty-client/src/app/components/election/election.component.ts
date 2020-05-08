import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NbToastrService, NbThemeService, NbDialogService } from '@nebular/theme';
import { ElectionService } from 'src/app/services/election.service';
import { Election } from 'src/app/models/election.model';
import {NbCalendarRange} from '@nebular/theme'
import { Voter } from 'src/app/models/voter.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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

  electionForm:FormGroup;
  constructor(private router:Router,
    private toastService:NbToastrService,
    private electionService:ElectionService,
    private activatedRoute:ActivatedRoute,
    private dialogService:NbDialogService,
    private themeService:NbThemeService) { }

  ngOnInit(): void {
    this.isModify = false;
    this.electionId = this.activatedRoute.snapshot.paramMap.get('id');
    this.themeService.changeTheme('dark')
    console.log('electionId', this.electionId)
    this.isSpinner = true;
    this.electionForm = new FormGroup({
      name : new FormControl({value:'',disabled:!this.isModify},[Validators.required]),
      country : new FormControl({value:'',disabled:!this.isModify},[Validators.required]),
      year : new FormControl({value:'',disabled:!this.isModify},[Validators.required]),
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
          'country':this.election.country,
          'year':this.election.year,
        })
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
            'country':this.election.country,
            'year':this.election.year,
          })
        }
      )
  }
  handleRangeChange(data){
    console.log(data)
  }
}