import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-catalog',
  standalone: false,
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent {
  

  constructor(private router: Router) {}
  p: number = 1; // Current page

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  trainings = [
    {
      image: 'https://academylms.net/wp-content/uploads/2022/09/Structure-of-Online-Courses.png',
      type: 'External Link',
      title: '##17ELDOCAB',
      code: 'NA',
      dueDate: '03/10/2025',
      requiredFor: 'DIRECT',
      group: 'NA',
      status: 'In Progress',
      category: 'inProgress'
    },
    {
      image: 'https://academylms.net/wp-content/uploads/2022/09/Structure-of-Online-Courses.png',
      type: 'Document',
      title: '##001Doc_T12',
      code: '##001Doc_T12',
      dueDate: '01/16/2025',
      requiredFor: 'DIRECT',
      group: 'NA',
      status: 'In Progress',
      category: 'inProgress'
    },
    {
      image: 'https://academylms.net/wp-content/uploads/2022/09/Structure-of-Online-Courses.png',
      type: 'Document',
      title: '##11febabdocone',
      code: 'NA',
      dueDate: '02/11/2025',
      requiredFor: 'DIRECT',
      group: 'NA',
      status: 'In Progress',
      category: 'inProgress'
    },
    {
      image: 'https://academylms.net/wp-content/uploads/2022/09/Structure-of-Online-Courses.png',
      type: 'External Link',
      title: '##22STARTDOC',
      code: 'NA',
      dueDate: '04/20/2025',
      requiredFor: 'DIRECT',
      group: 'NA',
      status: 'Not Started',
      category: 'notStarted'
    },
    {
      image: 'https://academylms.net/wp-content/uploads/2022/09/Structure-of-Online-Courses.png',
      type: 'Document',
      title: '##005NotStarted',
      code: '##005Doc',
      dueDate: '05/12/2025',
      requiredFor: 'DIRECT',
      group: 'NA',
      status: 'Pending Approval',
      category: 'notStarted'
    }
  ];
}
