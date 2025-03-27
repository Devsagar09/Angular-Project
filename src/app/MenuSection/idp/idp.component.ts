import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IdpService } from '../idp.service';

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
  searchQuery: string = '';
  isModalOpen: boolean = false;

  goToDashboard() {
    this.router.navigate(['/']);
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


  OpenModelBox():void{
    this.isModalOpen = true
  }

  closeModal() {
    this.isModalOpen = false;
  }


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


}