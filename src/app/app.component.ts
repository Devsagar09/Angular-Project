import { Component, HostListener } from '@angular/core';
import { SVGIcon,homeIcon,bookIcon   } from '@progress/kendo-svg-icons'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {

  isLoading = true;

  constructor() {
    // Simulate loading process
    setTimeout(() => {
      this.isLoading = false;
    }, 3000); // Adjust time as needed
  }
 
 public HomeSVG: SVGIcon = homeIcon;
   title = 'angular-project';
  
   dropdownVisible = false;
   isCollapsed = true;
 
   toggleDropdown() {
     this.dropdownVisible = !this.dropdownVisible;
   }
 
   viewProfile() {
     console.log('View Profile clicked');
   }
 
   logout() {
     console.log('Logout clicked');
   }
 
   toggleSidebar() {
     this.isCollapsed = !this.isCollapsed;
   }
 
   @HostListener('document:click', ['$event'])
   closeSidebarOnClickOutside(event: Event) {
     const sidebar = document.querySelector('.sidebar');
     const toggleBtn = document.querySelector('.toggle-btn');
 
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
