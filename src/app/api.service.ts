import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { Staff } from './models/staff.model';
import { Task } from './models/task.model';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  supabase = createClient(environment.SUPABASE_URL,environment.SUPABASE_KEY)
  constructor() { }

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

  async getTaskType(id:number){
    let { data: TaskType, error } = await this.supabase
  .from('TaskType')
  .select('name')

  // Filters
  .eq('id', id)

  return { data: TaskType, error }
  }
}
