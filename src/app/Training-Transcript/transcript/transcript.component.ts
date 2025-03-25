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

    ngOnInit(): void {
      const storedStudentId = localStorage.getItem('studentId');
      if (storedStudentId) {
        this.studentId = parseInt(storedStudentId, 10);
        this.loadTrainings();
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

    hoverIndex: any = null;
   
  
}
