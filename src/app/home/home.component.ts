import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';
import { HomeService } from './home.service';
import { ChartData } from './chart-data';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public idpIcon = "assets/icons/idp-icon.png";
  public catalogIcon = "assets/icons/catalog-icon.png";
  public transcriptIcon = "assets/icons/transcript-icon.png";

  isLoading = true;
  dropdownVisible = false;
  studentId: number | null = null;

  documentTraining = { completed: 0, assigned: 0, enrolled: 0 };
  externalTraining = { completed: 0, assigned: 0, enrolled: 0 };

  chartInstances: { [key: string]: any } = {};  // Store chart instances

  activeTab: string = 'inProgress'; // Default tab
  filteredTrainings: any[] = [];

  constructor(private http: HttpClient, private homeService: HomeService) { }

  ngOnInit() {
    const storedStudentId = sessionStorage.getItem('studentId');
    if (storedStudentId) {
      this.studentId = parseInt(storedStudentId, 10);
      console.log("Student ID:", this.studentId);
      this.loadTrainings();
      this.fetchTrainingData();
    } else {
      console.error("No student ID found in local storage!");
    }
  }

  fetchTrainingData(): void {
    if (this.studentId !== null) {
      this.isLoading = true;

      this.homeService.getStudentChart(this.studentId).subscribe({
        next: (response: ChartData[]) => {  //  
          response.forEach((item: ChartData) => {   
            if (item.trainingtype_name === "Document") {
              this.documentTraining = {
                completed: item.completedTrainingCount || 0,
                assigned: item.assignedTrainingCount || 0,
                enrolled: item.enrollTrainingCount || 0
              };
            } else if (item.trainingtype_name === "External Link") {
              this.externalTraining = {
                completed: item.completedTrainingCount || 0,
                assigned: item.assignedTrainingCount || 0,
                enrolled: item.enrollTrainingCount || 0
              };
            }
          });

          this.createBarChart("docChart", this.documentTraining.completed, this.documentTraining.assigned, this.documentTraining.enrolled, "#4caf50");
          this.createBarChart("linkChart", this.externalTraining.completed, this.externalTraining.assigned, this.externalTraining.enrolled, "#2196f3");

          this.isLoading = false;
        },
        error: (error) => {
          console.error("Error fetching training data:", error);
          this.isLoading = false;
        }
      });
    } else {
      console.error("No student ID found.");
    }
  }

 
  loadTrainings(): void {
    this.isLoading = true;
    if (this.studentId !== null) {
      if (this.activeTab === 'inProgress') {
        this.homeService.getInProgressTrainings(this.studentId).subscribe({
          next: (data) => {
            console.log('In Progress Trainings Data:', data);
            this.filteredTrainings = data;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error fetching in-progress trainings:', error);
            this.isLoading = false;
          }
        });
      } else if (this.activeTab === 'notStarted') {
        this.homeService.getNotStartedTrainings(this.studentId).subscribe({
          next: (data) => {
            console.log('Not Started Trainings Data:', data);
            this.filteredTrainings = data;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error fetching not-started trainings:', error);
            this.isLoading = false;
          }
        });
      }
    }
  }

 
  changeTab(tab: string) {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.filteredTrainings = [];
      this.loadTrainings();
      this.fetchTrainingData();  //  Reload chart data when tab changes
    }
  }


  createBarChart(canvasId: string, completed: number, assigned: number, enrolled: number, color: string) {
    if (this.chartInstances[canvasId]) {
      this.chartInstances[canvasId].destroy();  // Destroy previous chart before creating a new one
    }

    const ctx = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!ctx) {
      console.error(`Canvas with ID '${canvasId}' not found.`);
      return;
    }

    this.chartInstances[canvasId] = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Completed", "Assigned", "Enrolled"],
        datasets: [{
          label: "Training Stats",
          data: [completed, assigned, enrolled],
          backgroundColor: [color, "#ff9800", "#2196f3"],
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 2, precision: 0 }
          }
        }
      }
    });
  }
}


