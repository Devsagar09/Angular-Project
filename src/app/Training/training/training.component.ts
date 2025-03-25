import { Component } from '@angular/core';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-training',
  standalone: false,
  templateUrl: './training.component.html',
  styleUrl: './training.component.css'
})
export class TrainingComponent {
  // paginatedTrainingDatas: any[] = []; // Data for the current page
  // itemsPerPage: number = 5; // Default items per page
  // currentPage: number = 1; // Current page
  // totalPages: number = 0; // Total pages
  // pageSizes: number[] = [5, 10, 20]; // Options for items per page
  // isLoading = true;
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

  // // Update pagination details
  // updatePagination(): void {
  //   this.totalPages = Math.ceil(this.trainingDatas.length / this.itemsPerPage);
  //   this.updatePaginatedData();
  // }

  // // Get the current page's data
  // updatePaginatedData(): void {
  //   const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  //   const endIndex = startIndex + this.itemsPerPage;
  //   this.paginatedTrainingDatas = this.trainingDatas.slice(startIndex, endIndex);
  // }

  // // Handle items per page change
  // onItemsPerPageChange(): void {
  //   this.currentPage = 1; // Reset to the first page
  //   this.updatePagination();
  // }

  // // Navigate to the previous page
  // goToPreviousPage(): void {
  //   if (this.currentPage > 1) {
  //     this.currentPage--;
  //     this.updatePaginatedData();
  //   }
  // }

  // // Navigate to the next page
  // goToNextPage(): void {
  //   if (this.currentPage < this.totalPages) {
  //     this.currentPage++;
  //     this.updatePaginatedData();
  //   }
  // }
}
