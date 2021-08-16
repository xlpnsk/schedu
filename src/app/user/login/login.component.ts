import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
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

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  
  constructor(private api:ApiService,private router: Router, private _snackBar: MatSnackBar) {
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    })
   }

  ngOnInit(): void {
    this.openSnackBar('You have to sign in',false)
  }

  openSnackBar(message:string,isError:boolean){
    let config = new MatSnackBarConfig();
    config.duration = 4000;
    config.horizontalPosition = this.horizontalPosition
    config.verticalPosition = this.verticalPosition
    if(isError){
      config.panelClass = ['error-snackbar']
    }
    this._snackBar.open(message,'Hide',config)
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
    this.api.signIn(this.loginForm.value).then(async data => {      
      this.router.navigateByUrl('/account', { replaceUrl: true });
    }, async err => {           
      console.error(err)
      this.openSnackBar(err.message,true)
    });
  }
}
