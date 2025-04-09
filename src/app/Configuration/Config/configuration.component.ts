import { Component, OnInit } from '@angular/core';
import { ConfigurationService } from '../configuration.service';

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
  configData: Config[] = []; // Explicitly define the type as an array of Config

  constructor(private configService: ConfigurationService) { }

  ngOnInit(): void {
    this.displayConfig();
  }

  displayConfig(): void {
    this.configService.getConfig().subscribe({
      next: (data: Config[]) => {
        this.configData = data.map(config => ({
          config_id: config.config_id,
          config_key: config.config_key,
          config_value: Boolean(config.config_value) // Ensure it's a boolean
        }));

        console.log('Processed Data:', this.configData);
      },
      error: (error) => {
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

}
