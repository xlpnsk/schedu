import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { Staff } from 'src/app/models/staff.model';

interface Title {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-new-staff',
  templateUrl: './new-staff.component.html',
  styleUrls: ['./new-staff.component.css']
})
export class NewStaffComponent implements OnInit {

  edit:string|null=null;
  editStaff:Staff|null=null;

  titles: Title[] = [
    {value: 'null', viewValue: '(None)'},
    {value: 'inż.', viewValue: 'Inżynier'},
    {value: 'mgr', viewValue: 'Magister'},
    {value: 'mgr inż.', viewValue: 'Magister inżynier'},
    {value: 'dr', viewValue: 'Doktor'},
    {value: 'dr inż', viewValue: 'Doktor inżynier'},
    {value: 'dr hab.', viewValue: 'Doktor habilitowany'},
    {value: 'dr hab. inż.', viewValue: 'Doktor habilitowany inżynier'},
  ];

  newStaffFG:FormGroup;
  titleFC = new FormControl('',[Validators.required]);
  firstNameFC = new FormControl('',[Validators.required]);
  lastNameFC = new FormControl('',[Validators.required]);
  emailFC = new FormControl('',[Validators.required,Validators.email]);

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  

  constructor(private api:ApiService,private router: Router, private _snackBar: MatSnackBar,private route: ActivatedRoute) {
    this.newStaffFG = new FormGroup({
      title: this.titleFC,
      firstName: this.firstNameFC,
      lastName: this.lastNameFC,
      email: this.emailFC
    });
   }

  ngOnInit(): void {
    this.edit=this.route.snapshot.paramMap.get('edit');
    this.setEditData();
  }

  setEditData(){
    if(this.edit!=null){
      this.api.getStaffById(parseInt(this.edit))
        .then(({data,error}) => {
          if(error==null){
            this.editStaff=data?.pop();
            this.firstNameFC.setValue(this.editStaff?.firstName);
            this.lastNameFC.setValue(this.editStaff?.lastName);
            this.emailFC.setValue(this.editStaff?.email);
            this.titleFC.setValue(this.titles.find((title) => {
              if(title.value==this.editStaff?.title)
                return true;
              return false;
            })?.value);
          }
          else{
            this.openSnackBar(error.message,true);
          }
        });
    }
  }

  saveStaff(){
    if(this.titleFC.value=='null')
      this.titleFC.setValue('');
    if(this.edit==null){
      this.api.insertStaff(this.newStaffFG.value)
      .then(({data,error}) => {
        if(error==null){
          this.clearForm();
          this.openSnackBar('The staff member has been added',false);
        }
        else{
          this.openSnackBar(error.details,true);
        }
      });
    }
    else{
      if(typeof this.editStaff?.id != 'undefined')
        this.api.updateStaff(this.newStaffFG.value,this.editStaff?.id)
          .then(({ data, error }) => {
            if(error==null){
              this.clearForm();
              this.openSnackBar('The staff member has been updated',false);
            }
            else{
              this.openSnackBar(error.details,true);
            }
          })
    }

  }

  clearForm(){

    this.titleFC.reset('');
    this.firstNameFC.reset('');
    this.lastNameFC.reset('');
    this.emailFC.reset('');

    this.titleFC.setErrors(null);
    this.firstNameFC.setErrors(null);
    this.lastNameFC.setErrors(null);
    this.emailFC.setErrors(null);
    
  }

  back(){
    let url=location.href.replace(location.pathname,'/admin')
    location.replace(url);
  }

  getEmailErrorMessage(){
    if (this.emailFC.hasError('required')) {
      return 'You must enter a value';
    }
    return this.emailFC.hasError('email') ? 'Not a valid email' : '';
  }

  getLastNameErrorMessage(){
    if (this.lastNameFC.hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }

  getFirstNameErrorMessage(){
    if (this.firstNameFC.hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }

  getTitleErrorMessage(){
    if (this.titleFC.hasError('required')) {
      return 'You must enter a value';
    }
    return '';
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

}
