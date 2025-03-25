import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private snackBar: MatSnackBar) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree{
    const studentId = sessionStorage.getItem('studentId');
    const userRole = sessionStorage.getItem('userRole'); 

    if (studentId) {
      if (state.url === '/') {
        if (userRole === 'Admin') {
          return this.router.parseUrl('/dashboard');
        } else if (userRole === 'Student') {
          return this.router.parseUrl('/studentdashboard');
        }
      }
      return true; 
    } else {
      this.snackBar.open('You must log in first!', 'OK', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['app-notification']
      });

      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
