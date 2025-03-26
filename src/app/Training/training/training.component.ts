import { Component } from '@angular/core';
import { TrainingService } from '../training.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-training',
  standalone: false,
  templateUrl: './training.component.html',
  styleUrl: './training.component.css'
})
export class TrainingComponent {
  searchValue: string = '';
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [2,5, 10, 20, 50];
  isModalOpen = false;

  trainingDatas: any[] = []; // Original training data

  constructor(private trainingService: TrainingService) {}
  p: number = 1; // Current page

  ngOnInit(): void {
    this.loadTrainingData();
    // setTimeout(()=>{
    //   // this.isLoading=false;
    // }, 2000);
  }

  // Load training data from the service
  loadTrainingData(): void {
    this.trainingService.getTraining().subscribe({
      next: (data) => {
        this.trainingDatas = data;
        // this.updatePagination();
      },
      error: (error) => {
        console.error('Error fetching training data:', error);
      }
    });
    // this.isLoading=false;
  }

  openModal() {
    console.log('Opening modal');
    this.isModalOpen = true;
  }

  closeModal(): void {
    console.log('Parent closeModal() method called!'); // Debug log
    this.isModalOpen = false;
    // console.log('isModalOpen:', this.isModalOpen); // Debug log to ensure it updates
  }

  // Search training data
  searchTraining(): void {
    if (!this.searchValue.trim()) {
      this.loadTrainingData(); // Reload all training data if the search is empty
      return;
    }
    this.trainingService.searchTraining(this.searchValue).subscribe({
      next: (data) => {
        this.trainingDatas = data ?? [];
      },
      error: (error) => {
        console.error('Error searching training data', error);
        this.trainingDatas = [];
      },
    });
  }

}
