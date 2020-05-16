import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Voter } from 'src/app/models/voter.model';
import { ElectionService } from 'src/app/services/election.service';

@Component({
  selector: 'app-voter-board',
  templateUrl: './voter-board.component.html',
  styleUrls: ['./voter-board.component.scss']
})
export class VoterBoardComponent implements OnInit {

  constructor(private router:Router,private authService:AuthService,private electionService:ElectionService) { }
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
    
    this.electionService.getElectionCandidates(JSON.parse(localStorage.getItem('loggedUser')).electionId)
      .subscribe(
        candidates=>{
          console.log(candidates)
          console.log('loggedUser.electionId ', JSON.parse(localStorage.getItem('loggedUser')).electionId);
          this.candidates = candidates;
          console.log(this.candidates)
          this.isSpinner = false

      },
      err=>{
        console.log("Problem in loading candidates")
        this.isSpinner = false

      })
  }
}
