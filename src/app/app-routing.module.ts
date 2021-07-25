import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { NewTaskComponent } from './forms/new-task/new-task.component';
import { PasswdComponent } from './forms/passwd/passwd.component';
import { AuthGuard } from './guards/auth.guard';
import { InfoComponent } from './info/info.component';
import { MainComponent } from './main/main.component';
import { StaffComponent } from './staff/staff.component';
import { AccountComponent } from './user/account/account.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';

const routes: Routes = [
  { path: '', component: MainComponent},
  { path: 'schedule', component: CalendarComponent},
  { path: 'info', component: InfoComponent},
  { path: 'staff', component: StaffComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  { path: 'task', component: NewTaskComponent, canActivate: [AuthGuard]},
  { path: 'password', component: PasswdComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule { }
