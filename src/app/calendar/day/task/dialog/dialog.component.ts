import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Staff } from 'src/app/models/staff.model';
import { Task } from 'src/app/models/task.model';

export interface TaskDialogData{
  description: string;
  startDate: string;
  stopDate: string;
  staff: Staff;
  type: string;
  startTime: string;
  stopTime: string;
  day: string;
}
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  dayNames:string[]=["Mondays","Tuesdays","Wednesdays","Thursdays","Fridays"];

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  getDayName(str:string){
    let d=parseInt(str)-1;
    return this.dayNames[d];
  }



}
