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
  isLoading: boolean = true;  // Add a loading flag


  constructor(private router: Router) {}

  ngOnInit() {
    this.userRole = localStorage.getItem('userRole');
    setTimeout(() => {
      this.isLoading = false;
    }, 500);  
  }

  isAdmin(): boolean {
    return this.userRole === 'Admin';
  }

  isStudent(): boolean {
    return this.userRole === 'Student';
  }
}
