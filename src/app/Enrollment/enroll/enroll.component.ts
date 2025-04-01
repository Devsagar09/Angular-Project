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

  constructor(private router: Router,private EnrollmenstService:EnrollmentService) {}

  p: number = 1; // Current page
  isLoading: boolean = true;
  studentId: number | null = null;
  EnrollmentData: any[] = [];
  searchQuery: string = '';

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

 
}
