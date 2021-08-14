import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { title } from 'process';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Staff } from './models/staff.model';
import { Task } from './models/task.model';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private supabase:SupabaseClient;
  private _currentUser: BehaviorSubject<any> = new BehaviorSubject(null);
  private _admin:BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private router: Router) {
    this.supabase = createClient(environment.SUPABASE_URL,environment.SUPABASE_KEY,{
      autoRefreshToken: true,
      persistSession: true
    });

    this.loadUser();
    this.isAdmin();
 
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event == 'SIGNED_IN') {
        this._currentUser.next(session?.user);
      } else {
        this._currentUser.next(false);
      }
    });
   }


 async loadUser() {
   const user = await this.supabase.auth.user();

   if (user) {
     this._currentUser.next(user);
   } else {
     this._currentUser.next(false);
   }
 }

 get currentUser(): Observable<User> {
   return this._currentUser.asObservable();
 }

 get admin(): Observable<boolean>{
   return this._admin.asObservable();
 }

 async getUser(){
   return this.supabase.auth.user()
 }

  async getAllStaff(){
    //all staff, but not admin and not ones that haven't sign up yet
    let { data: Staff, error } = await this.supabase
      .from('Staff')
      .select('*')

      .not('roleId','eq','1')
      .not('userId','is','null')

    return {data:Staff, error}
  }

  async getTasks(id:number, startDate:Date, stopDate:Date){
    let { data: Tasks, error } = await this.supabase
    .from('Tasks')
    .select("*")

    // Filters
    .eq('staffId', id)
    .gte('stopDate', startDate.toISOString())
    .lte('startDate', stopDate.toISOString())
    
    return {data:Tasks, error}

  }

  async getTasksByUuid(){
    let { data: Tasks, error } = await this.supabase
    .from('Tasks')
    .select(`
    id,
    description,
    startDate,
    stopDate,
    Staff (userId),
    TaskType (name),
    startTime,
    stopTime,
    day
  `)
    .eq('Staff.userId',this.supabase.auth.user()?.id)

    let Filtered=Tasks?.filter(function(value, index, arr){
      if(value.Staff !== null)
        return value
    });

    return { data: Filtered, error }
  }

  async getTasksByEmail(email:string, startDate:Date, stopDate:Date){
    let { data: Tasks, error } = await this.supabase
    .from('Tasks')
    .select(`
      startTime,
      stopTime,
      day,
      TaskType (name),
      Staff (email)
    `)

    // Filters
    .filter('Staff.email', 'eq', email)
    .gte('stopDate', startDate.toISOString())
    .lte('startDate', stopDate.toISOString())
    .order('day',{ ascending: true })
    //required because supabase returns all tasks with 'Staff: null' instead of email
    //filter doesn't work
    let Filtered=Tasks?.filter(function(value, index, arr){
      if(value.Staff !== null)
        return value
    });
    
    return {data:Filtered, error}
  }

  async getAllTaskTypes(){
    let { data: TaskType, error } = await this.supabase
      .from('TaskType')
      .select('*')

    return { data: TaskType, error }
  }

  async getTaskType(id:number){
    let { data: TaskType, error } = await this.supabase
  .from('TaskType')
  .select('*')

  // Filters
  .eq('id', id)

  return { data: TaskType, error }
  }

  async deleteTask(id:number){
    const { data, error } = await this.supabase
      .from('Tasks')
      .delete()
      .eq('id', id);

    return { data, error }
  }

  async updateStaffUuid(user:User){
    const { data, error } = await this.supabase
      .from('Staff')
      .update({ userId: user.id })
      .eq('email', user.email);

    return { error }
  }


  async signIn(credentials:{ email:string, password:string }){
    return new Promise(async (resolve, reject) => {
      const { user, error } = await this.supabase.auth.signIn(credentials);
      if (error) {
        reject(error);
      } else {
        resolve(user);
      }
    });
  }

  async signUp(credentials: { email:string, password:string }) {
    return new Promise(async (resolve, reject) => {
      //checking if new user is a staff member
      let { data: Staff, error } = await this.supabase
      .from('Staff')
      .select('email')
      .eq('email', credentials.email);
      if(typeof Staff?.pop() == 'undefined'){
        //if not then reject sign up promise
        let err=new Error('If you are a staff member contact with the administrator');
        reject(err);
      }
      else{
        const { user, error } = await this.supabase.auth.signUp(credentials)
          if (error) {
            reject(error);
            } else {
              if(user!=null){
                //try to update user uuid in Staff table
                let err = this.updateStaffUuid(user);
                if(err!=null)
                  resolve(user);
                else
                  reject(err);
              }
            reject(new Error('An unexpected error has occurred'));
            }
          }
    });
  }

  signOut() {
    this.supabase.auth.signOut().then(_ => {
      // Clear up and end all active subscriptions!
      this.supabase.getSubscriptions().map(sub => {
        this.supabase.removeSubscription(sub);
      });
      
      this.router.navigateByUrl('/');
    });
  }

  async changePasswd(newPassword:string){
    const { user, error } = await this.supabase.auth.update({
      password: newPassword
    });

    return { user, error }
  }


  //admin
  async getAdminTasks(){
    let { data: Tasks, error } = await this.supabase
    .from('Tasks')
    .select(`
      id,
      description,
      startDate,
      stopDate,
      Staff(email),
      TaskType(name),
      startTime,
      stopTime,
      day
    `);

    return { data: Tasks, error }
  }

  async getAdminStaff(){
    let { data: Staff, error } = await this.supabase
      .from('Staff')
      .select(`
        id,
        firstName,
        lastName,
        title,
        email,
        userId,
        Roles(name)
      `);

    return { data: Staff, error }
  }

  async getAdminUsers(){
    let { data:Users, error } = await this.supabase
      .from('auth.users')
      .select('*');

    return { data:Users, error }
  }

  async getAdminMessages(){
    let { data: Messages, error } = await this.supabase
      .from('Messages')
      .select('*');

    return { data: Messages, error }      
  }

  async insertStaff(memberCredentials: {firstName:string, lastName:string, title:string, email:string}){
    const { data, error } = await this.supabase
      .from('Staff')
      .insert([
        { 
          firstName: memberCredentials.firstName, 
          lastName: memberCredentials.lastName,
          title: memberCredentials.title,
          email: memberCredentials.email 
        },
      ]);

      return { data, error }
  }

  async insertMessage(messageData: {email:string, message:string}){
    const { data, error } = await this.supabase
      .from('Messages')
      .insert([
        { 
          email: messageData.email, 
          message: messageData.message 
        },
      ]);

    return {data, error }
  }

  async deleteMessage(id:number){
    const { data, error } = await this.supabase
      .from('Messages')
      .delete()
      .eq('id', id);

    return { data, error }
  }

  async isAdmin(){
    let uuid=this.supabase.auth.user()?.id;
    const { data: Staff, error } = await this.supabase
      .from('Staff')
      .select(`
        userId,
        Roles (
          name
        )
      `)
      .eq('userId',uuid);

    if(Staff!=null){
      if(Staff.pop().Roles.name=="admin")
        this._admin.next(true);
    }
    this._admin.next(false);
          
  }

  async insertTask(taskData:Task){
    const { data, error } = await this.supabase
      .from('Tasks')
      .insert([{ 
        description: taskData.description, 
        startDate: taskData.startDate,
        stopDate: taskData.stopDate,
        startTime: taskData.startTime,
        stopTime: taskData.stopTime,
        day: taskData.day,
        staffId: taskData.staffId,
        typeId: taskData.typeId
      }]);

    return { data, error };
  }

  async getTaskById(id:number){
    let { data: Tasks, error } = await this.supabase
    .from('Tasks')
    .select('*')
    .eq('id',id);

    return { data: Tasks, error }
  }

  async getStaffId(uuid:any){
    let { data, error } = await this.supabase
      .from('Staff')
      .select('id')
      .eq('userId',uuid)

    return { data, error };
  }

  async getStaffById(id:number){
    let { data, error } = await this.supabase
      .from('Staff')
      .select('*')
      .eq('id',id)

    return { data, error };
  }

  async updateStaffEmail(email:string,id:number){
    const { data, error } = await this.supabase
      .from('Staff')
      .update({ 
        email: email 
      })
      .eq('id', id);

    return { data, error }
  }

  async updateStaff(staffData:Staff,id:number){
    const { data, error } = await this.supabase
      .from('Staff')
      .update({ 
        title: staffData.title,
        firstName: staffData.firstName,
        lastName: staffData.lastName,
        email: staffData.email 
      })
      .eq('id', id);

    return { data, error }
  }

  async updateTask(taskData:Task, taskId:number){
    
    const { data, error } = await this.supabase
      .from('Tasks')
      .update({ 
        description: taskData.description, 
        startDate: taskData.startDate,
        stopDate: taskData.stopDate,
        startTime: taskData.startTime,
        stopTime: taskData.stopTime,
        day: taskData.day,
        typeId: taskData.typeId
      })
      .eq('id', taskId);

    return { data, error }

  }

  async deleteStaff(id:number){
    const { data, error } = await this.supabase
      .from('Staff')
      .delete()
      .eq('id', id);

    return { data, error }
  }
  
}
