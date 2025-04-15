import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogService } from '../catalog.service';

interface Training {
  student_id: number;
  training_id: number;
  thumbnail_image: string;
  training_name: string;
  training_code: string;
  summary: string;
  trainingtype_name: string;
  status: string;
}

@Component({
  selector: 'app-catalog',
  standalone: false,
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {

  constructor(private router: Router, private CatalogService: CatalogService) { }
  p: number = 1; // Current page
  trainings: Training[] = [];
  isLoading: boolean = true;
  studentId: number | null = null;
  searchQuery: string = '';
  isModalOpens: boolean = false;

  selectedTraining: any = null; 
  isCompleteLoading = false; 


  goToDashboard() {
    this.router.navigate(['/studentdashboard']);
  }

  ngOnInit(): void {
    const storedStudentId = sessionStorage.getItem('studentId');
    this.isLoading = true;
    if (storedStudentId) {
      this.studentId = parseInt(storedStudentId, 10);
      this.loadTrainings();
      this.fetchCatalog();
      this.isLoading = false;
    } else {
      console.error("No student ID found in local storage!");
    }
  }


  OpenModelBox(): void {
    this.isModalOpens = true
  }

  closeModal() {
    this.isModalOpens = false;
  }

  isApprovalDialogOpen: boolean = false;

  closeApprovalDialog() {
    this.isApprovalDialogOpen = false;
  }


  loadTrainings(): void {
    if (this.studentId !== null) {
      this.CatalogService.getCCTrainings(this.studentId).subscribe({
        next: (data) => {
          console.log('IDP Trainings Data:', data);
          this.trainings = data;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching IDP trainings:', error);
          this.isLoading = false;
        }
      });
    }
  }

  showApprovalAlert() {
    this.isApprovalDialogOpen = true;
  }

  debounceTimer: any;

  onSearchChange(): void {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.fetchCatalog();
    }, 500); // Adjust delay as needed
  }


  fetchCatalog(): void {
    if (!this.searchQuery.trim()) {
      this.isLoading = true;
      this.loadTrainings()

      setTimeout(() => {
        this.isLoading = false; // Hide loader after delay
      }, 2000);
      return;
    }
    this.isLoading = true;

    this.CatalogService.searchCC(this.studentId ?? 0, this.searchQuery).subscribe({
      next: (data) => {
        setTimeout(() => {
          console.log("Filtered Search Results:", data);
          this.trainings = data;
          this.isLoading = false; // Hide skeleton loader after delay
        }, 2000);

      },
      error: (error) => {
        console.error('Error fetching search results:', error);
        this.isLoading = false;
      }
    });
  }

  //start training
  requestTrainingApprovalOrView(trainingId: number) {
    console.log("Checking Training ID:", trainingId);
    console.log("Student ID:", this.studentId);

    if (!trainingId || !this.studentId) {
      alert("Invalid training or student ID. Please try again.");
      return;
    }

    this.CatalogService.getTrainingByID(trainingId,this.studentId).subscribe({
      next: (trainingArray) => {
        console.log("Fetched Training Data:", trainingArray);

        if (!trainingArray || trainingArray.length === 0) {
          alert("Training details not found. Please try again.");
          return;
        }

        // Get the first object from the array
        const training = trainingArray[0];

        if (training.requires_approval) {
          this.CatalogService.requestTrainingApproval({
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

    this.CatalogService.startTraining(request).subscribe({
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
          this.CatalogService.getTrainingDocument(training.document_file).subscribe((response: Blob) => {
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

  // started completed trainng
  startCompletedTraining(training: any) {
    if (!training) {
      console.error("Invalid training data.");
      return;
    }

    if (training.trainingtype_name === "External Link" && training.external_link_URL) {
      const confirmExternal = confirm("This training is an external link. Do you want to continue?");
      if (confirmExternal) {
        window.open(training.external_link_URL, "_blank");
      }
    }
    else if (training.trainingtype_name === "Document" && training.document_file) {
      this.CatalogService.getTrainingDocument(training.document_file).subscribe((response: Blob) => {
        const fileURL = URL.createObjectURL(response);
        window.open(fileURL, "_blank");
      }, error => {
        console.error('Error fetching document:', error);
      });
    }
    else {
      alert("No valid training content found.");
    }
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
    this.isCompleteLoading = true;

    this.CatalogService.completeTraining(request).subscribe({
      next: (response) => {
        console.log("Training Completed successfully:", response);
        alert(response);  // Correctly displays the API message
        this.isCompleteLoading = false;
        window.location.reload();
      }
    })

  }


  viewTraining(trainingtId: number) {
    console.log("Transcript ID:", trainingtId);

    this.isModalOpens = true; // Open modal immediately

    this.CatalogService.getTrainingByID(trainingtId,this.studentId ?? 0).subscribe(data => {
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

  getThumbnailUrl(fileName: string, type: string): string {
    return this.CatalogService.getTrainingThumbnail(fileName, type);
  }




  startTrainingOrRequestApproval(trainingId: number) {
    console.log('Received Training ID:', trainingId);
    console.log('Student ID:', this.studentId);

    if (!trainingId || !this.studentId) {
      alert('Invalid training or student ID. Please try again.');
      return;
    }

    this.CatalogService.startTraining({
      studentId: this.studentId,
      trainingId: trainingId
    }).subscribe({
      next: (response: string) => {
        console.log('API Response:', response);
        alert(response);  // Correctly displays the API message
        window.location.reload();
      },
      error: (error) => {
        console.error('Error:', error);
        alert('Failed to process training request.');
      }
    });
  }



}
