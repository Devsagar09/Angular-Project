import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-user-navigation',
  standalone: false,
  templateUrl: './user-navigation.component.html',
  styleUrls: ['./user-navigation.component.css']
})
export class UserNavigationComponent implements OnInit {

  firstname: string | null = '';
  lastname: string | null = '';
  profileImage: string | null = '';
  isLoading = true;
  isLoginPage = true;

  dropdownVisible = false;
  isCollapsed = true;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;  
      } 
      if (event instanceof NavigationEnd) {
        this.isLoginPage = this.router.url.toLowerCase() === '/login'; // ✅ Properly set login page condition
        setTimeout(() => {
          this.isLoading = false;  
        }, 2000);
      }
    });
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadUserData();
      }
    });
  }

  loadUserData() {
    this.firstname = sessionStorage.getItem('firstname');
    this.lastname = sessionStorage.getItem('lastname');
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  viewProfile() {
    console.log('View Profile clicked');
    this.dropdownVisible = false;
  }

  logout() {
    this.isLoading = true;
    this.firstname = '';
    this.lastname = '';
    sessionStorage.clear();
    this.dropdownVisible = false;
    window.location.href = '/login';
  }

  @HostListener('document:click', ['$event'])
  closeSidebarOnClickOutside(event: Event) {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.toggle-btn');

    if (sidebar && !sidebar.contains(event.target as Node) && toggleBtn && !toggleBtn.contains(event.target as Node)) {
      this.isCollapsed = true;
    }
  }
}
