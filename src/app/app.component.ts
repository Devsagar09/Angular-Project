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
  private inactivityLimit = 60 * 60 * 1000; // 60 minutes
  userRole: string | null = null;
  newRole: string | null = null;
  isLoading: boolean = true;  // Add a loading flag

  constructor(private router: Router) {}

  ngOnInit() {
    this.newRole=sessionStorage.getItem('newRole');
    this.userRole = sessionStorage.getItem('userRole');
    this.resetInactivityTimer();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.resetInactivityTimer();
      }
    });
    setTimeout(() => {
       this.isLoading = false;
    }, 300);
  }

  @HostListener('document:mousemove')
  @HostListener('document:keydown')
  @HostListener('document:click')
  @HostListener('document:scroll')
  @HostListener('document:touchstart')
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

  getUserRole(): string {
    return sessionStorage.getItem('newRole') || sessionStorage.getItem('userRole') || '';
  }
  
  isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }
  
  isStudent(): boolean {
    return this.getUserRole() === 'Student';
  }
  
}
