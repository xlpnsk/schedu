import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { filter, map, take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuard implements CanActivate {
  
  //isAdmin=false;
  constructor(private api: ApiService, private router: Router) {
   }
 
  canActivate(): Observable<boolean> {
    console.log('Checking permits...');
    return this.api.admin.pipe(
      filter(val => val !== null), // Filter out initial Behaviour subject value
      take(1), // Otherwise the Observable doesn't complete!
      map(isAdmin => {
        if (isAdmin) {
          return true
        }
        else{
          this.router.navigateByUrl('/account')
          return false;
        }
      }
    )
    )
  }   
  //   return this.api.currentUser.pipe(
  //     filter(val => val !== null), // Filter out initial Behaviour subject value
  //     take(1), // Otherwise the Observable doesn't complete!
  //     map(isAuthenticated => {
  //       if (isAuthenticated) {
  //         this.api.admin.pipe(filter(val => val !== null),take(1))  //this will limit the observable to only one value
  //         .subscribe((val) => {
  //             console.log(val)
  //             this.isAdmin = val; 
  //         });
  //         console.log('th'+this.isAdmin)     
  //         return true;
  //       } else {          
  //         this.router.navigateByUrl('/login')
  //         return false;
  //       }
  //     })
  //   );
  // }
  
}
