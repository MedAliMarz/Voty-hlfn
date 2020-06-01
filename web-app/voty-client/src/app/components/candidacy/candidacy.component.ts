import { Component, OnInit, ViewChild,TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { CandidateService } from 'src/app/services/candidate.service';
import { AuthService } from 'src/app/services/auth.service';
import { ElectionService } from 'src/app/services/election.service';
import { Election } from 'src/app/models/election.model';

@Component({
  selector: 'app-candidacy',
  templateUrl: './candidacy.component.html',
  styleUrls: ['./candidacy.component.scss']
})
export class CandidacyComponent implements OnInit {

  constructor(private dialogService:NbDialogService,
    public authService:AuthService,
    private electionService:ElectionService,
    private candidateService:CandidateService,
    private toastService:NbToastrService) { }
  candidateForm:FormGroup;
  candidateUpdateForm:FormGroup;
  isCandidate:boolean = true;
  isSpinner:boolean = false;
  submitted:boolean=false;
  election:Election
  timer_data = null;
  hasEnded:boolean=false;
  hasStarted:boolean=false;
  loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  @ViewChild("dialog") dialog:TemplateRef<any>
  ngOnInit(): void {
    this.candidateForm = new FormGroup({
      data : new FormControl('',[Validators.required]),
    })
    if(this.loggedUser.isCandidate){
      this.initUpdateForm(this.loggedUser)
    }

    this.loadCandidacyTime();
  }
  initUpdateForm(voter){
    this.candidateUpdateForm = new FormGroup({
      data : new FormControl(voter.data,[Validators.required]),
      isActive : new FormControl(voter.isActive,[Validators.required]),
    })
  }
  createCandidate(){
    console.log("registring a candidate",this.candidateForm.value)
    let ref = this.dialogService.open(this.dialog,{context:"Are you sure to become a candidate"});
    ref.onClose.subscribe(value=> {
      if(value){
        this.isSpinner = true
        this.initCandidate()
      }else{
        console.log("User refused to become a candidate")
      }
    })
  }
  initCandidate(){
    let newCandidate ={
      electionId:JSON.parse(localStorage.getItem('loggedUser')).electionId,
      voterId:JSON.parse(localStorage.getItem('loggedUser')).voterId,
      data:this.candidateForm.value.data
    }
    this.candidateService.createCandidate(newCandidate)
      .subscribe(
        candidate=>{
          this.toastService.show('Congratulations, you become a candidate','Candidacy',{duration:3000,status:'success'})
          
          this.isSpinner = false;
          this.authService.refresh()
          this.loggedUser.isCandidate = true
          this.initUpdateForm(candidate)
          this.candidateForm.reset()
        },
        err=>{
          console.log(err)
          this.toastService.show(`${err.error.error}`,'Candidacy',{duration:2000,status:'warning'})
          this.isSpinner = false;

      })
  }
  updateCandidate(){
    console.log("modifying a candidate",this.candidateUpdateForm.value)
    let ref = this.dialogService.open(this.dialog,{context:"Are you sure to apply the modification"});
    ref.onClose.subscribe(value=> {
      if(value){
        this.isSpinner = true
        this.putCandidate()
      }else{
        console.log("User refused the modifications")
      }
    })
  }
  putCandidate(){
    // TODO (dali) : integrate it with the toggle in one single request (backend & contract)
    console.log("updating candidacy", this.candidateUpdateForm.value);
    let updated ={
      electionId:JSON.parse(localStorage.getItem('loggedUser')).electionId,
      voterId:JSON.parse(localStorage.getItem('loggedUser')).voterId,
      isActive: this.candidateUpdateForm.value.isActive,
      data: this.candidateUpdateForm.value.data
    }
    this.candidateService.updateCandidacy(updated)
      .subscribe(candidate=> {
        this.toastService.show('The changes have been saved','Modification',{duration:3000,status:'success'})
        this.isSpinner = false
        this.authService.refresh()
        
      },
      err=>{
          
          this.isSpinner = false;
          this.toastService.show(`Verify your input and repeat`,'Modification',{duration:2000,status:'warning'})
          
      })
    
  }
  
  loadCandidacyTime(){
    this.electionService.getElection(this.loggedUser.electionId)
      .subscribe(
        election=>{
          this.election = election
          let start = election.candidacy_startDate;
          let end = election.candidacy_endDate;
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
      this.candidateForm.disable()
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
      this.timer_data = `Candidacy will start in ${days}d ${hours}h ${minutes}m ${seconds}s`
    }else{
      //this.hasStarted=true;
      var x = setInterval(() => {
      var now = new Date().getTime();
      var distance = countDownDate - now;

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        this.timer_data = "Candidacy Phase Has Ended!";
        this.candidateForm.disable()
        if(this.candidateUpdateForm){
          this.candidateUpdateForm.disable()
        }
        clearInterval(x);
        this.hasEnded =true  
      }
      
      this.timer_data =  `Candidacy ends in ${days}d ${hours}h ${minutes}m ${seconds}s`
    
      }, 1000);
    }
  }
}
