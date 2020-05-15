import { Component, OnInit, Input } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { Admin } from 'src/app/models/admin.model';
@Component({
  selector: 'app-admins-list',
  templateUrl: './admins-list.component.html',
  styleUrls: ['./admins-list.component.scss']
})
export class AdminsListComponent implements OnInit {
  @Input() admins:Admin[]
  @Input() isLoading:boolean

  constructor() { }
  adminsMenu:NbMenuItem[];
  ngOnInit(): void {
    
  }
  ngOnChanges():void{
    this.adminsMenu = this.transformAdmins()

  }
  transformAdmins():NbMenuItem[]{
    if(this.admins && this.admins.length!=0){

    let menu = this.admins.map(admin => {
      let children = admin.elections.map<NbMenuItem>(election=>{
        return {title:election}
      })

      return {
        title:`${admin.firstName} ${admin.lastName}`,
        children : children
      }
    })
    return menu
    }else{
      return []
    }
  }
}
