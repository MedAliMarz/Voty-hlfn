import { Component, OnInit, Input } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { Admin } from 'src/app/models/admin.model';
import async from 'async';
import { ElectionService } from 'src/app/services/election.service';
@Component({
  selector: 'app-admins-list',
  templateUrl: './admins-list.component.html',
  styleUrls: ['./admins-list.component.scss']
})
export class AdminsListComponent implements OnInit {
  @Input() admins:Admin[]
  @Input() isLoading:boolean

  constructor(private electionService:ElectionService) { }
  adminsMenu:NbMenuItem[];
  ngOnInit(): void {
    
  }
  ngOnChanges():void{
    this.transformAdmins()

  }
  transformAdmins(){
    if(this.admins && this.admins.length!=0){
      this.isLoading = true;      

      async.mapSeries(this.admins,
        (admin,cbg)=>{
          async.mapSeries(admin.elections,(electionId,cb)=>{
            this.electionService.getElection(electionId)
              .subscribe(election=>{
                cb(null,{title:election.name})
              },error=>{
                cb(`election : ${electionId} is not loaded`)
              })
          },(err,children)=>{
            cbg(null,<NbMenuItem>{
              title:`${admin.firstName} ${admin.lastName}`,
              children : children
              })
          }) 
        },
        (error,menu)=>{
          this.isLoading = false;
          this.adminsMenu = menu;
        })

      
    }
  }
}
