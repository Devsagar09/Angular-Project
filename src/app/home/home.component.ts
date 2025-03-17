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
  isLoading = true; // Initially true

  
  apiUrl = 'https://localhost:7172/api/CountStudentDashboard/getCountStudentDashboard/4';

  documentTraining = { completed: 0, assigned: 0, enrolled: 0 };
  externalTraining = { completed: 0, assigned: 0, enrolled: 0 };

  constructor(private http: HttpClient) {
    this.updateFilteredTrainings();
  }

  ngOnInit() { 
    setTimeout(() => {
      this.isLoading = false;  
      this.fetchTrainingData();  
  }, 4000);
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

        // Hide loader after data fetch
        this.isLoading = false;

        // Update charts
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

  activeTab: string = 'inProgress'; // Default tab
  filteredTrainings: any[] = [];
 
  //Tab menus design 
  trainings = [
    {
      image: 'favicon.ico',
      type: 'External Link',
      title: '##17ELDOCAB',
      code: 'NA',
      dueDate: '03/10/2025',
      requiredFor: 'DIRECT',
      group: 'NA',
      status: 'In Progress',
      category: 'inProgress'
    },
    {
      image: 'favicon.ico',
      type: 'Document',
      title: '##001Doc_T12',
      code: '##001Doc_T12',
      dueDate: '01/16/2025',
      requiredFor: 'DIRECT',
      group: 'NA',
      status: 'In Progress',
      category: 'inProgress'
    },
    {
      image: 'favicon.ico',
      type: 'Document',
      title: '##11febabdocone',
      code: 'NA',
      dueDate: '02/11/2025',
      requiredFor: 'DIRECT',
      group: 'NA',
      status: 'In Progress',
      category: 'inProgress'
    },
    {
      image: 'favicon.ico',
      type: 'External Link',
      title: '##22STARTDOC',
      code: 'NA',
      dueDate: '04/20/2025',
      requiredFor: 'DIRECT',
      group: 'NA',
      status: 'Not Started',
      category: 'notStarted'
    },
    {
      image: 'favicon.ico',
      type: 'Document',
      title: '##005NotStarted',
      code: '##005Doc',
      dueDate: '05/12/2025',
      requiredFor: 'DIRECT',
      group: 'NA',
      status: 'Not Started',
      category: 'notStarted'
    }
  ];
 
  
  changeTab(tab: string) {
    this.activeTab = tab;
    this.updateFilteredTrainings();
  }

  updateFilteredTrainings() {
    this.filteredTrainings = this.trainings.filter(training => training.category === this.activeTab);
  }
}



