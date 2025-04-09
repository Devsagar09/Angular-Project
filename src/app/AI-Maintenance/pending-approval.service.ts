import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PendingApprovalService {

  private apiUrl = 'https://localhost:7172/api/DisplayData/DisplayPending'; // Update with your API URL

  private approvalUrl = 'https://localhost:7172/api/ManageEnrollment';

  private denyUrl = 'https://localhost:7172/api/ManageEnrollment/Deny';

  private searchPA = 'https://localhost:7172/api/DisplayData/searchPendingApproval';

  constructor(private http: HttpClient) { }

  DisplayPendingApproval(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl)
  }

  searchPendingApproval(searchValue: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.searchPA}?searchValue=${searchValue}`);
  }

  // Approve training
  approveTraining(paData: { student_id: number, training_id: number }) {
    return this.http.post(`${this.approvalUrl}/Approval`, {
      studentId: paData.student_id,
      trainingId: paData.training_id
    });
  }

  // Deny training
  denyTraining(paData: { student_id: number, training_id: number }) {
    return this.http.post(`${this.approvalUrl}/Deny`, {
      studentId: paData.student_id,
      trainingId: paData.training_id
    });
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

  //popup for aprrove and deny training
  showConfirmPopup(count: number, callback: () => void) {
    // Debug check
    console.log("Popup count received:", count);

    // Create overlay
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0, 0, 0, 0.5)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "9999";

    // Create popup container
    const popup = document.createElement("div");
    popup.style.background = "white";
    popup.style.padding = "30px";
    popup.style.borderRadius = "8px";
    popup.style.textAlign = "center";
    popup.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.3)";
    popup.style.width = "400px";

    // Add title
    const title = document.createElement("h2");
    title.innerText = "Confirm Acception";
    title.style.marginBottom = "22px";
    title.style.color = "#0e3e56";
    title.style.fontSize = "20px";
    popup.appendChild(title);

    // Add message
    const message = document.createElement("p");
    const safeCount = count ?? 0;
    message.innerText = `Do you want to approve or deny ${safeCount} training${safeCount === 1 ? '' : 's'}?`;
    message.style.fontSize = "20px";
    message.style.color = "#333";
    popup.appendChild(message);

    // Create buttons container
    const buttonContainer = document.createElement("div");
    buttonContainer.style.marginTop = "15px";
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.gap = "10px";

    // Cancel button
    const cancelButton = document.createElement("button");
    cancelButton.innerText = "Cancel";
    cancelButton.style.background = "gray";
    cancelButton.style.color = "white";
    cancelButton.style.height = "35px";
    cancelButton.style.width = "100px";
    cancelButton.style.fontSize = "16px";
    cancelButton.style.border = "none";
    cancelButton.style.padding = "8px 15px";
    cancelButton.style.borderRadius = "4px";
    cancelButton.style.cursor = "pointer";
    cancelButton.onclick = function () {
      document.body.removeChild(overlay);
    };

    // Hover effect for Cancel
    cancelButton.addEventListener("mouseover", () => {
      cancelButton.style.background = "#5e5e5e";
    });
    cancelButton.addEventListener("mouseout", () => {
      cancelButton.style.background = "gray";
    });

    cancelButton.onclick = function () {
      document.body.removeChild(overlay);
    };

    // Confirm button
    const confirmButton = document.createElement("button");
    confirmButton.innerText = "Yes, Sure";
    confirmButton.style.background = "green";
    confirmButton.style.color = "white";
    confirmButton.style.height = "35px";
    confirmButton.style.width = "130px";
    confirmButton.style.fontSize = "16px";
    confirmButton.style.border = "none";
    confirmButton.style.padding = "8px 15px";
    confirmButton.style.borderRadius = "4px";
    confirmButton.style.cursor = "pointer";
    confirmButton.onclick = function () {
      document.body.removeChild(overlay);
      if (callback) {
        callback(); // Execute confirm action
      }
    };

    // Hover effect for Confirm
    confirmButton.addEventListener("mouseover", () => {
      confirmButton.style.background = "#2c9e2c";
    });
    confirmButton.addEventListener("mouseout", () => {
      confirmButton.style.background = "green";
    });

    confirmButton.onclick = function () {
      document.body.removeChild(overlay);
      if (callback) {
        callback(); // Execute confirm action
      }
    };

    // Append buttons to container
    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(cancelButton);
    popup.appendChild(buttonContainer);

    // Append popup to overlay
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  }

}
