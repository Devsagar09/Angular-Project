import { Component, OnInit } from '@angular/core';
import { AdmindashboardService } from '../admindashboard.service';
import { TrainingService } from '../../Training/training.service';

@Component({
  selector: 'app-admindashboard',
  standalone: false,
  templateUrl: './admindashboard.component.html',
  styleUrl: './admindashboard.component.css'
})
export class AdmindashboardComponent implements OnInit {
  trainingDatas: any;
  dashboardData: any;
  lastLogin: string = new Date().toLocaleString(); // Example last login time


  constructor(private admindashboardService: AdmindashboardService, private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.loadDashboardCounts();
    this.loadtraining();
  }

  // for display admin dashboard count
  loadDashboardCounts(): void {
    this.admindashboardService.getCountAdminDashboard().subscribe({
      next: (response) => {
        this.dashboardData = response
      },
      error: (error) => {
        console.error('Error fetching dashboard counts:', error);
      }
    });
  }

//  for display training
  loadtraining():void{
    this.trainingService.getTraining().subscribe({
      next: (data) =>{
        this.trainingDatas = data.slice(0,5)
      },
      error: (error)=>{
        console.error('error fetching training data', error);
      }
    })
  }

}
