import { Component, OnInit,TemplateRef ,ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { AdminService } from 'src/app/services/admin.service';
import { Admin } from 'src/app/models/admin.model';

@Component({
  selector: 'app-superadmin-board',
  templateUrl: './superadmin-board.component.html',
  styleUrls: ['./superadmin-board.component.scss']
})
export class SuperadminBoardComponent implements OnInit {
  @ViewChild("dialog") dialog:TemplateRef<any>;
  isCreating:boolean
  isLoading:boolean;
  constructor(private dialogService:NbDialogService,
    private toastService:NbToastrService,
    private adminService:AdminService) { }
  adminForm:FormGroup
  admins:Admin[]
  ngOnInit(): void {
    this.adminForm = new FormGroup({
      firstName : new FormControl('',[Validators.required]),
      lastName : new FormControl('',[Validators.required]),
      email : new FormControl('',[Validators.required,Validators.email]),
    })
    this.loadAdmins()
    
  }

  createAdmin(){
    console.log(this.adminForm.value)
    let ref = this.dialogService.open(this.dialog,{context:"Are you sure to create this election admin"});
    ref.onClose.subscribe(value=> {
      if(value){
        this.isCreating=true;
        this.initAdmin()
        
      }else{
        console.log("User refused admin creation")
      }
    })
  }
  initAdmin(){
    if(!this.adminForm.invalid){
      let newadmin = this.adminForm.value
      this.adminService.createAdmin(newadmin)
        .subscribe(admin=>{
          this.adminForm.reset()
          this.toastService.show('A new election admin is successfully created','Admin',{status:'success'})
          
          this.loadAdmins()
          this.isCreating =false;
        },err => {
          this.isCreating =false;
          this.toastService.show('An error occured while creating an admin','Error',{status:'warning'})
        })
    }
  }
  loadAdmins(){
    this.isLoading=true
    // the next object was added to test the ui of app-admins-list component
    /*
    this.admins=[
      {
        firstName: "dali",
        lastName: "marz",
        email: "dalimarz@gmail.com",
        elections: ["election1", "election1", "election1", "election1", "election1"],
        type: "admin"
      },
      {
        firstName: "touhami",
        lastName: "hama",
        email: "dalimarz@gmail.com",
        elections: ["election1", "election1", "election1", "election1", "election1"],
        type: "admin"
      },
    ]
    setTimeout(()=>{this.isLoading=false},1500)
    */
    this.adminService.getAdmins()
      .subscribe(admins=>{
        this.admins = admins;
        console.log("loaded admins ",admins)
        this.isLoading=false
        },err => {
        this.toastService.show('Error in loading admins','Error',{status:'warning'})
        this.isLoading=false

        console.log("error in loading admins")
      })
    
  }
}
