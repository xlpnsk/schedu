import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { User } from '@supabase/supabase-js';
import { error } from 'console';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'buffer';
  value = 50;
  bufferValue = 0;

  messagesNumber=0;
  tasksNumber=0;
  staffNumber=0;

  hidden=true;

  adminEmail:string='';
  constructor(private api:ApiService) {
    
   }

  ngOnInit(): void {
    this.api.getUser().
    then((user) => {
      if(typeof user?.email != 'undefined')
        this.adminEmail=user?.email;
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      console.log('Admin: Email selected');
    });
  }

  getMessagesNumberFromEvent(value:any){
    this.messagesNumber=value;
    this.showBadge(value)
  }

  getStaffNumberFromEvent(value:any){
    this.staffNumber=value;
  }

  getTaskNumberFromEvent(value:any){
    this.tasksNumber=value;
  }

  showBadge(value:any){
    if(value==0)
      this.hidden=true;
    else
      this.hidden=false;
  }

}
