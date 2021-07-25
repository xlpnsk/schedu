import { DataSource } from '@angular/cdk/collections';
import { isDefined } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/api.service';

interface TaskForUser{
  Staff:{ email:string },
  TaskType:{name:string},
  day:number,
  startTime:string,
  stopTime:string,
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  weekStart:Date = new Date();
  weekStop:Date = new Date;
  userEmail:string='';
  taskList:TaskForUser[]|null=[];
  today = new Date();
  constructor(private api:ApiService) {}

  ngOnInit() {
    this.setUserEmail();
  }

  signOut() {
    this.api.signOut();
  }

  setStartStopWeek(){
    let today = new Date();
    let startDay = today.getDate() - today.getDay();
    let stopDay = startDay + 6;
    this.weekStart=new Date(today.getFullYear(),today.getMonth(),startDay);
    this.weekStop=new Date(today.getFullYear(),today.getMonth(),stopDay);
  }

  setUserEmail(){
    this.api.getUser()
    .then((user) => {
      if(typeof user?.email !== 'undefined'){
        this.userEmail=user?.email.toString();
      }
      this.setStartStopWeek();
      this.setTaskList();
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      console.log('Selecting user email completed');
    });
  }

  setTaskList(){
    console.log(this.userEmail);
    this.api.getTasksByEmail(this.userEmail,this.weekStart,this.weekStop)
      .then((tasks) => {
        if(typeof tasks.data !== 'undefined')
          this.taskList=tasks.data;
        console.log(this.taskList)
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

}
