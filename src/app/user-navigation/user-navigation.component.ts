import { Component, ElementRef, HostListener } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { SVGIcon, homeIcon, bookIcon } from '@progress/kendo-svg-icons';

@Component({
  selector: 'app-user-navigation',
  standalone: false,
  templateUrl: './user-navigation.component.html',
  styleUrl: './user-navigation.component.css'
})
export class UserNavigationComponent {
 
  isLoading = false;

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true; // Show loader on route start
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        setTimeout(() => {
          this.isLoading = false; // Hide loader after a small delay
        }, 2000);
      }
    });
  }
 
  public HomeSVG: SVGIcon = homeIcon; 

  dropdownVisible = false;
  isCollapsed = true;

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  viewProfile() {
    console.log('View Profile clicked');
    this.dropdownVisible = false;
  }

  logout() {
    console.log('Logout clicked');
    this.dropdownVisible = false;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  @HostListener('document:click', ['$event'])
  closeSidebarOnClickOutside(event: Event) {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.toggle-btn');

    // Close dropdown if click is outside
    // if (this.dropdownVisible && !this.eRef.nativeElement.querySelector('.dropdown-menu')?.contains(event.target)) {
    //   this.dropdownVisible = false;
    // }

    if (
      sidebar &&
      !sidebar.contains(event.target as Node) &&
      toggleBtn &&
      !toggleBtn.contains(event.target as Node)
    ) {
      this.isCollapsed = true;
    }

  }
}
