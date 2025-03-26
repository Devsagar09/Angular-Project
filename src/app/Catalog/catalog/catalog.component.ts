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
    searchQuery: string = '';
  
    goToDashboard() {
      this.router.navigate(['/dashboard']);
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
  
      this.CatalogService.searchCC( this.studentId ?? 0,this.searchQuery).subscribe({
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
