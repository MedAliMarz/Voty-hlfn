import { Component, OnInit, ViewChild,TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { CandidateService } from 'src/app/services/candidate.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-candidacy',
  templateUrl: './candidacy.component.html',
  styleUrls: ['./candidacy.component.scss']
})
export class CandidacyComponent implements OnInit {

  constructor(private dialogService:NbDialogService,
    public authService:AuthService,
    private candidateService:CandidateService,
    private toastService:NbToastrService) { }
  candidateForm:FormGroup;
  active:boolean = true;
  isCandidate:boolean = true;
  isSpinner:boolean = false;
  submitted:boolean=false;
  @ViewChild("dialog") dialog:TemplateRef<any>
  ngOnInit(): void {
    this.candidateForm = new FormGroup({
      data : new FormControl('',[Validators.required]),
    })
    this.active = this.authService.loggedUser.isActive;
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
      electionId:this.authService.loggedUser.electionId,
      voterId:this.authService.loggedUser.voterId,
    }
    this.candidateService.createCandidate(newCandidate)
      .subscribe(
        candidate=>{
          this.toastService.show('Congratulations, you become a candidate','Candidacy',{duration:3000,status:'success'})
          
          this.isSpinner = false;
          this.authService.refresh()
          this.candidateForm.reset()
        },
        err=>{
          console.log(err)
          this.toastService.show(`${err.error.error}`,'Candidacy',{duration:2000,status:'warning'})
          this.isSpinner = false;

      })
  }
  modifyCandidate(){
    console.log("toggling candidacy",this.active);
    if(this.active == this.authService.loggedUser.isActive){
      this.toastService.show("Modification ","You didn't change anything",{status:"info"})
    }else{
      let ref = this.dialogService.open(this.dialog,{context:"Do you accept the modification ?"});
      ref.onClose.subscribe(value=> {
        if(value){
          this.isSpinner = true
          this.toggleCandidacy()
        }else{
          console.log("User refused to modify his status")
        }
      })
    }
    
  }
  toggleCandidacy(){
    let data ={
      electionId:this.authService.loggedUser.electionId,
      voterId:this.authService.loggedUser.voterId,
    }
    this.candidateService.toggleCandidacy(data)
      .subscribe(candidate=> {
        this.toastService.show('the changes have been saved','Modification',{duration:3000,status:'success'})
          
        this.isSpinner = false;
        this.active = !this.authService.loggedUser.isActive;
        this.authService.refresh()
        
      },
      err=>{
        console.log(err)
          this.toastService.show(`${err.error.error}`,'Modification',{duration:2000,status:'warning'})
          this.isSpinner = false;
      })
  }
}
