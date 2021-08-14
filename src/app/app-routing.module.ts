import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ContactComponent } from './contact/contact.component';
import { NewStaffComponent } from './forms/new-staff/new-staff.component';
import { NewTaskComponent } from './forms/new-task/new-task.component';
import { PasswdComponent } from './forms/passwd/passwd.component';
import { AuthAdminGuard } from './guards/auth-admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { InfoComponent } from './info/info.component';
import { MainComponent } from './main/main.component';
import { StaffComponent } from './staff/staff.component';
import { AccountComponent } from './user/account/account.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { TaskListComponent } from './user/task-list/task-list.component';

const routes: Routes = [
  { path: '', component: MainComponent},
  { path: 'schedule', component: CalendarComponent},
  { path: 'info', component: InfoComponent},
  { path: 'staff', component: StaffComponent},
  { path: 'contact', component: ContactComponent},
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard]},
  { path: 'account/task', component: NewTaskComponent, canActivate: [AuthGuard]},
  { path: 'password', component: PasswdComponent, canActivate: [AuthGuard]},
  { path: 'account/tasks', component: TaskListComponent, canActivate: [AuthGuard]},
  { path: 'admin', component: AdminPanelComponent, canActivate: [AuthAdminGuard,AuthGuard]},
  { path: 'admin/staff', component: NewStaffComponent, canActivate: [AuthAdminGuard,AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard],
  exports: [RouterModule]
})
export class AppRoutingModule { }
