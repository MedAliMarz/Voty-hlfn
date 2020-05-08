import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-elections-list',
  templateUrl: './elections-list.component.html',
  styleUrls: ['./elections-list.component.scss']
})
export class ElectionsListComponent implements OnInit {
  elections = [1,1,1,1,1,1,1,1,,1,1,1,1,1]

  constructor() { }
  ngOnInit(): void {
  }

}
