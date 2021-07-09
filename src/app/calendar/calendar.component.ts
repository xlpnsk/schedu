import { not } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as internal from 'stream';
import { ApiService } from '../api.service';
import { Staff } from '../models/staff.model';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  intervals:number[]=[];
  days:number[]=[];

  foods: any[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  staffList:Staff[]|null=[];
  selected:string|null=null;
  constructor(private api:ApiService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.selected=this.route.snapshot.paramMap.get('selected');
    console.log(this.selected);
    for(let i=0;i<56;i++)
      this.intervals[i]=i;

    for(let i=0;i<5;i++)
      this.days[i]=i;

      this.api.getAllStaff()
      .then((staff) => {
        this.staffList=staff.data;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        console.log('Selecting from Staff compleated');
      });
  }


  showIntervalNum(ind:number){
    if(ind%4==0)
      return true;
    return false;
  }
}
