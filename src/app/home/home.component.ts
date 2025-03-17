import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';

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

  
  apiUrl = 'https://localhost:7172/api/CountStudentDashboard/getCountStudentDashboard/4';

  documentTraining = { completed: 0, assigned: 0, enrolled: 0 };
  externalTraining = { completed: 0, assigned: 0, enrolled: 0 };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchTrainingData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createBarChart("docChart", this.documentTraining.completed, this.documentTraining.assigned, this.documentTraining.enrolled, "#4caf50");
      this.createBarChart("linkChart", this.externalTraining.completed, this.externalTraining.assigned, this.externalTraining.enrolled, "#2196f3");
    }, 1000); // Ensure chart loads after API fetch
  }

  fetchTrainingData() {
    this.http.get<any[]>(this.apiUrl).subscribe(response => {
      response.forEach(item => {
        if (item.trainingtype_name === "Document") {
          this.documentTraining.completed = item.completedTrainingCount;
          this.documentTraining.assigned = item.assignedTrainingCount;
          this.documentTraining.enrolled = item.enrollTrainingCount;
        } else if (item.trainingtype_name === "External Link") {
          this.externalTraining.completed = item.completedTrainingCount;
          this.externalTraining.assigned = item.assignedTrainingCount;
          this.externalTraining.enrolled = item.enrollTrainingCount;
        }
      });

      // Update charts after fetching data
      this.createBarChart("docChart", this.documentTraining.completed, this.documentTraining.assigned, this.documentTraining.enrolled, "#4caf50");
      this.createBarChart("linkChart", this.externalTraining.completed, this.externalTraining.assigned, this.externalTraining.enrolled, "#2196f3");
    });
  }

  createBarChart(canvasId: string, completed: number, assigned: number, enrolled: number, color: string) {
    new Chart(canvasId, {
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
            ticks: { stepSize: 2, precision: 0 } // Force whole numbers (0,1,2...)
          }
        }
      }
    });
  }

 
}



