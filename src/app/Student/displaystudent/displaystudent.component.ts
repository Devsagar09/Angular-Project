import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-displaystudent',
  standalone: true,
  templateUrl: './displaystudent.component.html',
  styleUrl: './displaystudent.component.css',

export class DisplaystudentComponent implements OnInit{
studentDatas: any[]=[];
searchValue:string='';

  constructor(private studentService: StudentService){}
  p: number = 1;

  itemsPerPage: number = 10;
    itemsPerPageOptions: number[] = [2,5, 10, 20, 50];
 
 
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


  searchStudent():void {
    if(!this.searchValue.trim()){
      this.loadStudent();
      return;
    }
  this.studentService.searchStudent(this.searchValue).subscribe({
    next:(data)=>{
      this.studentDatas=data ?? [];

    },
    error:(error)=>{
      console.error('Error searching student data', error);
    },
  });
}
}