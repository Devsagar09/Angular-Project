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

  constructor(private pendingapprovalServices: PendingApprovalService) { }

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
  // toggleSelectAll(event: any) {
  //   this.allSelected = event.target.checked;

  //   if (this.allSelected) {
  //     // Select all items
  //     this.selectedTrainings = this.pendingapprovalDatas.map(training => training);
  //   } else {
  //     // Deselect all
  //     this.selectedTrainings = [];
  //   }
  // }

  toggleSelectAll(event: any) {
    this.allSelected = event.target.checked;

    this.pendingapprovalDatas.forEach(training => {
      training.selected = this.allSelected;
    });

    this.selectedTrainings = this.allSelected
      ? this.pendingapprovalDatas.map(t => ({
        student_id: t.student_id,
        training_id: t.training_id,
      }))
      : [];
  }

  // Toggle individual selection
  // toggleSelection(training: any, event: any) {
  //   const isChecked = event.target.checked;

  //   if (isChecked) {
  //     // Add selected item to the array
  //     this.selectedTrainings.push(training);
  //   } else {
  //     // Remove deselected item from the array
  //     this.selectedTrainings = this.selectedTrainings.filter(
  //       (t) => t.training_id !== training.training_id
  //     );
  //   }

  //   // Update the "Select All" checkbox state
  //   this.updateSelectAllCheckboxState();
  // }
  toggleSelection(training: any, event: any) {
    training.selected = event.target.checked;

    if (training.selected) {
      this.selectedTrainings.push({
        student_id: training.student_id,
        training_id: training.training_id,
      });
    } else {
      this.selectedTrainings = this.selectedTrainings.filter(
        (t) => t.training_id !== training.training_id
      );
    }

    this.updateSelectAllCheckboxState();
  }

  // Check if a training is selected
  isSelected(training: any): boolean {
    return this.selectedTrainings.some(
      (t) => t.training_id === training.training_id
    );
  }

  // Update the Select All checkbox based on the selections
  // updateSelectAllCheckboxState() {
  //   this.allSelected = this.selectedTrainings.length === this.pendingapprovalDatas.length;
  // }
  updateSelectAllCheckboxState() {
    this.allSelected = this.pendingapprovalDatas.every(t => t.selected);
  }



  // 🟢 Approve TrainingapproveSelectedTrainings() {
  approveSelectedTrainings() {
    if (this.selectedTrainings.length === 0) {
      this.pendingapprovalServices.showNotification('Please select at least one training.', 'warning');
      return;
    }

    this.pendingapprovalServices.showConfirmPopup(this.selectedTrainings.length, () => {
      this.isLoading = true;

      this.selectedTrainings.forEach(training => {
        console.log(`Approving Training - Student ID: ${training.student_id}, Training ID: ${training.training_id}`);

        this.pendingapprovalServices.approveTraining(training).subscribe({
          next: (response) => {
            console.log(`Approved Successfully - Student ID: ${training.student_id}, Training ID: ${training.training_id}`);
            this.pendingapprovalServices.showNotification('Training approve successfully', 'success');
            //code for after btn click refresh
            this.selectedTrainings = [];
            this.allSelected = false;
            this.loadPendingApprovalData(); // Refresh without full reload,  for refresh pending approval data

          },
          error: (err) => {
            console.error(`Error approving training:`, err);
            this.pendingapprovalServices.showNotification('Error approve Training', 'error');

          }
        });
      });
    })
    // if (!confirm('Are you sure you want to approve the selected trainings?')) {
    //   return;
    // }
  }

  // ❌ Deny Training

  denySelectedTrainings() {
    if (this.selectedTrainings.length === 0) {
      this.pendingapprovalServices.showNotification('Please select at least one training.', 'warning');
      return;
    }

    this.pendingapprovalServices.showConfirmPopup(this.selectedTrainings.length, () => {
      this.isLoading = true;

      this.selectedTrainings.forEach(training => {
        console.log(`Denying Training - Student ID: ${training.student_id}, Training ID: ${training.training_id}`);

        this.pendingapprovalServices.denyTraining(training).subscribe({
          next: () => {
            console.log(`Denied Successfully - Student ID: ${training.student_id}, Training ID: ${training.training_id}`);
            this.pendingapprovalServices.showNotification('Training Denied successfully :)', 'success');
            //code for after btn click refresh
            this.selectedTrainings = [];
            this.allSelected = false;
            this.loadPendingApprovalData(); // Refresh without full reload,  for refresh pending approval data

          },
          error: (err) => {
            console.error(`Error denying training:`, err);
            this.pendingapprovalServices.showNotification('Error Denied Training !!', 'error');
          }
        });
      });
    })
    // if (!confirm('Are you sure you want to deny the selected trainings?')) {
    //   return;
    // }

  }


  // Remove approved/denied trainings from UI
  // removeApprovedTrainings(training: any) {
  //   this.pendingapprovalDatas = this.pendingapprovalDatas.filter(t => t.training_id !== training.training_id);
  //   this.selectedTrainings = this.selectedTrainings.filter(t => t.training_id !== training.training_id);
  //   this.allSelected = this.selectedTrainings.length === this.pendingapprovalDatas.length;
  // }
}
