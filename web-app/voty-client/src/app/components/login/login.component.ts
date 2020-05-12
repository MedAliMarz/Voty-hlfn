import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService,
    private router: Router,
    private toastrService: NbToastrService) { }
  loginForm: FormGroup
  user = {
    email: '',
    password: '',

  }
  submitted = false;
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required])
    })
  }
  login() {

    console.log("Logging ", this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe((res) => {

      //this.router.navigateByUrl('/voter');
      this.toastrService.show("You logged in successfully", "Login", {
        status: 'success'

      });
    }, (err) => {
      console.log("ERROR => " , err)
      this.toastrService.show("User not found, verify the credentials", "Incorrect credentials", {
        status: 'danger'
      })
    })
  }
}
