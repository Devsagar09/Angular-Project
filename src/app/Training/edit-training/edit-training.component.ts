import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-edit-training',
  standalone: false,
  templateUrl: './edit-training.component.html',
  styleUrls: ['./edit-training.component.css']
})
export class EditTrainingComponent implements OnInit {
  trainingForm!: FormGroup;
  uploadedFiles: File[] = []; // document file upload

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private trainingService: TrainingService
  ) {}

  ngOnInit(): void {
    this.trainingForm = this.fb.group({
      trainingId: [''],
      trainingName: [''],
      trainingCode: [''],
      trainingTypeName: [''],
      externalLinkUrl: [''],
      trainingHours: [''],
      requiresApproval: [''],
      archiveDate: [''],
      summary: [''],
      courseCatalog: [''],
      cstartDate: [''],
      cendDate: [''],
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTrainingDetails(parseInt(id, 10));
    }
  }

  loadTrainingDetails(id: number) {
    this.trainingService.getTrainingByIds(id).subscribe(data => {
       // Convert date format to "yyyy-MM-dd"
    if (data.cstartDate) {
      data.cstartDate = this.formatDate(data.cstartDate);
    }
    if (data.cendDate) {
      data.cendDate = this.formatDate(data.cendDate);
    }
    if (data.archiveDate) {
      data.archiveDate = this.formatDate(data.archiveDate);
    }
      this.trainingForm.patchValue(data);
    });
  }

  // Function to format date to "yyyy-MM-dd"
formatDate(dateString: string): string {
  return dateString ? dateString.split('T')[0] : '';
}

//for document show
  // Delete file
  deleteFile(index: number): void {
    this.uploadedFiles.splice(index, 1);
  }

  // Trigger file input
  triggerFileUpload(): void {
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLElement;
    fileInput.click();
  }
}
