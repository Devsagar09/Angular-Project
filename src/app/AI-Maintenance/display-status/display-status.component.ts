import { Component } from '@angular/core';
import { PendingApprovalService } from '../pending-approval.service';
import { TrainingService } from '../../Training/training.service';


@Component({
  selector: 'app-display-status',
  standalone: false,
  templateUrl: './display-status.component.html',
  styleUrl: './display-status.component.css'
})
export class DisplayStatusComponent {
  SearchValue: string = ''; // for display status search
  searchValue: string = ''; // for training data search
  itemsPerPage: number = 10;
  p: number = 1; // Current page
  itemsPerPageOptions: number[] = [2, 5, 10, 20, 50];
  isLoading = false;
  displayStatusData: any[] = []; // display status data
  trainingDatas: any[] = []; // Original training data
  showModal: boolean = false;
  selectedTraining: any = null;


  constructor(private pendingapprovalServices: PendingApprovalService, private trainingService: TrainingService) { }

  ngOnInit():void{
    this.loadTrainingData();
    this.LoadDisplayStatus();
  }


  loadTrainingData(): void {
    this.isLoading = true;

    this.trainingService.getTraining().subscribe({
      next: (data) => {
        // Add a slight delay to show the loader for smoother UX (e.g., 500ms)
        setTimeout(() => {
          this.trainingDatas = data;
          this.isLoading = false;
          // this.updatePagination(); // Optional if you need it
        }, 500); // ⏱ Loader stays for 0.5 seconds
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching training data:', error);
      }
    });
  }


      getThumbnailUrl(fileName: string, type: string): string {
        return this.pendingapprovalServices.getTrainingThumbnail(fileName, type);
      }

      studentStatusList: any[] = [];              // List shown in modal
      originalStudentStatusList: any[] = [];      // Full data backup
      searchTerm: string = '';                    // User's input in search box

      openDetailsModal(trainingId: number): void {
        this.pendingapprovalServices.getStudentStatusbyTrainings(trainingId).subscribe({
          next: (data) => {
            console.log("Training details response:", data);

            this.originalStudentStatusList = data;              // Store full data
            this.studentStatusList = [...this.originalStudentStatusList]; // Display all
            this.searchTerm = '';                               // Reset search
            this.showModal = true;                              // Show modal
          },
          error: (err) => {
            console.error('Failed to fetch training details:', err);
            this.trainingService.showNotification('Unable to load training details', 'error');
          }
        });
      }

      // Call this when the user types in the search box
      onSearchChange(): void {
        const term = this.searchTerm.trim().toLowerCase();

        if (!term) {
          this.studentStatusList = [...this.originalStudentStatusList]; // Reset to all
          return;
        }

        this.studentStatusList = this.originalStudentStatusList.filter(student =>
          (student.student_name?.toLowerCase().includes(term) || '') ||
          (student.display_status?.toLowerCase().includes(term) || '')
        );
      }


      closedetailModal(): void {
        this.showModal = false;
        this.studentStatusList = [];
      }

      getStatusBadgeClass(status: string): string {
        if (!status) return 'status-pending'; // default fallback
        switch (status.toLowerCase()) {
          case 'completed':
            return 'status-completed';
          case 'in progress':
            return 'status-inprogress';
          case 'not started':
            return 'status-notstarted';
          case 'pending approval':
            return 'status-pa';
          default:
            return 'status-pending';
        }
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
