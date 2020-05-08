import { Component, OnInit, Input } from '@angular/core';
import { Voter } from '../../models/voter.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateService } from 'src/app/services/candidate.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss']
})
export class CandidateComponent implements OnInit {
  @Input() candidate:Voter
  isSpinner:boolean = false;
  candidateId:string;
  constructor(private activatedRoute:ActivatedRoute,
    private candidateService:CandidateService,
    private toastService:NbToastrService,
    private router:Router) { }

  ngOnInit(): void {
    this.candidateId = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('candidateId', this.candidateId)
    this.isSpinner = true;
    this.loadCandidate()
  }
  loadCandidate(){
    this.candidateService.getCandidate(this.candidateId)
      .subscribe(
        candidate=>{
        this.candidate = candidate;
        this.toastService.show('cnadidate loaded successfully','Candidate',{status:'success'})
        this.isSpinner = false;
        },
        err=>{
          
        this.isSpinner = false;
        this.router.navigateByUrl('/voter')
        this.toastService.show('Problem occured in loading the specified candidate','Candidate',{status:'warning'})
      })
  }

}
