import { Component } from '@angular/core';
import { PendingApprovalService } from '../pending-approval.service';

@Component({
  selector: 'app-pending-approval',
  standalone: false,
  templateUrl: './pending-approval.component.html',
  styleUrl: './pending-approval.component.css'
})
export class PendingApprovalComponent {
  isLoading=true
 pendingapprovalDatas: any[] = []; // Original training data

  constructor(private pendingapprovalServices: PendingApprovalService) {}
  p: number = 1; // Current page

  ngOnInit(): void {
    this.loadPendingApprovalData();
  }

  // Load training data from the service
  loadPendingApprovalData(): void {
    this.pendingapprovalServices.DisplayPendingApproval().subscribe({
      next: (data) => {
        this.pendingapprovalDatas = data;
        // this.updatePagination();
      },
      error: (error) => {
        console.error('Error fetching training data:', error);
      }
    });
  }
}
