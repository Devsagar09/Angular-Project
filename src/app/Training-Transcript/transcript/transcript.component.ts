import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faLink,faRectangleList,faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { TranscriptService } from '../transcript.service';
 
@Component({
  selector: 'app-transcript',
  standalone: false,
  templateUrl: './transcript.component.html',
  styleUrl: './transcript.component.css'
})
export class TranscriptComponent {
  
    constructor(private router: Router, private TranscriptService:TranscriptService) {}
    p: number = 1; // Current page
    itemsPerPage: number = 10;
    itemsPerPageOptions: number[] = [2,5, 10, 20, 50];
    faLink = faLink;
    faList = faRectangleList;
    faellipsis = faEllipsis;
    studentId: number | null = null;
    transcriptData: any[] = [];
    isLoading: boolean = true;
    searchQuery: string = '';

    ngOnInit(): void {
      const storedStudentId = sessionStorage.getItem('studentId');
      if (storedStudentId) {
        this.studentId = parseInt(storedStudentId, 10);
        this.loadTrainings();
        this.fetchTranscriptP();
      } else {
        console.error("No student ID found");
      }
    }
    
  
    goToDashboard() {
      this.router.navigate(['/dashboard']);
    }

    loadTrainings():void{
      this.TranscriptService.getTranscript(this.studentId ?? 0).subscribe({
        next: (data) => {
          console.log('Transcript Data:', data);
          this.transcriptData = data;
        },
        error: (error) => {
          console.error('Error fetching transcript data:', error);
        }
      });
    }

    fetchTranscriptP(): void {
      if (!this.searchQuery.trim()) {
        this.isLoading = true; 
        this.loadTrainings()
  
        setTimeout(() => {
          this.isLoading = false; // Hide loader after delay
        }, 2000);
        return;
      }
      this.isLoading = true; 
  
      this.TranscriptService.searchTranscript(this.searchQuery, this.studentId ?? 0).subscribe({
        next: (data) => {
   
          setTimeout(() => {
            console.log("Filtered Search Results:", data);
            this.transcriptData = data;
            this.isLoading = false; // Hide skeleton loader after delay
          }, 2000);
  
        },
        error: (error) => {
          console.error('Error fetching search results:', error);
          this.isLoading = false;
        }
      });
    }

    hoverIndex: any = null;
   
  
}
