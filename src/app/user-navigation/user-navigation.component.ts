import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { UserNavigationService } from './user-navigation.service';
import { faArrowRightFromBracket,faUser } from '@fortawesome/free-solid-svg-icons';
import { AdminNavigationService } from '../admin-navigation/admin-navigation.service';


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
  companyimage : string | null = '';


  dropdownVisible = false;
  isCollapsed = true;

  constructor(private router: Router,private usernavigationService:UserNavigationService,private adminnavigationService:AdminNavigationService) {
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
    this.displayLogo();
      this.userRole =sessionStorage.getItem('userRole');
        this.loadUserData();
        const studentId = sessionStorage.getItem('studentId');

        if(studentId){
          this.fetchProfileImage(studentId);
        }
  }

  
  
  displayLogo() {
    this.adminnavigationService.displayLogo().subscribe(
      (response: any) => {
        this.companyimage = response.companylogo; 
      },
      error => {
        console.error('Error fetching company logo:', error);
      }
    );
  }
  

  switchToAdmin() {
    sessionStorage.removeItem('newRole');  // Remove the new role
      this.isLoading = true;
  
      setTimeout(() => {
        this.router.navigate(['/dashboard']).then(() => {
          this.isLoading = false;
          document.body.style.overflow = 'hidden'; 
        });
      }, 10);
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

  toggleDropdown(event?: MouseEvent) {
    if (event) {
      event.stopPropagation(); // Prevent triggering document click
    }
    this.dropdownVisible = !this.dropdownVisible;
  }

  viewProfile() {
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
    const dropdown = document.querySelector('.dropdown-menu');
    const profileToggle = document.querySelector('.dropdown-toggle');

    const clickedInsideSidebar = sidebar && sidebar.contains(event.target as Node);
  const clickedToggleBtn = toggleBtn && toggleBtn.contains(event.target as Node);
  const clickedInsideDropdown = dropdown && dropdown.contains(event.target as Node);
  const clickedProfileToggle = profileToggle && profileToggle.contains(event.target as Node);

   if (!clickedInsideSidebar && !clickedToggleBtn) {
    this.isCollapsed = true;
  }

  if (!clickedInsideDropdown && !clickedProfileToggle) {
    this.dropdownVisible = false;
  }
}
}
