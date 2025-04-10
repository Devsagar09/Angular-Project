import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
export class HomeComponent implements AfterViewInit {
  public idpIcon = "assets/icons/idp-icon.png";
  public catalogIcon = "assets/icons/catalog-icon.png";
  public transcriptIcon = "assets/icons/transcript-icon.png";

  isLoading = true;
  dropdownVisible = false;
  studentId: number | null = null;

  documentTraining = { completed: 0, assigned: 0, enrolled: 0 };
  externalTraining = { completed: 0, assigned: 0, enrolled: 0 };

  @ViewChild('docCanvas') docCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('linkCanvas') linkCanvasRef!: ElementRef<HTMLCanvasElement>;

  chartInstances: { [key: string]: any } = {};  // Store chart instances

  activeTab: string = 'inProgress'; // Default tab
  filteredTrainings: any[] = [];

  isModalOpens: boolean = false;
  selectedTraining: any = null; 

  constructor(private homeService: HomeService) { }

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

  
  ngAfterViewInit(): void { 
    setTimeout(() => {
      this.fetchTrainingData();
    }, 0);
  }

    fetchTrainingData(): void {
    if (!this.studentId) return;
    this.isLoading = true;

    this.homeService.getStudentChart(this.studentId).subscribe({
      next: (response: any[]) => {
        response.forEach((item) => {
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

        this.createPieChart("docChart", this.documentTraining, [
          "#4caf50", "#ff9800", "#2196f3"
        ]);

        this.createPieChart("linkChart", this.externalTraining, [
          "#8e44ad", "#f39c12", "#3498db"
        ]);

        this.isLoading = false;
      },
      error: (err) => {
        console.error("Failed to fetch chart data", err);
        this.isLoading = false;
      }
    });
  }

  createPieChart(canvasId: string, data: any, colors: string[]) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      console.error(`Canvas with ID '${canvasId}' not found.`);
      return;
    }

    const ctx = canvas.getContext("2d");
    if (this.chartInstances[canvasId]) {
      this.chartInstances[canvasId].destroy();
    }

    this.chartInstances[canvasId] = new Chart(ctx!, {
      type: "pie",
      data: {
        labels: ["Completed", "Assigned", "Enrolled"],
        datasets: [{
          data: [data.completed, data.assigned, data.enrolled],
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  changeTab(tab: string) {
    if (this.activeTab !== tab) {
      this.activeTab = tab;
      this.loadTrainings(); // only reload trainings, not chart
    }
  }
  
  closeModal() { 
    this.isModalOpens = false;
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

 
  // changeTab(tab: string) {
  //   if (this.activeTab !== tab) {
  //     this.activeTab = tab;
  //     this.filteredTrainings = [];
  //     this.loadTrainings();  
  //   }
  // }


 

  getThumbnailUrl(fileName: string, type: string): string {
    return this.homeService.getTrainingThumbnail(fileName, type);
  }


  //training 

  requestTrainingApprovalOrView(trainingId: number) {
      console.log("Checking Training ID:", trainingId);
      console.log("Student ID:", this.studentId);
  
      if (!trainingId || !this.studentId) {
        alert("Invalid training or student ID. Please try again.");
        return;
      }
  
      this.homeService.getTrainingByID(trainingId).subscribe({
        next: (trainingArray) => {
          console.log("Fetched Training Data:", trainingArray);
  
          if (!trainingArray || trainingArray.length === 0) {
            alert("Training details not found. Please try again.");
            return;
          }
  
          // Get the first object from the array
          const training = trainingArray[0];
  
          if (training.requires_approval) {
            this.homeService.requestTrainingApproval({
              studentId: this.studentId ?? 0,
              trainingId: trainingId,
            }).subscribe({
              next: (response: string) => {
                console.log("Approval Request Response:", response);
                alert(response);
                window.location.reload();
              },
              error: (error) => {
                console.error("Error:", error);
                alert("Failed to request training approval.");
              },
            });
          } else {
            this.viewTraining(trainingId);
          }
        },
        error: (error) => {
          console.error("Error fetching training details:", error);
          alert("Failed to fetch training details.");
        },
      });
    }
  
    //start training method
    startTraining(training: any) {
      if (!training) {
        console.error("Invalid training data.");
        return;
      }
  
      const studentId = sessionStorage.getItem('studentId');
      if (!studentId) {
        console.error("Student ID not found in sessionStorage.");
        return;
      }
  
      const request = { studentId: +studentId, trainingId: training.training_id };
  
      this.homeService.startTraining(request).subscribe({
        next: (response) => {
          console.log("Training started successfully:", response);
  
          //  Update status in UI without refreshing the page
          training.status = "In Progress"; // Manually update UI status
  
          // Open external link or document AFTER status update
          if (training.trainingtype_name === "External Link" && training.external_link_URL) {
            const confirmExternal = confirm("This training is an external link. Do you want to continue?");
            if (confirmExternal) {
              window.open(training.external_link_URL, "_blank");
              window.location.reload();
            }
          } else if (training.trainingtype_name === "Document" && training.document_file) {
            this.homeService.getTrainingDocument(training.document_file).subscribe((response: Blob) => {
              const fileURL = URL.createObjectURL(response);
              window.open(fileURL, "_blank");
              //this.router.navigate(['/documentpdfviewer'], { queryParams: { url: encodeURIComponent(fileURL) } });
              window.location.reload();
            }, error => {
              console.error('Error fetching document:', error);
            });
          
          }
        },
        error: (error) => {
          console.error("Error starting training:", error);
          alert("Failed to start training. Please try again.");
        }
      });
    }
  
    completedTraining(training: any){
      if (!training) {
        console.error("Invalid training data.");
        return;
      } 
  
      const studentId = sessionStorage.getItem('studentId');
      if (!studentId) {
        console.error("Student ID not found in sessionStorage.");
        return;
      }
  
      const request = { studentId: +studentId, trainingId: training.training_id };
  
      this.homeService.completeTraining(request).subscribe({
        next: (response) => {
          console.log("Training Completed successfully:", response);
          alert(response);  // Correctly displays the API message
          window.location.reload();
        }
      })
  
    }
  
    
    viewTraining(trainingtId: number) {
      console.log("Transcript ID:", trainingtId);
  
      this.isModalOpens = true; // Open modal immediately
  
      this.homeService.getTrainingByID(trainingtId).subscribe(data => {
        console.log("API Response:", data);
  
        if (data && data.length > 0) {
          this.selectedTraining = data[0];
        } else {
          console.error("No valid data received for Training ID:", trainingtId);
        }
      }, error => {
        console.error("API Error:", error);
      });
    }
  
  
}


