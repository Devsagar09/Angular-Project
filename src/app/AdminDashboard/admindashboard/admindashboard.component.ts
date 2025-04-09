import { Component, OnInit } from '@angular/core';
import { AdmindashboardService } from '../admindashboard.service';
import { TrainingService } from '../../Training/training.service';
import { AdminNavigationService } from '../../admin-navigation/admin-navigation.service';

@Component({
  selector: 'app-admindashboard',
  standalone: false,
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.css'
})

export class AdmindashboardComponent implements OnInit {
  isLoading = true;
  trainingDatas: any;
  dashboardData: any;
  lastLogin: string = new Date().toLocaleString(); // Example last login time
  profileImage: string | null = '';

  constructor(private admindashboardService: AdmindashboardService, private trainingService: TrainingService, private adminNavigationService: AdminNavigationService) { }

  ngOnInit(): void {


    setTimeout(() => {
      this.isLoading = false;
      this.loadDashboardCounts();
      this.loadtraining();
      const studentId = sessionStorage.getItem('studentId'); // Get studentId from sessionStorage
      if (studentId) {
        this.fetchProfileImage(studentId); // ✅ Fetch profile image
      } else {
        console.error('Student ID not found in SessionStorage.');
      }
    }, 1000);

  }

  fetchProfileImage(studentId: string) {
    this.adminNavigationService.getStudentProfile(studentId).subscribe({
      next: (response) => {
        // console.log('Image URL:', response.profileImage);
        this.profileImage = response.profileImage;
      },
      error: (error) => {
        console.error('Error fetching profile image:', error);
      }
    });
  }



  // for display admin dashboard count
  loadDashboardCounts(): void {
    const studentId = sessionStorage.getItem('studentId'); // Ensure studentId exists
    console.log('Student ID:', studentId);

    if (studentId) {
      this.admindashboardService.getCountAdminDashboard(studentId).subscribe({
        next: (data) => {
          console.log('Dashboard data:', data);
          // If data is an array, extract the first element
          this.dashboardData = data.length > 0 ? data[0] : null;
        },
        error: (error) => {
          console.error('Error fetching dashboard counts:', error);
          this.dashboardData = null; // Reset data on error
        },
      });
      this.isLoading = false;
    } else {
      console.error('Student ID not found in SessionStorage.');
      this.dashboardData = null;
    }
  }




  //  for display training
  loadtraining(): void {
    this.trainingService.getTraining().subscribe({
      next: (data) => {
        this.trainingDatas = data.slice(0, 5);
      },
      error: (error) => {
        console.error('error fetching training data', error);
      }
    })
    this.isLoading = false;

  }

}
