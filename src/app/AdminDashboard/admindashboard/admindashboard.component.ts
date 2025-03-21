import { Component } from '@angular/core';
import { AdmindashboardService } from '../admindashboard.service';

@Component({
  selector: 'app-admindashboard',
  standalone: false,
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.css'
})
export class AdmindashboardComponent {

  dashboardData: any;

  constructor(private homeService: AdmindashboardService) {}

  ngOnInit(): void {
    this.loadDashboardCounts();
  }

  loadDashboardCounts(): void {
    this.homeService.getCountAdminDashboard().subscribe({
      next: (response) => {
        this.dashboardData = response;
      },
      error: (error) => {
        console.error('Error fetching dashboard counts:', error);
      }
    });
  }

}
