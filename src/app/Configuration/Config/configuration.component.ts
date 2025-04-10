import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../configuration.service';
import { AdminNavigationService } from '../../admin-navigation/admin-navigation.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private configService: ConfigurationService, private adminnavigationService:AdminNavigationService,private snackBar:MatSnackBar) {}

  ngOnInit(): void {
    this.displayConfig();
    this.  displayLogo();
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
    this.selectedFile = null;
    this.previewUrl = null;
    return;
  }

      this.selectedFile = file;

      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
    this.logoChanged = true;

  }

  uploadLogo(): void {
    debugger
    if (!this.logoChanged || !this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile); // Don't forget to append the actual file!

    this.configService.uploadLogo(formData).subscribe({
      next: (res) => {

        this.selectedFile = null;
        this.previewUrl = null;
        this.displayLogo(); // Refresh logo from server
        this.logoChanged = false;
        this.showSuccessSnackbar('Company Logo Changed.');
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
    this.selectedFile = null;
    this.previewUrl = null;
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
