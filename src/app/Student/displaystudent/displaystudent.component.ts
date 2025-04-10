import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
selectedStudent: any = null;
selectedStudentIds: number[] = []; // Array to store selected student IDs
  showPopup: boolean = false;
  deleteMessage: string = '';


  constructor(private studentService: StudentService,private router :Router,private snackBar :MatSnackBar){}


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

  editStudent(studentId: number) {
    
    console.log('Fetching Student ID:', studentId);
    
    this.studentService.getStudentById(studentId).subscribe({
      next: (studentData) => {
        this.selectedStudent = studentData; // Store fetched student data
        console.log('Selected Student Data:', this.selectedStudent);
        this.router.navigate(['/editStudent', studentId]);

      },
      error: (error) => {
        console.error('Error fetching student details', error);
      },
    });
  }

  confirmDelete(studentId?: number) {
    if (studentId) {
      // Single student delete
      this.selectedStudentIds = [studentId];
      this.deleteMessage = 'Are you sure you want to delete this student?';
    } else {
      // Multiple students delete
      this.selectedStudentIds = this.students.filter((student) => student.selected).map((student) => student.student_Id);
      if (this.selectedStudentIds.length === 0) {
        this.showErrorSnackbar('Please select at least one student to delete.');
        return;
      }
      this.deleteMessage = `Are you sure you want to delete ${this.selectedStudentIds.length} students?`;
    }
    this.showPopup = true;
  }

  deleteStudents() {
    if (this.selectedStudentIds.length === 0) 
      {
        this.showErrorSnackbar("First select any student");
      };

    this.studentService.deleteStudents(this.selectedStudentIds).subscribe(
      () => {
        this.students = this.students.filter(
          (student) => !this.selectedStudentIds.includes(student.student_Id)
        );
        this.showSuccessSnackbar('Students deleted successfully!');
        this.closePopup();
      },
      (error) => {
        console.error('Error deleting students', error);
        this.showErrorSnackbar('An error occurred while deleting students.');
      }
    );
  }

  closePopup() {
    this.showPopup = false;
    this.selectedStudentIds = [];
  }


toggleStudentSelection(student: any) {
  if (student.selected) {
    this.selectedStudentIds.push(student.student_Id);
  } else {
    this.selectedStudentIds = this.selectedStudentIds.filter(id => id !== student.student_Id);
  }
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

  showSuccessSnackbar(message: string) {
    this.snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['app-notification-success'],
    });
  }

  // Show error snackbar
  showErrorSnackbar(message: string) {
    this.snackBar.open(message, 'X', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['app-notification-error'],
    });
  }

}



