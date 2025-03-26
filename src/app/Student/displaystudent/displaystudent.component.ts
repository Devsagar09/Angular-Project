import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-displaystudent',
  standalone: false,
  templateUrl: './displaystudent.component.html',
  styleUrl: './displaystudent.component.css',
})
export class DisplaystudentComponent implements OnInit{
studentDatas: any[]=[];

  constructor(private studentService: StudentService){}
  p: number = 1;


  ngOnInit(): void {
    this.loadStudent();
  }

  loadStudent(): void {
    this.studentService.getStudent().subscribe({
      next: (data) => {
        this.studentDatas = data ?? [];  // Ensures it's always an array
      },
      error: (error) => {
        console.error('Error fetching student data', error);
      },
    });
  }

}
