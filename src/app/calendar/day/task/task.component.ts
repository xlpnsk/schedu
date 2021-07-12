import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  @Input('task')
  task:Task|null=null;
  taskType:string='';
  constructor(private api:ApiService) { }

  ngOnInit(): void {
    this.setTaskType();
  }

  ngDoChange(){

  }

  setTaskType(){
    if(this.task!=null){
      this.api.getTaskType(this.task.id)
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

}
