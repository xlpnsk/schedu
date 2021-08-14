import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { start } from 'repl';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { Task } from 'src/app/models/task.model';
import { threadId } from 'worker_threads';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(control?.parent?.invalid && control?.parent?.dirty);

    return invalidCtrl || invalidParent;
  }
}

export function checkType(options: string[]): ValidatorFn {
  return (control: AbstractControl):  ValidationErrors | null => { 
    let type = control.value;
    let ind=options.findIndex((value) => {
      if(value==type)
        return true;
      return false;
    });
    if(ind!=-1)
      return null;
    else
      return {wrongType: true}
  };
}

export function checkInterval(): ValidatorFn {
  return (control: AbstractControl):  ValidationErrors | null => { 
    let time = control.value;
    if(parseInt(time.slice(3))%15==0)
      return null;
    else
      return {wrongInterval: true}
  };
}

export function checkTime(startTimeControl:AbstractControl): ValidatorFn {
  return (control: AbstractControl):  ValidationErrors | null => { 
    let stopTime = control.value;
    let startTime=startTimeControl.value;
    let startInt,stopInt
    startInt=parseInt(startTime.slice(0,2))*60+parseInt(startTime.slice(3));
    stopInt=parseInt(stopTime.slice(0,2))*60+parseInt(stopTime.slice(3));
    return startInt<stopInt ? null : { startTimeBigger: true }
  };
}

export function checkDate(startDateControl:AbstractControl): ValidatorFn {
  return (control: AbstractControl):  ValidationErrors | null => { 
    let stopDate = new Date(control.value);
    let startDate = new Date(startDateControl.value);
    return startDate<=stopDate ? null : { startDateBigger: true }
  };
}

export function checkTimeIfTooEarly(): ValidatorFn {
  return (control: AbstractControl):  ValidationErrors | null => { 
    let startTime=control.value;
    let startInt;
    startInt=parseInt(startTime.slice(0,2));
    return startInt>=8 ? null : { tooEarly: true }
  };
}

export function checkTimeIfTooLate(): ValidatorFn {
  return (control: AbstractControl):  ValidationErrors | null => { 
    let stopTime=control.value;
    let stopInt;
    stopInt=parseInt(stopTime.slice(0,2));
    return stopInt<22 ? null : { tooLate: true }
  };
}


interface Day {
  value: string;
  viewValue: string;
}

interface TaskType{
  id: number,
  name: string
}
@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {

  edit:string|null=null;
  editTask:Task|null=null;

  taskList:Task[]=[];

  taskTypes:TaskType[]=[];
  options: string[] =[];
  filteredOptions: Observable<string[]>=new Observable();

  newTaskFG:FormGroup;
  taskTypeFC = new FormControl('',[Validators.required,checkType(this.options)]);
  startTimeFC = new FormControl('',[Validators.required,checkInterval(),checkTimeIfTooEarly()]);
  stopTimeFC = new FormControl('',[Validators.required,checkInterval(),checkTime(this.startTimeFC),checkTimeIfTooLate()]);
  startDateFC = new FormControl('',[Validators.required]);
  stopDateFC = new FormControl('',[Validators.required,checkDate(this.startDateFC)])
  dayFC = new FormControl('',[Validators.required]);
  staffIdFC = new FormControl('');
  descriptionFC = new FormControl('');

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  days: Day[] = [
    {value: '1', viewValue: 'Monday'},
    {value: '2', viewValue: 'Tuesday'},
    {value: '3', viewValue: 'Wednesday'},
    {value: '4', viewValue: 'Thursday'},
    {value: '5', viewValue: 'Friday'}
  ];

  constructor(private api:ApiService,private router: Router, private _snackBar: MatSnackBar,private route: ActivatedRoute) {
    this.newTaskFG=new FormGroup({
      typeId: this.taskTypeFC,
      startTime: this.startTimeFC,
      stopTime: this.stopTimeFC,
      startDate: this.startDateFC,
      stopDate: this.stopDateFC,
      day: this.dayFC,
      description: this.descriptionFC,
      staffId: this.staffIdFC
    });
  }

  ngOnInit(): void {
    this.setOptions();
    this.edit=this.route.snapshot.paramMap.get('edit');
    this.setEditData();
    this.getStaffId()
    this.setTaskList();

  }

  setTaskList(){
    this.api.getTasksByUuid()
      .then(({data, error}) => {
        if(error==null){
          if(typeof data != 'undefined')
            this.taskList=data;
          console.log(this.taskList);
        }
        else{
          this.openSnackBar('Error while connecting to API',true)
        }
      })
    
  }

  setOptions(){
    this.api.getAllTaskTypes()
    .then((tasktypes) => {
      if(tasktypes.data!=null){
        tasktypes.data.forEach((type) => {
          this.taskTypes.push({id:type.id,name:type.name});
        });
        console.log(this.taskTypes);
        tasktypes.data.forEach( (type) => {
          this.options.push(type.name);
        });
      }
      this.filteredOptions = this.taskTypeFC.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      console.log('Selecting from TaskTypes compleated');
    });
  }

  setEditData(){
    if(this.edit!=null){
      this.api.getTaskById(parseInt(this.edit))
      .then((task) => {
        this.editTask=task.data?.pop();
        this.taskTypeFC.setValue(this.taskTypes.find((type) => {
          if(type.id==this.editTask?.typeId)
            return true;
          return false;
        })?.name);
        if(typeof this.editTask?.startDate != 'undefined')
          this.startDateFC.setValue(new Date(this.editTask?.startDate));
        if(typeof this.editTask?.stopDate != 'undefined')
          this.stopDateFC.setValue(new Date(this.editTask.stopDate));
        this.startTimeFC.setValue(this.editTask?.startTime);
        this.stopTimeFC.setValue(this.editTask?.stopTime);
        this.dayFC.setValue(this.editTask?.day.toString());
        this.descriptionFC.setValue(this.editTask?.description);
      })
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  getStaffId(){
    var uuid,staffId;
    this.api.getUser()
    .then((user) => {
      uuid=user?.id; 
      this.api.getStaffId(uuid)
      .then((staff) => {
        staffId=staff.data?.pop().id;
        this.staffIdFC.setValue(staffId);
      })
      .catch((err) => {
        console.error(err);
      });
    })
    .catch((err) => {
      console.error(err);
    })
  }

  clearControls(){
    this.taskTypeFC.setValue('')
    this.startTimeFC.setValue('')
    this.stopTimeFC.setValue('')
    this.startDateFC.setValue('')
    this.stopDateFC.setValue('')
    this.dayFC.setValue('')
    this.descriptionFC.setValue('')
  }

  saveTask(){
    this.dayFC.setValue(parseInt(this.dayFC.value));
    if(this.validateTask()){
      this.openSnackBar('During this period, the task for the given day and time already exists. Make sure there are no collisions!',true);
    }
    else{
      let type=this.taskTypes.find((val) => {
        if(val.name==this.taskTypeFC.value)
          return true;
        return false;
      })
      this.taskTypeFC.setValue(type?.id);
      if(this.edit==null){
        this.api.insertTask(this.newTaskFG.value)
        .then(({data,error}) =>{
          if(error==null){
            this.openSnackBar('Task added!',false);
            this.router.navigateByUrl('/account/tasks')
          }
          else{
            this.openSnackBar('Error while saving the task',true);
          }
        });
      }
      else{
        if(typeof this.editTask?.id != 'undefined')
          this.api.updateTask(this.newTaskFG.value,this.editTask?.id)
          .then(({data,error}) => {
            if(error==null){
              this.openSnackBar('Task updated!',false);
              this.router.navigateByUrl('/account/tasks')
            }
            else{
              this.openSnackBar('Error while updating the task',true);
            }
          })
      }
      //this.clearControls();
    }
  }

  getTypeErrorMessage(){
    if (this.taskTypeFC.hasError('required')) {
      return 'You must enter a value';
    }
    else if(this.taskTypeFC.hasError('wrongType')){
      return 'You must enter valid type'
    }
    return '';
  }

  getStartTimeErrorMessage(){
    if (this.startTimeFC.hasError('required')) {
      return 'You must enter a value';
    }
    else if(this.startTimeFC.hasError('wrongInterval')){
      return 'Only hours in 15-minute intervals are allowed'
    }
    else if(this.startTimeFC.hasError('tooEarly')){
      return 'The task may not start until 8:00 am at the earliest'
    }
    return '';
  }

  getStopTimeErrorMessage(){
    if (this.stopTimeFC.hasError('required')) {
      return 'You must enter a value';
    }
    else if(this.stopTimeFC.hasError('wrongInterval')){
      return 'Only hours in 15-minute intervals are allowed'
    }
    else if(this.stopTimeFC.hasError('startTimeBigger')){
      return 'The start time must be less than the end time'
    }
    else if(this.stopTimeFC.hasError('tooLate')){
      return 'The task must be completed before 10:00 pm'
    }
    return '';
  }

  getStartDateErrorMessage(){
    if (this.startDateFC.hasError('required')) {
      return 'You must enter a value';
    }
    return '';
  }

  getStopDateErrorMessage(){
    if (this.stopDateFC.hasError('required')) {
      return 'You must enter a value';
    }
    else if(this.stopDateFC.hasError('startDateBigger')){
      return 'The end date must be greater than the start date'
    }
    return '';
  }

  getDayErrorMessage(){
    if (this.dayFC.hasError('required')) {
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

  validateTask(){
    let filteredTasks=this.taskList.filter((task) => {
      if(task.id==this.editTask?.id)
        return false;
      if(new Date(task.startDate)<=this.stopDateFC.value && new Date(task.stopDate)>=this.startDateFC.value){
        //possible collision
        if(task.day==this.dayFC.value){
          //possible collision
          let start=parseInt(task.startTime.slice(0,2))*60+parseInt(task.startTime.slice(3,5));
          let stop=parseInt(task.stopTime.slice(0,2))*60+parseInt(task.stopTime.slice(3,5));
          let newStart=parseInt(this.startTimeFC.value.slice(0,2))*60+parseInt(this.startTimeFC.value.slice(3,5));
          let newStop=parseInt(this.stopTimeFC.value.slice(0,2))*60+parseInt(this.stopTimeFC.value.slice(3,5));
          if(start<=newStop && stop>= newStart){
            //collision!
              return true;
          }
        }
      }
      return false;
    });
    if(filteredTasks.length!=0){
      return true;
    }
    return false;

  }

}
