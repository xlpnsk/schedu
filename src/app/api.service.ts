import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';
import { Staff } from './models/staff.model';
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
}
