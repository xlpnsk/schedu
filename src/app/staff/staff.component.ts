import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ApiService } from '../api.service';
import { Staff } from '../models/staff.model';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {

  staffList:Staff[]|null=[];
  visibleStaffList:Staff[]|null=[];

  searchFromGroup:FormGroup;
  searchControl=new FormControl('');

  constructor(private api:ApiService, private cdr: ChangeDetectorRef) {
    this.searchFromGroup = new FormGroup({
      search: this.searchControl
    });
   }

  ngOnInit(): void {
      this.api.getAllStaff()
        .then((staff) => {
          this.staffList=staff.data;
          this.visibleStaffList=this.staffList
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          console.log('Selecting from Staff compleated');
        })

  }

  ngDoCheck(){
    this.filterStaff();
  }

  filterStaff(){
    let reg = new RegExp(this.searchControl.value.toLowerCase())
    if(this.searchControl.value==''){
      this.visibleStaffList=this.staffList;
    }
    else{
      let filtered=this.staffList?.filter((val) => {
        let fullName=val.firstName+val.lastName;
        return reg.test(fullName.toLowerCase())
      });
      this.visibleStaffList=(typeof(filtered)=='undefined')? [] : filtered;
    }
  }

}
