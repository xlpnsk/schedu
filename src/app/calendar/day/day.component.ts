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
  intervalVisible:boolean[]=[];
  intervals:number[]=[];
  constructor() { }

  ngOnInit(): void {
    for(let i=0;i<56;i++){
      this.intervals[i]=i;
    }
  }

  ngDoCheck(){
    for(let i=0;i<56;i++){
      this.intervalVisible[i]=true;
    }
  }

  taskChecker(interval:number){
    let hh=8+Math.floor((interval*15)/60);
    let mm=(interval%4)*15;
    for(let task of this.taskList){
      let time=new Date(task.startDate + ' ' + task.startTime);
      if(time.getHours()==hh && time.getMinutes()==mm){
        this.setTasksIntervalsArray(interval);
        return true; //it is starting point for the task
      }
    }
    return false;
  }

  findTaskForInterval(interval:number){
    let hh=8+Math.floor((interval*15)/60);
    let mm=(interval%4)*15;
    for(let task of this.taskList){
      let time=new Date(task.startDate + ' ' + task.startTime);
      if(time.getHours()==hh && time.getMinutes()==mm)
        return task;
    }
    console.error('Task not found!');
    return null;
  }

  getTaskLength(interval:number){
    //returns task length in intervals (15min)
    let task:Task|null = this.findTaskForInterval(interval);
    if(task==null){
      console.error('getTaskLength() error');
      return 0;
    }
    let start=new Date(task.startDate + ' ' + task.startTime);
    let stop=new Date(task.startDate + ' ' + task.stopTime);
    let intNum=((stop.getHours()*60+stop.getMinutes())-(start.getHours()*60+start.getMinutes()))/15;
    return intNum;
  }

  getSpan(interval:number){
    //returns string: "int / span int"
    let intNum=this.getTaskLength(interval);
    if(intNum==0){
      return (interval+1).toString() + ' / span 1';
    }
    return (interval+1).toString() + ' / span ' + intNum.toString();
  }

  setTasksIntervalsArray(interval:number){
    let length=this.getTaskLength(interval);
    for(let i=interval+1;i<interval+length;i++){
      this.intervalVisible[i]=false;
    }
  }
}
