import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { InfoComponent } from './info/info.component';
import { MainComponent } from './main/main.component';
import { StaffComponent } from './staff/staff.component';

const routes: Routes = [
  { path: '', component: MainComponent},
  { path: 'schedule', component: CalendarComponent},
  { path: 'info', component: InfoComponent},
  { path: 'staff', component: StaffComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
