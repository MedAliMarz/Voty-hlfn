import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Voter } from 'src/app/models/voter.model';
import { CandidateService } from 'src/app/services/candidate.service';

@Component({
  selector: 'app-voter-board',
  templateUrl: './voter-board.component.html',
  styleUrls: ['./voter-board.component.scss']
})
export class VoterBoardComponent implements OnInit {

  constructor(private router:Router,private authService:AuthService,private candidateService:CandidateService) { }
  candidates:Voter[]
  isSpinner:boolean = false;
  ngOnInit(): void {
    this.isSpinner = true
    this.loadCandidates()
  }
  becameCandidate(){
    this.router.navigateByUrl('/candidacy')
  }

  loadCandidates(){
    
    this.candidateService.getCandidates()
      .subscribe(
        candidates=>{
          console.log(candidates)
          console.log('loggedUser.electionId ', JSON.parse(localStorage.getItem('loggedUser')).electionId);
          this.candidates = candidates.filter(candidate=>{
            return (candidate.electionId == JSON.parse(localStorage.getItem('loggedUser')).electionId)
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
