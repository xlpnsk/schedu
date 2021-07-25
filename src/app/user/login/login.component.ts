import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm:FormGroup;
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('' ,[Validators.required,Validators.minLength(8)])

  constructor(private api:ApiService,private router: Router) {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    })
   }

  ngOnInit(): void {
  }

  getEmailErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getPasswdErrorMessage(){
    if (this.password.hasError('required')) {
      return 'You must enter a value';
    }
    else if(this.password.hasError('minlength'))
      return 'The minimum length of the password is 8 characters';
    
    return '';
  }

  login(){
    console.log(this.loginForm.value);
    this.api.signIn(this.loginForm.value).then(async data => {
      console.log(data);      
      this.router.navigateByUrl('/account', { replaceUrl: true });
    }, async err => {           
      console.error(err)
    });
  }
}
