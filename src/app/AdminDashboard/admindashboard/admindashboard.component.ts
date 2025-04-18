import { Component, OnInit } from '@angular/core';
import { AdmindashboardService } from '../admindashboard.service';
import { TrainingService } from '../../Training/training.service';
import { AdminNavigationService } from '../../admin-navigation/admin-navigation.service';
import { dataCsvIcon } from '@progress/kendo-svg-icons';

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
  lastLogin: string = new Date().toLocaleString(); 
  profileImage: string | null = '';

  constructor(private admindashboardService: AdmindashboardService, private trainingService: TrainingService, private adminNavigationService: AdminNavigationService) { }

  ngOnInit(): void {


    setTimeout(() => {
      this.isLoading = false;
      this.loadDashboardCounts();
      this.loadtraining();
      const studentId = sessionStorage.getItem('studentId'); 
      if (studentId) {
        this.fetchProfileImage(studentId); 
      } else {
        console.error('Student ID not found in SessionStorage.');
      }
    }, 1000);

  }

  fetchProfileImage(studentId: string) {
    this.adminNavigationService.getProfileImage(studentId).subscribe({
      next: (response) => {
        // console.log('Image URL:', response.profileImage);
        this.profileImage = response.profileImage;
      },
      error: (error) => {
        console.error('Error fetching profile image:', error);
      }
    });
  }

  // for display admin dashboard increase count
  animatedData : any = {
    total_admins: 0,
    total_students: 0,
    total_trainings: 0,
    pending_approvals: 0
  };

  loadDashboardCounts(): void {
    const studentId = sessionStorage.getItem('studentId'); // Ensure studentId exists
    console.log('Student ID:', studentId);

    if (studentId) {
      this.admindashboardService.getCountAdminDashboard(studentId).subscribe({
        next: (data) => {
          console.log('Dashboard data:', data);
          // Extract first element if array
          this.dashboardData = data.length > 0 ? data[0] : null;

          if (this.dashboardData) {
            this.animateStats(); // 🟢 Animate after data is loaded
          }
        },
        error: (error) => {
          console.error('Error fetching dashboard counts:', error);
          this.dashboardData = null;
        },
      });
      this.isLoading = false;
    } else {
      console.error('Student ID not found in SessionStorage.');
      this.dashboardData = null;
    }
  }

  // for cards to display 1 to value increasing data
  animateStats(): void {
    const keys = Object.keys(this.animatedData);

    keys.forEach((key) => {
      const targetValue = this.dashboardData[key];
      let current = 1;

      const interval = setInterval(() => {
        if (current >= targetValue) {
          this.animatedData[key] = targetValue;
          clearInterval(interval);
        } else {
          this.animatedData[key] = current++;
        }
      }, 20); // Adjust speed if needed
    });
  }




  //  for display training
  loadtraining(): void {
    this.isLoading = true;

    this.trainingService.getTraining().subscribe({
      next: (data) => {
        // Sort by created_at in descending order
        const sortedData = data.sort((a: any, b: any) => {
          return new Date(b.create_date).getTime() - new Date(a.create_date).getTime();
        });

        // Simulate a small delay and then set the top 5
        setTimeout(() => {
          this.trainingDatas = sortedData.slice(0, 5);
          this.isLoading = false;
        }, 500);
      },
      error: (error) => {
        console.error('Error fetching training data', error);
        this.isLoading = false;
      }
    });

    // ❌ REMOVE this line: it hides loader too early
    // this.isLoading = false;
  }




}
