import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);

    return invalidCtrl || invalidParent;
  }
}

export function checkPasswords(passControl:AbstractControl): ValidatorFn {
  return (control: AbstractControl):  ValidationErrors | null => { 
    let confirmPass = control.value;
    let pass=passControl.value;
    return pass === confirmPass ? null : { notSame: true }
  };
}

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
  repassword = new FormControl('',[Validators.required,checkPasswords(this.password)])

  
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
    
    if (this.repassword.hasError('required')) {
      return 'You must enter a value';
    }  
    else if (this.repassword.hasError('notSame')){
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
