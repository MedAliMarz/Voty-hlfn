import { Component, OnInit, Input } from '@angular/core';
import { Election } from 'src/app/models/election.model';

@Component({
  selector: 'app-elections-list',
  templateUrl: './elections-list.component.html',
  styleUrls: ['./elections-list.component.scss']
})
export class ElectionsListComponent implements OnInit {
  @Input() elections:Election[]
  @Input() isSpinner:boolean
  constructor() { }
  ngOnInit(): void {
  
  }

}
