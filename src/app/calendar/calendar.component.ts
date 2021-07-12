import { Component, OnInit } from '@angular/core';
import { MAT_DATE_RANGE_SELECTION_STRATEGY } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { Staff } from '../models/staff.model';
import { Task } from '../models/task.model';
import { WeekRangeSelectionStrategy } from './WeekRangeSelectionStrategy';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [{
    provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
    useClass: WeekRangeSelectionStrategy
  }]
})
export class CalendarComponent implements OnInit {

  intervals:number[]=[];
  days:number[]=[];

  staffList:Staff[]|null=[];

  selected:string|null=null;
  oldSelected:string|null=null;

  changeDetected:boolean=false;

  taskList:Task[]|null=[];
  tasksForWeek:Task[]|null=[];

  weekStart:Date|null=null;
  oldWeekStart:Date|null=null;

  weekStop:Date|null=null;
  oldWeekStop:Date|null=null;
  
  constructor(private api:ApiService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.selected=this.route.snapshot.paramMap.get('selected');
    console.log(this.selected);
    //this.oldSelected=this.selected;
    for(let i=0;i<56;i++)
      this.intervals[i]=i;

    for(let i=0;i<5;i++)
      this.days[i]=i+1;

      this.api.getAllStaff()
      .then((staff) => {
        this.staffList=staff.data;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        console.log('Selecting from Staff completed');
      });

      this.setStartStopWeek();
  }

  setStartStopWeek(){
    let today = new Date();
    let startDay = today.getDate() - today.getDay();
    let stopDay = startDay + 6;
    this.weekStart=new Date(today.getFullYear(),today.getMonth(),startDay);
    this.weekStop=new Date(today.getFullYear(),today.getMonth(),stopDay);
    this.oldWeekStart=this.weekStart;
    this.oldWeekStop=this.weekStop;
  }

  ngDoCheck(){
    if(this.selected != this.oldSelected){
      this.changeDetected=true;
      console.log('Selection change detected!');
      this.oldSelected=this.selected;
    }

    if(this.weekStart != this.oldWeekStart){
      this.changeDetected=true;
      console.log('Date change detected!');
      this.oldWeekStart=this.weekStart;
      this.oldWeekStop=this.oldWeekStop
    }

    if(this.selected != null && this.weekStart!=null && this.weekStop!=null && this.changeDetected){
      this.api.getTasks(parseInt(this.selected),this.weekStart,this.weekStop)
      .then((tasks) => {
        this.taskList=tasks.data;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        console.log('Selecting from Tasks completed');
      });
    }
    this.changeDetected=false;
  }


  showIntervalNum(ind:number){
    if(ind%4==0)
      return true;
    return false;
  }

  getTasksForDay(day:number){
    let dayTaskList:Task[]=[]
    if(this.taskList!=null){
      for(let task of this.taskList){
        if(task.day==day)
          dayTaskList.push(task);
      }
    }
    return dayTaskList;
  }

  getStaffMember(){
    if(this.staffList==null || this.selected==null)
      return null;
    return this.staffList[parseInt(this.selected)-1];
  }
}
