import { Component, OnInit } from '@angular/core'; 
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  userRole: string | null = null;


  constructor(private router: Router) {}

  ngOnInit() {
    this.userRole = sessionStorage.getItem('userRole');
  }

  isLoggedIn(): boolean {
    return !!this.userRole;  
  }

  isAdmin(): boolean {
    return this.userRole === 'Admin';
  }

  isStudent(): boolean {
    return this.userRole === 'Student';
  }
}
