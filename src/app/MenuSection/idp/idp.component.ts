import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IdpService } from '../idp.service';

interface Training {
  student_id: number;
  training_id: number | any;
  thumbnail_image: string;
  training_name: string;
  training_code: string;
  summary: string;
  trainingtype_name: string;
  requires_approval: boolean,
  status: string;
}

@Component({
  selector: 'app-idp',
  standalone: false,
  templateUrl: './idp.component.html',
  styleUrl: './idp.component.css'
})
export class IdpComponent {

  constructor(private router: Router, private IDPService: IdpService) { }
  p: number = 1; // Current page
  trainings: Training[] = [];
  isLoading: boolean = true;
  studentId: number | null = null;
  trainingId: number | any
  searchQuery: string = '';
  isModalOpen: boolean = false;
  isModalOpens: boolean = false;
  requiresApproval: boolean = false
  selectedTraining: any = null;

  goToDashboard() {
    this.router.navigate(['/studentdashboard']);
  }

  ngOnInit(): void {
    const storedStudentId = sessionStorage.getItem('studentId');
    if (storedStudentId) {
      this.studentId = parseInt(storedStudentId, 10);
      this.loadTrainings();
      this.fetchIDP();
    } else {
      console.error("No student ID found in local storage!");
    }
  }

  debounceTimer: any;

  onSearchChange(): void {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.fetchIDP();
    }, 500); // Adjust delay as needed
  }

  loadTrainings(): void {
    this.isLoading = true;

    if (this.studentId !== null) {
      this.IDPService.getIDPTrainings(this.studentId).subscribe({
        next: (data) => {
          console.log('IDP Trainings Data:', data);
          this.trainings = data; // No filter, API handles assigned trainings
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching IDP trainings:', error);
          this.isLoading = false;
        }
      });
    }
  }

  isApprovalDialogOpen: boolean = false;

showApprovalAlert() {
  this.isApprovalDialogOpen = true;
}

closeApprovalDialog() {
  this.isApprovalDialogOpen = false;
}

 

  OpenModelBox(): void {
    this.isModalOpen = true
  }

  closeModal() {
    this.isModalOpen = false;
    this.isModalOpens = false;
  }

  // showApprovalAlert() {
  //   alert('You have already requested approval from the administrator.');
  // }


  fetchIDP(): void {
    if (!this.searchQuery.trim()) {
      this.isLoading = true;
      this.loadTrainings()

      setTimeout(() => {
        this.isLoading = false; // Hide loader after delay
      }, 2000);
      return;
    }
    this.isLoading = true;

    this.IDPService.searchIDP(this.searchQuery, this.studentId ?? 0).subscribe({
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

  requestTrainingApprovalOrView(trainingId: number) {
    console.log("Checking Training ID:", trainingId);
    console.log("Student ID:", this.studentId);

    if (!trainingId || !this.studentId) {
      alert("Invalid training or student ID. Please try again.");
      return;
    }

    this.IDPService.getTrainingByID(trainingId).subscribe({
      next: (trainingArray) => {
        console.log("Fetched Training Data:", trainingArray);

        if (!trainingArray || trainingArray.length === 0) {
          alert("Training details not found. Please try again.");
          return;
        }

        // Get the first object from the array
        const training = trainingArray[0];

        if (training.requires_approval) {
          this.IDPService.requestTrainingApproval({
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

    this.IDPService.startTraining(request).subscribe({
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
          this.IDPService.getTrainingDocument(training.document_file).subscribe((response: Blob) => {
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

  completedTraining(training: any) {
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

    this.IDPService.completeTraining(request).subscribe({
      next: (response) => {
        console.log("Training Completed successfully:", response);
        alert(response);  // Correctly displays the API message
        window.location.reload();
      }
    })

  }


  //Request again for the training 

  requestAgain(trainingId: number) {
    console.log("Checking Training ID:", trainingId);
    console.log("Student ID:", this.studentId);

    if (!trainingId || !this.studentId) {
      alert("Invalid training or student ID. Please try again.");
      return;
    }

    this.IDPService.getTrainingByID(trainingId).subscribe({
      next: (trainingArray) => {
        console.log("Fetched Training Data:", trainingArray);

        if (!trainingArray || trainingArray.length === 0) {
          alert("Training details not found. Please try again.");
          return;
        }

        // Get the first object from the array 

        this.IDPService.requestAgainForApproval({
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

      },
      error: (error) => {
        console.error("Error fetching training details:", error);
        alert("Failed to fetch training details.");
      },
    });
  }



  startTrainingOrRequestApproval(trainingId: number) {
    console.log('Received Training ID:', trainingId);
    console.log('Student ID:', this.studentId);

    if (!trainingId || !this.studentId) {
      alert('Invalid training or student ID. Please try again.');
      return;
    }

    this.IDPService.startTraining({
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

 
  viewTraining(trainingtId: number) {
    console.log("Transcript ID:", trainingtId);

    this.isModalOpens = true; // Open modal immediately

    this.IDPService.getTrainingByID(trainingtId).subscribe(data => {
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
    return this.IDPService.getTrainingThumbnail(fileName, type);
  }

}