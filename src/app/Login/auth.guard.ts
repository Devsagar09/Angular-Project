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
    const newRole = sessionStorage.getItem('newRole');
    const allowedRoles = route.data['roles'] as Array<string>;

    if (studentId) {
      if (allowedRoles && !allowedRoles.includes(userRole!)) {
        this.snackBar.open('Access Denied: Insufficient Permissions', 'Close', {
          duration: 5000
        });
        return this.router.parseUrl('/unauthorized');
      }
  
      if (state.url === '/' || state.url === '/login') {
        if (userRole === 'Admin' || newRole==='Admin') {
          return this.router.parseUrl('/dashboard');
        } else if (userRole === 'Student' || newRole==='Student') {
          return this.router.parseUrl('/studentdashboard');
        }
      }
      return true; 
    } else {
      
      this.router.navigate(['/login']);
      return false;
    }

  }
  
  
}
