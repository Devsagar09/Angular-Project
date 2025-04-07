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
  itemsPerPageOptions: number[] = [2,5, 10, 20, 50];
  isModalOpen = false;
  selectedTrainings: number[] = []; // Stores selected training IDs

  trainingDatas: any[] = []; // Original training data

  constructor(private router: Router, private trainingService: TrainingService) {}
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
    this.showNotification('Please select at least one training to delete.', 'warning');
    return;
  }

  this.showConfirmPopup(this.selectedTrainings.length, () => {
  // if (!confirm(`Are you sure you want to delete ${this.selectedTrainings.length} trainings?`)) {
  //   return;
  // }

  console.log('Deleting Trainings:', this.selectedTrainings); // Debugging

  this.trainingService.deleteTraining(this.selectedTrainings).subscribe({
    next: (response) => {
      this.showNotification('Training Deleted Successfully.', 'success'); // Display success message
      this.selectedTrainings = [];
      this.loadTrainingData(); // Refresh list after deletion
    },
    error: (err) => {
      console.error('Error deleting trainings:', err);
      this.showNotification('Failed to delete trainings.','error');
    }
  });
  });
}

// Delete a single training
deleteSingleTraining(trainingId: number) {
  this.showConfirmPopup(1, ()=>{
    this.trainingService.deleteTraining([trainingId]).subscribe({
      next: (response) => {
        this.showNotification('Training Deleted Successfully.', 'success');
        this.loadTrainingData();
      },
      error: (err) => {
        console.error('Error deleting training:', err);
        this.showNotification('Failed to delete training.','error');
      }
    });
  })


}

//popup for delete training
showConfirmPopup(count: number, callback: () => void) {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0, 0, 0, 0.5)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "9999";

  // Create popup container
  const popup = document.createElement("div");
  popup.style.background = "white";
  popup.style.padding = "20px";
  popup.style.borderRadius = "8px";
  popup.style.textAlign = "center";
  popup.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.3)";
  popup.style.width = "300px";

  // Add message
  const message = document.createElement("p");
  message.innerText = `Are you sure you want to delete ${count} training(s)?`;
  popup.appendChild(message);

  // Create buttons container
  const buttonContainer = document.createElement("div");
  buttonContainer.style.marginTop = "15px";
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "center";
  buttonContainer.style.gap = "10px";

  // Cancel button
  const cancelButton = document.createElement("button");
  cancelButton.innerText = "Cancel";
  cancelButton.style.background = "gray";
  cancelButton.style.color = "white";
  cancelButton.style.border = "none";
  cancelButton.style.padding = "8px 15px";
  cancelButton.style.cursor = "pointer";
  cancelButton.onclick = function () {
      document.body.removeChild(overlay);
  };

  // Delete button
  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.style.background = "red";
  deleteButton.style.color = "white";
  deleteButton.style.border = "none";
  deleteButton.style.padding = "8px 15px";
  deleteButton.style.cursor = "pointer";
  deleteButton.onclick = function () {
      document.body.removeChild(overlay);
      if (callback) {
          callback(); // Execute delete function
      }
  };

  // Append buttons to container
  buttonContainer.appendChild(cancelButton);
  buttonContainer.appendChild(deleteButton);
  popup.appendChild(buttonContainer);

  // Append popup to overlay
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

// notification
showNotification(
  message: string,
  type: 'success' | 'warning' | 'error' = 'error'
): void {
  // Ensure the container exists or create it
  let container = document.getElementById('notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '1000';
    document.body.appendChild(container);
  }

  // Remove existing notification if any
  const existingNotification = document.getElementById(
    'current-notification'
  );
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create a new notification element
  const notification = document.createElement('div');
  notification.id = 'current-notification'; // Set unique ID for the notification
  notification.style.backgroundColor =
    type === 'success'
      ? '#4caf50'
      : type === 'warning'
      ? '#ff9800'
      : '#f44336'; // Set color based on type
  notification.style.color = 'white';
  notification.style.padding = '15px 20px';
  notification.style.marginBottom = '10px';
  notification.style.borderRadius = '8px';
  notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
  notification.style.display = 'flex';
  notification.style.alignItems = 'center';
  notification.style.justifyContent = 'space-between';
  notification.style.fontSize = '14px';

  // Set message and close button
  notification.innerHTML = `
  <span>${message}</span>
  <button style="
    background: transparent;
    border: none;
    color: white;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
  ">&times;</button>
`;

  // Add close button functionality
  const closeButton = notification.querySelector(
    'button'
  ) as HTMLButtonElement;
  closeButton.onclick = () => notification.remove();

  // Append the new notification to the container
  container.appendChild(notification);

  // Automatically remove the notification after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

editTraining(id: number) {
  this.router.navigate(['/edit-training', id]); // ✅ Redirect to edit page with ID
}

}
