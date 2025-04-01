import { Component } from '@angular/core';

@Component({
  selector: 'app-viewprofile',
  standalone: false,
  templateUrl: './viewprofile.component.html',
  styleUrl: './viewprofile.component.css'
})
export class ViewprofileComponent {
  activeTab: string = 'security';  // Default active tab is 'security'

  // Function to set the active tab
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Function to handle file selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Handle the file upload logic here
      console.log(file.name);
    }
  }
}