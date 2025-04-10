import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { AdminNavigationService } from '../../admin-navigation/admin-navigation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImageCroppedEvent } from 'ngx-image-cropper';

interface Config {
  config_id: number;
  config_key: string;
  config_value: boolean; // Since API returns true/false
}

@Component({
  selector: 'app-configuration',
  standalone: false,
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'] // Fixed property name (was `styleUrl`)
})


export class ConfigurationComponent implements OnInit {
  isLoading = false;
  companyimage : string | null = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  logoChanged = false;
  configData: Config[] = []; // Explicitly define the type as an array of Config
  showCropper = false;
  imageChangedEvent: any = '';
  croppedImage: string = '';

  constructor(private configService: ConfigurationService, private adminnavigationService: AdminNavigationService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.displayConfig();
    this.displayLogo();
  }

  displayLogo() {
    this.adminnavigationService.displayLogo().subscribe(
      (response: any) => {
        this.companyimage = response.companylogo;
      },
      error => {
        console.error('Error fetching company logo:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    debugger
    const file = event.target.files[0];
    if (file) {
      const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];

      if (!validImageTypes.includes(file.type)) {
        this.showErrorSnackbar('Only PNG, JPG or JPEG images are allowed.');
        return;
      }
      this.selectedFile = file; // Store the original file with its name
      this.imageChangedEvent = event; // trigger cropper
      this.showCropper = true;
    }
  }
  
   onImageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64!;
  }
  
   base64ToBlob(base64: string): Blob {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  
uploadLogo(): void {
  debugger
  if (!this.croppedImage || !this.selectedFile) return;

    const blob = this.base64ToBlob(this.croppedImage);
  const formData = new FormData();
  formData.append('file',blob, this.selectedFile.name); 

  this.configService.uploadLogo(formData).subscribe({
    next: (res) => {
      this.displayLogo(); 
      this.logoChanged = false;
      this.showSuccessSnackbar('Company Logo Changed.');
      this.showCropper = false;
      setTimeout(() => {
        location.reload();
      }, 1000);
    },
    error: (err) => {
      console.error('Logo upload failed:', err);
      this.showErrorSnackbar('Failed to upload logo.');
    }
  });
}

resetLogo(): void {
  this.imageChangedEvent = '';
  this.croppedImage = '';
  this.logoChanged = false;
}


   displayConfig(): void {
    this.isLoading = true;
    this.configService.getConfig().subscribe({
      next: (data: Config[]) => {
        setTimeout(() => {
          this.configData = data.map(config => ({
            config_id: config.config_id,
            config_key: config.config_key,
            config_value: Boolean(config.config_value) // Ensure it's a boolean
          }));
          this.isLoading = false;
        }, 500);
 
 
        console.log('Processed Data:', this.configData);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error fetching data:', error);
      }
    });
  }
 
  toggleApproval(config: Config): void {
    config.config_value = !config.config_value; // Toggle between true/false
    setTimeout(() => {
      this.updateConfiguration(config); // Call API after UI update
    }, 300); // Slight delay for smooth effect
    // this.updateConfiguration(config);
    console.log('Updated Value:', config);
  }
 
  updateConfiguration(config: any): void {
 
    this.configService.updateConfig(config).subscribe({
      next: (res) => {
        this.configService.showNotification('Configuration updated successfully!', 'success');
        console.log('Configuration updated:', res);
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.configService.showNotification('Failed to update configuration.', 'error');
      }
    });
  }

showSuccessSnackbar(message: string) {
  this.snackBar.open(message, 'X', {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: ['app-notification-success']
  });
}

showErrorSnackbar(message: string) {
  this.snackBar.open(message, 'X', {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: ['app-notification-error']
  });
}

}
