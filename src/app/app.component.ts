import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  private inactivityTimer: any;
  private inactivityLimit = 20 * 60 * 1000; // 2 minutes
  userRole: string | null = null;
  // isLoading: boolean = true;  // Add a loading flag

  constructor(private router: Router) {}

  ngOnInit() {
    this.resetInactivityTimer();
        this.userRole = localStorage.getItem('userRole');
    // setTimeout(() => {
    //    this.isLoading = false;
    // }, 500);

    this.userRole = sessionStorage.getItem('userRole');
  }

  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:click')
  resetInactivityTimer() {
    clearTimeout(this.inactivityTimer); // Clear previous timer
    this.inactivityTimer = setTimeout(() => {
      this.handleSessionExpired();
    }, this.inactivityLimit);
  }

  handleSessionExpired() {
    sessionStorage.clear();
    alert('Session expired. Please log in again.');
    this.router.navigate(['/login']);
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
