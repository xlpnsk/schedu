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
  selector: 'app-passwd',
  templateUrl: './passwd.component.html',
  styleUrls: ['./passwd.component.css']
})
export class PasswdComponent implements OnInit {
  
  newPasswdForm:FormGroup;
  newPasswd=new FormControl('',[Validators.required,Validators.minLength(8)]);
  reNewPasswd=new FormControl('',[Validators.required,checkPasswords(this.newPasswd)]);
  hide=true;

  matcher = new MyErrorStateMatcher();

  constructor(private api:ApiService,private router: Router) {
    this.newPasswdForm = new FormGroup({
      password: this.newPasswd,
      rePassword: this.reNewPasswd
    },{validators: checkPasswords})
   }

  ngOnInit(): void {
  }

  getPasswdErrorMessage(){
    if (this.newPasswd.hasError('required')) {
      return 'You must enter a value';
    }
    else if(this.newPasswd.hasError('minlength'))
      return 'The minimum length of the password is 8 characters';
    
    return '';
  }

  getRePasswdErrorMessage(){
    
    if (this.reNewPasswd.hasError('required')) {
      return 'You must enter a value';
    }  
    else if (this.reNewPasswd.hasError('notSame')){
      return 'Your passwords are not the same'
    }
    return '';
  }

}
