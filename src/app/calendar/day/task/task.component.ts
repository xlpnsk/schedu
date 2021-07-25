import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from 'src/app/api.service';
import { Staff } from 'src/app/models/staff.model';
import { Task } from 'src/app/models/task.model';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input('task')
  task:Task|null=null;

  @Input('staff')
  staff:Staff|null=null;

  taskType:string='';

  colorPalete = [
    "#6649b8", //"Plump Purple"
    "#b80c09", //"International Orange Engineering"
    "#f2dc5d", //"Minion Yellow"
    "#1b9d8e", //"Persian Green"
    "#48acf0", //"Blue Jeans"
  ]

  color:string="#6649b8";

  constructor(private api:ApiService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.setTaskType();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '60vh',
      data: {
        description: this.task?.description,
        startDate: this.task?.startDate,
        stopDate: this.task?.stopDate,
        staff: {
          title: this.staff?.title,
          firstName: this.staff?.firstName,
          lastName: this.staff?.lastName
        },
        type: this.taskType,
        startTime: this.task?.startTime.slice(0,-3),
        stopTime: this.task?.stopTime.slice(0,-3),
        day: this.task?.day
      }
    });
  }

  setTaskType(){
    if(this.task!=null){
      this.setTaskColor();
      this.api.getTaskType(this.task.typeId)
      .then((data) => {
        if(data.data!=null){
          this.taskType=data.data[0].name;
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        console.log('Selecting from TaskType completed');
      });
    }
    this.taskType=''
    console.warn("Waiting for the assignment of task type...")
  }

  setTaskColor(){
    if(this.task?.typeId!==undefined)
      this.color=this.colorPalete[this.task?.typeId-1];
  }

}
