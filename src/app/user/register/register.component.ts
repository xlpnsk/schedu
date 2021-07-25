import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm:FormGroup;
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('' ,[Validators.required,Validators.minLength(8)])
  repassword = new FormControl('',[Validators.required])

  
  constructor(private api:ApiService,private router: Router) {
    this.registerForm = new FormGroup({
      email: this.email,
      password: this.password,
      repassword: this.repassword
    });
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

  getRePasswdErrorMessage(){
    
    if (this.password.hasError('required')) {
      return 'You must enter a value';
    }  
    else if (this.password != this.repassword){
      return 'Your passwords are not the same'
    }
    return '';
  }

  async signUp() {    
    this.api.signUp(this.registerForm.value).then(async data => {      
        console.log(data);      
        this.router.navigateByUrl('/login', { replaceUrl: true });        
      }, async err => {           
        console.error('Registration failed')
    });
  }

}
