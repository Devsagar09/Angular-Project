import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EnrollmentService } from '../enrollment.service';

@Component({
  selector: 'app-enroll',
  standalone: false,
  templateUrl: './enroll.component.html',
  styleUrl: './enroll.component.css'
})
export class EnrollComponent {

  constructor(private router: Router, private EnrollmenstService: EnrollmentService) { }

  p: number = 1; // Current page
  isLoading: boolean = true;
  studentId: number | null = null;
  EnrollmentData: any[] = [];
  searchQuery: string = '';
  isModalOpens: boolean = false;
  selectedTraining: any = null;

  goToDashboard() {
    this.router.navigate(['/']);
  }

  ngOnInit(): void {
    const storedStudentId = sessionStorage.getItem('studentId');
    if (storedStudentId) {
      this.studentId = parseInt(storedStudentId, 10);
      this.loadTrainings();
      this.fetchEnrollment();
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


  loadTrainings(): void {
    this.isLoading = true;

    if (this.studentId !== null) {
      this.EnrollmenstService.getEnrollment(this.studentId).subscribe({
        next: (data) => {
          this.EnrollmentData = data; // No filter, API handles assigned trainings
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching IDP trainings:', error);
          this.isLoading = false;
        }
      });
    }
  }


  fetchEnrollment(): void {
    if (!this.searchQuery.trim()) {
      this.isLoading = true;
      this.loadTrainings()

      setTimeout(() => {
        this.isLoading = false; // Hide loader after delay
      }, 2000);
      return;
    }
    this.isLoading = true;

    this.EnrollmenstService.searchEnrollment(this.searchQuery, this.studentId ?? 0).subscribe({
      next: (data) => {

        setTimeout(() => {
          console.log("Filtered Search Results:", data);
          this.EnrollmentData = data;
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

    this.EnrollmenstService.getTrainingByID(trainingId).subscribe({
      next: (trainingArray) => {
        console.log("Fetched Training Data:", trainingArray);

        if (!trainingArray || trainingArray.length === 0) {
          alert("Training details not found. Please try again.");
          return;
        }

        // Get the first object from the array
        const training = trainingArray[0];

        if (training.requires_approval) {
          this.EnrollmenstService.requestTrainingApproval({
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

    this.EnrollmenstService.startTraining(request).subscribe({
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
          window.open(training.document_file, "_blank");
        }
      },
      error: (error) => {
        console.error("Error starting training:", error);
        alert("Failed to start training. Please try again.");
      }
    });
  }


  viewTraining(trainingtId: number) {
    console.log("Transcript ID:", trainingtId);

    this.isModalOpens = true; // Open modal immediately

    this.EnrollmenstService.getTrainingByID(trainingtId).subscribe(data => {
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
