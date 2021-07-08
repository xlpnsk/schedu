import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Staff } from '../models/staff.model';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {

  staffList:Staff[]|null=[];
  constructor(private api:ApiService) { }

  ngOnInit(): void {
      this.api.getAllStaff()
        .then((staff) => {
          this.staffList=staff.data;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          console.log('Selecting from Staff compleated');
        })
  }

}
