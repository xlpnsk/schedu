import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { ApiService } from 'src/app/api.service';
import { AdminStaff } from 'src/app/models/staff.model';
import { AdminTask } from 'src/app/models/task.model';

@Component({
  selector: 'app-admin-content',
  templateUrl: './admin-content.component.html',
  styleUrls: ['./admin-content.component.css']
})
export class AdminContentComponent implements OnInit {

  @Input('type') type:string=''
  @Output() sendData = new EventEmitter<number>();

  taskList:AdminTask[]=[];
  staffList:AdminStaff[]=[];
  userList:User[]=[];

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private api:ApiService,private _snackBar: MatSnackBar,private router: Router) { }

  ngOnInit(): void {
    switch(this.type){
      case 'tasks': {
        this.getTasks();
        break;
      }
      case 'staff': {
        this.getStaff();
        break;
      }
      case 'users': {
        break;
      }
      default: {
        console.error('Error occurred while initializing admin-content component')
      }
    }
  }

  getTasks(){
    this.api.getAdminTasks()
    .then((tasks) => {
      if(tasks.data!=null)
        this.taskList=tasks.data;
      this.emitData(this.taskList.length)
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      console.log('Admin: Selecting from Tasks completed');
    });
  }

  getStaff(){
    this.api.getAdminStaff()
    .then((staff) => {
      if(staff.data!=null)
        this.staffList=staff.data;
      this.emitData(this.staffList.length)
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      console.log('Admin: Selecting from Staff completed');
    });
  }

  deleteTask(id:number){
    this.api.deleteTask(id)
    .then((data) => {
      this.openSnackBar('The task has been deleted!',false);
      this.getTasks();
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      console.log('Admin: Task deleted');
    });
  }

  deleteStaff(id:number){
    this.api.deleteStaff(id)
    .then((data) => {
      this.openSnackBar('The staff member has been deleted!',false);
      this.getStaff();
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      console.log('Admin: Staff member deleted');
    });
  }

  editStaff(id:number){
    let url=location.href+'/staff'+';edit='+id.toString();
    location.replace(url);
  }

  getDay(dayNum:number){
    let days=['Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return days[dayNum-1];
  }

  emitData(value:number) {
    this.sendData.emit(value);
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

  newStaffNavig(){
    let url=location.href+'/staff';
    location.replace(url);
  }

}
