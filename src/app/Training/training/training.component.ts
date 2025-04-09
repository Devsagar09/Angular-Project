import { Component } from '@angular/core';
import { TrainingService } from '../training.service';
import { debounceTime, Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-training',
  standalone: false,
  templateUrl: './training.component.html',
  styleUrl: './training.component.css'
})
export class TrainingComponent {
  searchValue: string = '';
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [2, 5, 10, 20, 50];
  isModalOpen = false;
  selectedTrainings: number[] = []; // Stores selected training IDs

  trainingDatas: any[] = []; // Original training data

  constructor(private router: Router, private trainingService: TrainingService) { }
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

  // Toggle selection for a single checkboxtoggleSelection(trainingId: number, event: any) {selectedTrainings: number[] = []; // Store selected training IDs

  // Toggle selection for a single checkbox
  toggleSelection(trainingId: number, event: any) {
    if (event.target.checked) {
      if (!this.selectedTrainings.includes(trainingId)) {
        this.selectedTrainings.push(trainingId);
      }
    } else {
      this.selectedTrainings = this.selectedTrainings.filter(id => id !== trainingId);
    }
  }

  // Select/Deselect all checkboxes
  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.selectedTrainings = this.trainingDatas.map(training => training.training_id);
    } else {
      this.selectedTrainings = [];
    }
  }

  // Delete selected trainings (bulk delete)
  deleteSelectedTrainings() {
    if (this.selectedTrainings.length === 0) {
      this.trainingService.showNotification('Please select at least one training to delete.', 'warning');
      return;
    }

    this.trainingService.showConfirmPopup(this.selectedTrainings.length, () => {
      // if (!confirm(`Are you sure you want to delete ${this.selectedTrainings.length} trainings?`)) {
      //   return;
      // }

      console.log('Deleting Trainings:', this.selectedTrainings); // Debugging

      this.trainingService.deleteTraining(this.selectedTrainings).subscribe({
        next: (response) => {
          this.trainingService.showNotification('Training Deleted Successfully.', 'success'); // Display success message
          this.selectedTrainings = [];
          this.loadTrainingData(); // Refresh list after deletion
        },
        error: (err) => {
          console.error('Error deleting trainings:', err);
          this.trainingService.showNotification('Failed to delete trainings.', 'error');
        }
      });
    });
  }

  // Delete a single training
  deleteSingleTraining(trainingId: number) {
    this.trainingService.showConfirmPopup(1, () => {
      this.trainingService.deleteTraining([trainingId]).subscribe({
        next: (response) => {
          this.trainingService.showNotification('Training Deleted Successfully.', 'success');
          this.loadTrainingData();
        },
        error: (err) => {
          console.error('Error deleting training:', err);
          this.trainingService.showNotification('Failed to delete training.', 'error');
        }
      });
    })


  }


  editTraining(id: number) {
    this.router.navigate(['/edit-training', id]); // ✅ Redirect to edit page with ID
  }

  showModal: boolean = false;
  selectedTraining: any = null;

  openDetailsModal(trainingId: number): void {
    this.trainingService.getTrainingByIds(trainingId).subscribe({
      next: (data) => {
        console.log("Training details response:", data);

        // Build full URL for document file (if exists)
        if (data.documentFile) {
          data.documentFile = `https://localhost:7172/uploads/${data.documentFile}`;
        } else {
          data.documentFile = null;
        }

        // Build full URL for thumbnail image (if exists)
        if (data.thumbnailImage) {
          data.thumbnailImage = `https://localhost:7172/uploads/${data.thumbnailImage}`;
        } else {
          data.thumbnailImage = null;
        }

        // Set data to show in modal
        this.selectedTraining = data;
        this.showModal = true;
      },
      error: (err) => {
        console.error('Failed to fetch training details:', err);
        this.trainingService.showNotification('Unable to load training details', 'error');
      }
    });
  }

  getFileName(filePath: string): string {
    return filePath ? filePath.split('/').pop() || 'file' : 'file';
  }

  closedetailModal(): void {
    this.showModal = false;
  }

}

