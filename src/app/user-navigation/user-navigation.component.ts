import { Component, ElementRef, HostListener } from '@angular/core'; 
import { Router,NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { SVGIcon,homeIcon,bookIcon   } from '@progress/kendo-svg-icons'; 

@Component({
  selector: 'app-user-navigation',
  standalone: false,
  templateUrl: './user-navigation.component.html',
  styleUrl: './user-navigation.component.css'
})
export class UserNavigationComponent {
    isLoading = true;
    public opened = true;
  
    constructor() {
      // Simulate loading process
      setTimeout(() => {
        this.isLoading = false;
      }, 3000); // Adjust time as needed
    }
  
    public open(): void {
      this.opened = true;
    }
  
    public close(status: string): void {
      console.log(`Dialog result: ${status}`);
      this.opened = false;
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
