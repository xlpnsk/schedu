import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
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

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private api:ApiService,private router: Router, private _snackBar: MatSnackBar) {
    this.newPasswdForm = new FormGroup({
      password: this.newPasswd,
      rePassword: this.reNewPasswd
    },{validators: checkPasswords})
   }

  ngOnInit(): void {
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

  changePassword(){
    this.api.changePasswd(this.newPasswdForm.get('password')?.value).then(async data => {           
      this.router.navigateByUrl('/account', { replaceUrl: true });        
    }, async err => {           
      console.error('Password update failed')
      this.openSnackBar('Password update failed',true)
  });
  }

}
