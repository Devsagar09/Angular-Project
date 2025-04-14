import { Component } from '@angular/core';
import { PendingApprovalService } from '../pending-approval.service';

@Component({
  selector: 'app-display-status',
  standalone: false,
  templateUrl: './display-status.component.html',
  styleUrl: './display-status.component.css'
})
export class DisplayStatusComponent {
  SearchValue: string = '';
  itemsPerPage: number = 10;
  p: number = 1; // Current page
  itemsPerPageOptions: number[] = [2, 5, 10, 20, 50];
  isLoading = false;
  displayStatusData: any[] = []; // display status data

  constructor(private pendingapprovalServices: PendingApprovalService) { }

  ngOnInit():void{
    this.LoadDisplayStatus();
  }
  LoadDisplayStatus(): void{
    this.isLoading = true;
    this.pendingapprovalServices.DisplayStatus().subscribe({
      next: (data)=>{
        // console.log('Display Status Response:', data);
        setTimeout(() => {
          this.displayStatusData = data;
          this.isLoading = false;
        }, 300);
      },
      error: (error)=>{
        this.isLoading = false;
        console.error('Error Fetching Display status Data', error);
      }
    });
  }

    // Search display status data
    searchDisplayStatus(): void {
      if (!this.SearchValue.trim()) {
        this.LoadDisplayStatus(); // Reload all training data if the search is empty
        return;
      }
      this.pendingapprovalServices.searchDisplayStatus(this.SearchValue).subscribe({
        next: (data) => {
          // console.log('Search result:', data);
          this.displayStatusData = data ?? [];
        },
        error: (error) => {
          console.error('Error searching training data', error);
          this.displayStatusData = [];
        },
      });
    }
}
