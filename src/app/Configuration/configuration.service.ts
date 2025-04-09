import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private displayCon = 'https://localhost:7172/api/Configuration/getConfiguration';

  private addorupdateCon = 'https://localhost:7172/api/Configuration/updateConfiguration';

  constructor(private http: HttpClient) { }

  getConfig(): Observable<any> {
    return this.http.get<any[]>(this.displayCon)
  }
  updateConfig(data: any): Observable<any> {
    return this.http.post(`${this.addorupdateCon}`, data);
  }

  showNotification(
    message: string,
    type: 'success' | 'warning' | 'error' = 'error'
  ): void {
    // Ensure the container exists or create it
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.style.position = 'fixed';
      container.style.top = '10px';
      container.style.right = '10px';
      container.style.zIndex = '1000';
      document.body.appendChild(container);
    }

    // Remove existing notification if any
    const existingNotification = document.getElementById(
      'current-notification'
    );
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create a new notification element
    const notification = document.createElement('div');
    notification.id = 'current-notification'; // Set unique ID for the notification
    notification.style.backgroundColor =
      type === 'success'
        ? '#4caf50'
        : type === 'warning'
          ? '#ff9800'
          : '#f44336'; // Set color based on type
    notification.style.color = 'white';
    notification.style.padding = '15px 20px';
    notification.style.marginBottom = '10px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.justifyContent = 'space-between';
    notification.style.fontSize = '14px';

    // Set message and close button
    notification.innerHTML = `
    <span>${message}</span>
    <button style="
      background: transparent;
      border: none;
      color: white;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
    ">&times;</button>
  `;

    // Add close button functionality
    const closeButton = notification.querySelector(
      'button'
    ) as HTMLButtonElement;
    closeButton.onclick = () => notification.remove();

    // Append the new notification to the container
    container.appendChild(notification);

    // Automatically remove the notification after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

}
