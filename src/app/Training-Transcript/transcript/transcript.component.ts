import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { faLink,faRectangleList,faEllipsis } from '@fortawesome/free-solid-svg-icons';
// <i class="fa-solid fa-rectangle-list"></i>

@Component({
  selector: 'app-transcript',
  standalone: false,
  templateUrl: './transcript.component.html',
  styleUrl: './transcript.component.css'
})
export class TranscriptComponent {
  
    constructor(private router: Router) {}
    p: number = 1; // Current page
    faLink = faLink;
    faList = faRectangleList;
    faellipsis = faEllipsis;
 
  
    goToDashboard() {
      this.router.navigate(['/dashboard']);
    }

    hoverIndex: any = null;
    transcriptdata = [
      {
        "training_name": "DB",
        "training_hours": 10,
        "training_code": "NET11",
        "trainingtype_name": "External Link",
        "status_name": "In Progress",
        "enroll_date": "2025-03-03",
        "completion_date": null
      },
      {
        "training_name": "Homework",
        "training_hours": 10,
        "training_code": "NET11",
        "trainingtype_name": "External Link",
        "status_name": "Completed",
        "enroll_date": "2025-03-03",
        "completion_date": "2025-03-10"
      },
      {
        "training_name": "Homework",
        "training_hours": 10,
        "training_code": "NET11",
        "trainingtype_name": "External Link",
        "status_name": "Completed",
        "enroll_date": "2025-03-03",
        "completion_date": "2025-03-10"
      },
      {
        "training_name": "CSS",
        "training_hours": 10,
        "training_code": "CSS12",
        "trainingtype_name": "Document",
        "status_name": "Completed",
        "enroll_date": "2025-03-03",
        "completion_date": "2025-03-03"
      }
    ];
  
}
