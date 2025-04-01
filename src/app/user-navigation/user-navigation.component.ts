import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { UserNavigationService } from './user-navigation.service';
import { faArrowRightFromBracket,faUser } from '@fortawesome/free-solid-svg-icons';


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
  userRole: string | null = '';
  isLoading = true;
  isLoginPage = true;
  faArrowRightFromBracket = faArrowRightFromBracket;
  faUser = faUser 
  dropdownVisible = false;
  isCollapsed = true;

  constructor(private router: Router,private usernavigationService:UserNavigationService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;  
      } 
      if (event instanceof NavigationEnd) {
        this.isLoginPage = this.router.url.toLowerCase() === '/login'; 
        setTimeout(() => {
          this.isLoading = false;  
        }, 2000);
      }
    });
  }

  ngOnInit() {
      this.userRole =sessionStorage.getItem('userRole');
        this.loadUserData();
        const studentId = sessionStorage.getItem('studentId');
      
        if(studentId){
          this.fetchProfileImage(studentId);
        }
  }
  
  
  switchToAdmin() {
    sessionStorage.removeItem('newRole');  // Remove the new role
    this.router.navigate(['/dashboard']).then(() => {
        window.location.href = '/dashboard';
    });
}

  loadUserData() {
    this.firstname = sessionStorage.getItem('firstname');
    this.lastname = sessionStorage.getItem('lastname');
  }

  fetchProfileImage(studentId: string) {
    this.usernavigationService.GetProfileImage(studentId).subscribe(
      response => {
        // console.log('Image URL:', response.profileImage);
        this.profileImage=response.profileImage;  // ✅ Log extracted URL
      },
      error => {
        console.error('Error fetching profile image:', error);
      }
    );
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
