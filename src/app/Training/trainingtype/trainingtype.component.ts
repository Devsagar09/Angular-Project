import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-trainingtype',
  standalone: false,
  templateUrl: './trainingtype.component.html',
  styleUrl: './trainingtype.component.css'
})
export class TrainingtypeComponent{
  @Output() closeModalEvent = new EventEmitter<void>(); // Emit event to parent
  trainingtypeDatas: any[] = [];
  trainingOptions: any[] = [];
  defaultIcon = '📁'; // Default icon for new or unspecified training types

  constructor(private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.loadTrainingType();
  }

  // Load training types and assign iconsloadTrainingType(): void {
    loadTrainingType(): void {
      this.trainingService.getTrainingType().subscribe({
        next: (data) => {
          console.log('API Response:', data); // Log raw response
          if (data && Array.isArray(data)) {
            this.trainingtypeDatas = data; // Assign data if it's an array
            this.trainingOptions = this.trainingtypeDatas.map((item) => ({
              icon: this.getIconForType(item.trainingtype_Name),
              label: this.capitalizeFirstLetter(item.trainingtype_Name || 'Undefined'),
            }));
            console.log('Mapped Training Options:', this.trainingOptions); // Log mapped options
          } else {
            console.error('Unexpected API response format:', data); // Handle unexpected format
          }
        },
        error: (error) => {
          console.error('Error fetching training data:', error);
        },
      });
    }


// Method to assign icons dynamically based on type
getIconForType(trainingtype_Name: string | undefined): string {
  if (!trainingtype_Name || typeof trainingtype_Name !== 'string') {
    return '📂'; // Default icon if `trainingtype_name` is undefined or invalid
  }

  const normalizedType = trainingtype_Name.trim().toLowerCase();
  switch (normalizedType) {
    case 'e-learning':
      return '🌐';
    case 'document':
      return '📁';
    case 'external link':
      return '🔗';
    case 'instructor led training':
      return '🖥️';
    case 'assessment':
      return '✏️';
    case 'learning path':
      return '🎓';
    default:
      return '📂'; // Default icon for unrecognized types
  }
}


  // Helper method to capitalize the first letter of each word
  capitalizeFirstLetter(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }


  // Emit close event for the modal
  closeModal(): void {
    console.log('Close modal event emitted!');
    this.closeModalEvent.emit();
  }


}
