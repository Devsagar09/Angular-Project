import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';

@Component({
  selector: 'app-displaystudent',
  standalone: false,
  templateUrl: './displaystudent.component.html',
  styleUrl: './displaystudent.component.css',
})
export class DisplaystudentComponent implements OnInit{
students: any[]=[];
p: number = 1; 
itemsPerPage: number = 10;
itemsPerPageOptions: number[] = [2,5, 10, 20, 50];
searchValue: string = '';
sortColumn: string = '';
sortDirection: 'asc' | 'desc' = 'asc';
 


  constructor(private studentService: StudentService){}
 

  ngOnInit(): void {
    this.loadStudent(); 
  }

  loadStudent(): void {  
    this.studentService.getStudent().subscribe({
      next: (data) => {
        this.students = data ?? [];  // Ensures it's always an array
      },
      error: (error) => {
        console.error('Error fetching student data', error);
      },
    });
  }
  
  searchStudent(): void {
    if (!this.searchValue.trim()) {
      this.loadStudent(); // Reload all students if search is empty
      return;
    }
    this.studentService.searchStudent(this.searchValue).subscribe({
      next: (data:any[]) => {
        this.students = data ?? [];
      },
      error: (error) => {
        console.error('Error searching student data', error);
      },
    });
  }

   sortData(column: string = this.sortColumn): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.students.sort((a, b) => {
      const valueA = a[column] ? a[column].toString().toLowerCase() : '';
      const valueB = b[column] ? b[column].toString().toLowerCase() : '';

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
}

}

