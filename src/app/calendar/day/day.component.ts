import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {

  intervals:number[]=[];
  constructor() { }

  ngOnInit(): void {
    for(let i=0;i<56;i++)
      this.intervals[i]=i;
  }

}
