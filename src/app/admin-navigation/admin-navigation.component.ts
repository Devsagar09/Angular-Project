import { Component, ElementRef, HostListener } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router'; 

@Component({
  selector: 'app-admin-navigation',
  standalone: false,
  templateUrl: './admin-navigation.component.html',
  styleUrl: './admin-navigation.component.css'
})
export class AdminNavigationComponent {  
  title = 'angular-project';
  firstname: string | null = '';
  lastname: string | null = '';
  dropdownVisible = false;
  isCollapsed = true;
  isLoading = true;
  isLoginPage = true;

  constructor(private eRef: ElementRef, private router: Router) {
    this.router.events.subscribe(event=>{
      if(event instanceof NavigationEnd){
        this.isLoginPage = this.router.url === '/login';
      }
    });
    // Simulate loading process
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.loadUserData();
      }
    });
  }

  loadUserData() {
    this.firstname = localStorage.getItem('firstname');
    this.lastname = localStorage.getItem('lastname');
  }

  logout() {
    this.isLoading = true; 
    this.firstname = '';
    this.lastname = '';
    localStorage.clear();
        window.location.href = '/login';
  }

  toggleDropdown(event: Event) {
    event.stopPropagation(); // Prevent closing when clicking inside the dropdown
    this.dropdownVisible = !this.dropdownVisible;
  }
  

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  viewProfile() {
    console.log('View Profile clicked');
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.toggle-btn');

    // Close dropdown if click is outside
    if (this.dropdownVisible && !this.eRef.nativeElement.querySelector('.dropdown-menu')?.contains(event.target)) {
      this.dropdownVisible = false;
    }

    // Close sidebar if click is outside
    if (
      this.isCollapsed === false &&
      sidebar &&
      !sidebar.contains(event.target as Node) &&
      toggleBtn &&
      !toggleBtn.contains(event.target as Node)
    ) {
      this.isCollapsed = true;
    }
  }
}

