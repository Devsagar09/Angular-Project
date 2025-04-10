import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faLink, faRectangleList, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { TranscriptService } from '../transcript.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-transcript',
  standalone: false,
  templateUrl: './transcript.component.html',
  styleUrl: './transcript.component.css'
})
export class TranscriptComponent {

  constructor(private router: Router, private TranscriptService: TranscriptService) { }
  p: number = 1; // Current page
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [2, 5, 10, 20, 50];
  faLink = faLink;
  faList = faRectangleList;
  faellipsis = faEllipsis;
  studentId: number | null = null;
  transcriptData: any[] = [];
  isLoading: boolean = true;
  searchQuery: string = '';
  selectedTranscript: any = null;
  isModalOpen: boolean = false;

  private debounceTimer: any;
  searchSubject: Subject<string> = new Subject();

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

  onSearchChange(query: string) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.fetchTranscriptP();
    }, 500); // Adjust delay as needed
  }

  goToDashboard() {
    this.router.navigate(['/studentdashboard']);
  }

  loadTrainings(): void {

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
      }, 200);
      return;
    }
    this.isLoading = true;

    this.TranscriptService.searchTranscript(this.searchQuery, this.studentId ?? 0).subscribe({
      next: (data) => {
 
          console.log("Filtered Search Results:", data);
          this.transcriptData = data;
          this.isLoading = false; // Hide skeleton loader after delay
      

      },
      error: (error) => {
        console.error('Error fetching search results:', error);
        this.isLoading = false;
      }
    });
  }

  viewTranscript(transcriptId: number) {
    console.log("Transcript ID:", transcriptId);
  
    this.isModalOpen = true;   
   
    this.selectedTranscript = this.transcriptData.find(t => t.transcriptId === transcriptId);
  
    if (!this.selectedTranscript) {
      console.warn("Transcript not found in search results, fetching from API...");
      this.TranscriptService.getTranscriptByID(transcriptId).subscribe(data => {
        console.log("API Response:", data);
  
        if (data && data.length > 0) {
          this.selectedTranscript = data[0];
          
        } else {
          console.error("No valid data received for transcript ID:", transcriptId);
     
        }
      }, error => {
        console.error("API Error:", error);
  
      });
    }
  }

  openExternalLink(link: string | null): void {
    if (link) {
      window.open(link, '_blank'); // Opens in new tab
      window.location.reload();
    } else {
      console.error("No link provided");
    }
  }


  // openModal(content: any, transcriptId: number) {
  //   this.TranscriptService.getTranscriptByID(transcriptId).subscribe(
  //     (data) => {
  //       this.selectedTranscript = data;
  //       this.modalService.open(content, { size: 'lg', centered: true });
  //     },
  //     (error) => {
  //       console.error('Error fetching transcript:', error);
  //     }
  //   );
  // }

  closeModal() {
    this.isModalOpen = false;
  }

  hoverIndex: any = null;


}
