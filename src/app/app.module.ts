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
import { FormsModule } from '@angular/forms';
import { TaskComponent } from './calendar/day/task/task.component';
import { DialogComponent } from './calendar/day/task/dialog/dialog.component';
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
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    FormsModule
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
