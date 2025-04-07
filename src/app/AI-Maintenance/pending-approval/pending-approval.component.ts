import { Component } from '@angular/core';
import { PendingApprovalService } from '../pending-approval.service';

@Component({
  selector: 'app-pending-approval',
  standalone: false,
  templateUrl: './pending-approval.component.html',
  styleUrls: ['./pending-approval.component.css']
})
export class PendingApprovalComponent {
  searchValue: string = '';
  itemsPerPage: number = 10;
  p: number = 1; // Current page
  itemsPerPageOptions: number[] = [2, 5, 10, 20, 50];
  isLoading = false;
  pendingapprovalDatas: any[] = []; // Training data
  selectedTrainings: { student_id: number, training_id: number }[] = [];
  errorMessage: string = ''; // Error messages
  allSelected: boolean = false;

  constructor(private pendingapprovalServices: PendingApprovalService) {}

  ngOnInit(): void {
    this.loadPendingApprovalData();
  }

  // Load pending training approvals
  loadPendingApprovalData(): void {
    this.pendingapprovalServices.DisplayPendingApproval().subscribe({
      next: (data) => {
        this.pendingapprovalDatas = data;
      },
      error: (error) => {
        console.error('Error fetching training data:', error);
      }
    });
  }

    // Search training data
    searchPendingApproval(): void {
      if (!this.searchValue.trim()) {
        this.loadPendingApprovalData(); // Reload all training data if the search is empty
        return;
      }
      this.pendingapprovalServices.searchPendingApproval(this.searchValue).subscribe({
        next: (data) => {
          this.pendingapprovalDatas = data ?? [];
        },
        error: (error) => {
          console.error('Error searching training data', error);
          this.pendingapprovalDatas = [];
        },
      });
    }

  // Select/Deselect all
 // Select/Deselect all
// Select/Deselect all
toggleSelectAll(event: any) {
  this.allSelected = event.target.checked;

  if (this.allSelected) {
    // Select all items
    this.selectedTrainings = this.pendingapprovalDatas.map(training => training);
  } else {
    // Deselect all
    this.selectedTrainings = [];
  }
}

// Toggle individual selection
toggleSelection(training: any, event: any) {
  const isChecked = event.target.checked;

  if (isChecked) {
    // Add selected item to the array
    this.selectedTrainings.push(training);
  } else {
    // Remove deselected item from the array
    this.selectedTrainings = this.selectedTrainings.filter(
      (t) => t.training_id !== training.training_id
    );
  }

  // Update the "Select All" checkbox state
  this.updateSelectAllCheckboxState();
}

// Check if a training is selected
isSelected(training: any): boolean {
  return this.selectedTrainings.some(
    (t) => t.training_id === training.training_id
  );
}

// Update the Select All checkbox based on the selections
updateSelectAllCheckboxState() {
  this.allSelected = this.selectedTrainings.length === this.pendingapprovalDatas.length;
}



  // 🟢 Approve TrainingapproveSelectedTrainings() {
    approveSelectedTrainings() {
  if (this.selectedTrainings.length === 0) {
    alert('Please select at least one training.');
    return;
  }

  if (!confirm('Are you sure you want to approve the selected trainings?')) {
    return;
  }

  this.isLoading = true;

  this.selectedTrainings.forEach(training => {
    console.log(`Approving Training - Student ID: ${training.student_id}, Training ID: ${training.training_id}`);

    this.pendingapprovalServices.approveTraining(training).subscribe({
      next: (response) => {
        console.log(`Approved Successfully - Student ID: ${training.student_id}, Training ID: ${training.training_id}`);
        this.loadPendingApprovalData(); // for refresh pending approval data
        alert('training approve successfully');
        window.location.reload();
      },
      error: (err) => {
        console.error(`Error approving training:`, err);
        alert('Error approve Training');

      }
    });
  });
}




  // ❌ Deny Training

  denySelectedTrainings() {
    if (this.selectedTrainings.length === 0) {
      alert('Please select at least one training.');
      return;
    }

    if (!confirm('Are you sure you want to deny the selected trainings?')) {
      return;
    }

    this.isLoading = true;

    this.selectedTrainings.forEach(training => {
      console.log(`Denying Training - Student ID: ${training.student_id}, Training ID: ${training.training_id}`);

      this.pendingapprovalServices.denyTraining(training).subscribe({
        next: () => {
          console.log(`Denied Successfully - Student ID: ${training.student_id}, Training ID: ${training.training_id}`);
          this.loadPendingApprovalData(); // for refresh pending approval data
          alert('training Denied successfully');
          window.location.reload();//for i don't reload so recently select training are approve or deny
        },
        error: (err) => {
          console.error(`Error denying training:`, err);
          alert('Error Denied Training');
        }
      });
    });
  }


  // Remove approved/denied trainings from UI
  // removeApprovedTrainings(training: any) {
  //   this.pendingapprovalDatas = this.pendingapprovalDatas.filter(t => t.training_id !== training.training_id);
  //   this.selectedTrainings = this.selectedTrainings.filter(t => t.training_id !== training.training_id);
  //   this.allSelected = this.selectedTrainings.length === this.pendingapprovalDatas.length;
  // }
}
