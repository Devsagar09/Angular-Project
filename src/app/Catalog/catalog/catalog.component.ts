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
  
  constructor(private router: Router,private CatalogService: CatalogService) {}
    p: number = 1; // Current page
    trainings: Training[] = [];
    isLoading: boolean = true;
    studentId: number | null = null;
  
    goToDashboard() {
      this.router.navigate(['/dashboard']);
    }
  
    ngOnInit(): void {
      const storedStudentId = sessionStorage.getItem('studentId');
      if (storedStudentId) {
        this.studentId = parseInt(storedStudentId, 10);
        this.loadTrainings();
      } else {
        console.error("No student ID found in local storage!");
      }
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
     
}
