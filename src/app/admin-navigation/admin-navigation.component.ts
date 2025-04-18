import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AdminNavigationService } from './admin-navigation.service';

@Component({
  selector: 'app-admin-navigation',
  standalone: false,
  templateUrl: './admin-navigation.component.html',
  styleUrls: ['./admin-navigation.component.css']
})

export class AdminNavigationComponent implements OnInit {
  title = 'angular-project';
  firstname: string | null = '';
  lastname: string | null = '';
  profileImage: string | null = '';
  companyimage : string | null = '';
  dropdownVisible = false;
  isCollapsed = true;
  isLoading = false;
  isLoginPage = true;

  constructor(private eRef: ElementRef, private router: Router, private adminnavigationService: AdminNavigationService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      }
      if (event instanceof NavigationEnd) {
        this.isLoginPage = this.router.url.toLowerCase() === '/login';

        // Simulate loading process
        setTimeout(() => {
          this.isLoading = false;
        }, 2000);
      }
    });
  }

  ngOnInit() {
    this.displayLogo();
        this.loadUserData();
        const studentId = sessionStorage.getItem('studentId');
        if(studentId){
          this.fetchProfileImage(studentId);
        }
  }

  switchToLearner() {
    if (this.isAdmin()) {
      sessionStorage.setItem('newRole', 'Student');
      this.isLoading = true;
  
      setTimeout(() => {
        this.router.navigate(['/studentdashboard']).then(() => {
          this.isLoading = false;
          document.body.style.overflow = 'hidden'; 
        });
      }, 10);
    }
  }
  
  loadUserData() {
    this.firstname = sessionStorage.getItem('firstname');
    this.lastname = sessionStorage.getItem('lastname');
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


    fetchProfileImage(studentId: string) {
      this.adminnavigationService.getProfileImage(studentId).subscribe(
        response => {
          // console.log('Image URL:', response.profileImage);
          this.profileImage=response.profileImage;
        },
        error => {
          console.error('Error fetching profile image:', error);
        }
      );
    }

    logout() {
      this.isLoading = true;
        this.firstname = '';
        this.lastname = '';
        sessionStorage.clear();
        window.location.href = '/login';
    }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownVisible = !this.dropdownVisible;
    console.log('Dropdown toggled:', this.dropdownVisible); // Debug log
  }

 

  getDisplayedRole(): string {
    return sessionStorage.getItem('newRole') || sessionStorage.getItem('userRole') || '';
  }

  isAdmin(): boolean {
    return this.getDisplayedRole() === 'Admin';
  }

  isStudent(): boolean {
    return this.getDisplayedRole() === 'Student';
  }


  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.toggle-btn');

    // Close dropdown if click is outside
    if (
      this.dropdownVisible &&
      !this.eRef.nativeElement.querySelector('.dropdown-menu')?.contains(event.target) &&
      !this.eRef.nativeElement.querySelector('.user-profile')?.contains(event.target)
    ) {
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
