import { Component, OnInit, Input } from '@angular/core';
import { Voter } from '../../models/voter.model';

@Component({
  selector: 'app-candidate',
  templateUrl: './candidate.component.html',
  styleUrls: ['./candidate.component.scss']
})
export class CandidateComponent implements OnInit {
  @Input() candidate:Voter
  constructor() { }

  ngOnInit(): void {
  }

}
