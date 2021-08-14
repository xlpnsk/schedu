import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/api.service';
import { Task } from 'src/app/models/task.model';

interface TaskForUser{
  id:number,
  TaskType:{name:string},
  description:string
  startDate:string
  stopDate:string
  startTime:string
  stopTime:string
  day:number
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  taskList:TaskForUser[]=[];
  
  constructor(private api:ApiService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.getTasks();
  }

  getTasks(){
    this.api.getTasksByUuid()
    .then((tasks) => {
      if(tasks.data!=null)
        this.taskList=tasks.data
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      console.log('Selecting from Tasks completed');
    });
  }

  getDay(dayNum:number){
    let days=['Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return days[dayNum-1];
  }

  deleteTask(id:number){
    this.api.deleteTask(id)
    .then((data) => {
      console.log(data);
      this.getTasks();
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      console.log('Deleting Task completed');
    });
  }

}
