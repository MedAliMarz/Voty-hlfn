import { Component, OnInit, Input } from '@angular/core';
import { Voter } from '../../models/voter.model';

@Component({
  selector: 'app-candidates-list',
  templateUrl: './candidates-list.component.html',
  styleUrls: ['./candidates-list.component.scss']
})
export class CandidatesListComponent implements OnInit {
  @Input() candidates : Voter[]
  constructor() { }

  ngOnInit(): void {
  }

}
