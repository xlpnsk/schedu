import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task.model';
@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {

  @Input('tasks')
  taskList:Task[]=[];

  intervals:number[]=[];
  constructor() { }

  ngOnInit(): void {
    for(let i=0;i<56;i++)
      this.intervals[i]=i;
  }

}
