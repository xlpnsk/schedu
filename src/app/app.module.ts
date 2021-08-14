import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MainComponent } from './main/main.component';
import { InfoComponent } from './info/info.component';
import { StaffComponent } from './staff/staff.component';
import { ApiService } from './api.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoMaterialModule } from './material-module';
import { DayComponent } from './calendar/day/day.component';
import { TimeComponent } from './calendar/time/time.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskComponent } from './calendar/day/task/task.component';
import { DialogComponent } from './calendar/day/task/dialog/dialog.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { AccountComponent } from './user/account/account.component';
import { AuthGuard } from './guards/auth.guard';
import { NewTaskComponent } from './forms/new-task/new-task.component';
import { PasswdComponent } from './forms/passwd/passwd.component';
import { TaskListComponent } from './user/task-list/task-list.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { AdminContentComponent } from './admin/admin-content/admin-content.component';
import { AdminMessagesComponent } from './admin/admin-messages/admin-messages.component';
import { NewStaffComponent } from './forms/new-staff/new-staff.component';
import { ContactComponent } from './contact/contact.component';
@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    CalendarComponent,
    MainComponent,
    InfoComponent,
    StaffComponent,
    DayComponent,
    TimeComponent,
    TaskComponent,
    DialogComponent,
    LoginComponent,
    RegisterComponent,
    AccountComponent,
    NewTaskComponent,
    PasswdComponent,
    TaskListComponent,
    AdminPanelComponent,
    AdminContentComponent,
    AdminMessagesComponent,
    NewStaffComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ApiService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
