import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
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

  constructor(private router: Router) {
    this.supabase = createClient(environment.SUPABASE_URL,environment.SUPABASE_KEY,{
      autoRefreshToken: true,
      persistSession: true
    });

    this.loadUser();
 
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

 async getUser(){
   return this.supabase.auth.user()
 }

  async getAllStaff(){
    let { data: Staff, error } = await this.supabase
      .from('Staff')
      .select('*')

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

  async getTaskType(id:number){
    let { data: TaskType, error } = await this.supabase
  .from('TaskType')
  .select('*')

  // Filters
  .eq('id', id)

  return { data: TaskType, error }
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
      const { user, error } = await this.supabase.auth.signUp(credentials)
      if (error) {
        reject(error);
      } else {
        resolve(user);
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
  
}
