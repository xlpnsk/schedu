import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css']
})
export class TimeComponent implements OnInit {

  intervals:number[]=[];
  constructor() { }

  ngOnInit(): void {
    for(let i=0;i<56;i++)
      this.intervals[i]=i;
  }

  showIntervalNum(ind:number){
    if(ind%4==0)
      return true;
    return false;
  }

}
