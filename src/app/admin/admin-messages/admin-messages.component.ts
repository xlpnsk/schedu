import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { AdminMessage } from 'src/app/models/message.model';
import { Output, EventEmitter } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-messages',
  templateUrl: './admin-messages.component.html',
  styleUrls: ['./admin-messages.component.css']
})
export class AdminMessagesComponent implements OnInit {

  @Output() sendMessagesNumber = new EventEmitter<number>();

  messageList:AdminMessage[]=[];

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private api: ApiService,private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getMessages();
  }

  getMessages(){
    this.api.getAdminMessages()
    .then((messages) => {
      if(messages.data!=null)
        this.messageList=messages.data;
      this.emitMessagesNumber(this.messageList.length)
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      console.log('Admin: Selecting from Messages completed');
    });
  }

  emitMessagesNumber(value:number) {
    this.sendMessagesNumber.emit(value);
  }

  getMessageDateTime(dateString:string):string{
    let date=new Date(dateString).toDateString();
    let time=new Date(dateString).toTimeString().slice(0,8);

    return date + ' ' + time;
  }

  deleteMessage(id:number){
    this.api.deleteMessage(id)
    .then((message) => {
      this.openSnackBar('Message deleted!',false);
      this.getMessages();
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      console.log('Admin: Message deleted');
    });
  }

  openSnackBar(message:string,isError:boolean){
    let config = new MatSnackBarConfig();
    config.duration = 4000;
    config.horizontalPosition = this.horizontalPosition
    config.verticalPosition = this.verticalPosition
    if(isError){
      config.panelClass = ['error-snackbar']
    }
    this._snackBar.open(message,'Hide',config)
  }
}
