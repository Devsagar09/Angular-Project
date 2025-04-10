import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TrainingService {

  private studapiUrl = 'https://localhost:7172/api/Student/GetStudents';

  private apiUrl = 'https://localhost:7172/api/Training/getTraining';

  private TTapiUrl = 'https://localhost:7172/api/TrainingType/getTrainingType';

  private SearchapiUrl = 'https://localhost:7172/api/Training/searchTraining';

  private addTrainingapiUrl = 'https://localhost:7172/api/Training/addTraining';

  private delTrainingapiUrl = 'https://localhost:7172/api/Training/deleteTraining';

  private SearchStudUrl = 'https://localhost:7172/api/Student/searchStudent';

  private assignStudentUrl = 'https://localhost:7172/api/AssignStudents/AssignStudents';

  private updateTraUrl = 'https://localhost:7172/api/Training/updateTraining';

  private gettrainingbyidUrl = 'https://localhost:7172/api/Training/getTrainingById';

  constructor(private http: HttpClient) { }

  getTraining(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl)
  }

  getStudent(): Observable<any> {
    return this.http.get<any[]>(this.studapiUrl)
  }

  getTrainingType(): Observable<any> {
    return this.http.get<any[]>(this.TTapiUrl)
  }

  searchTraining(searchValue: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.SearchapiUrl}?searchValue=${searchValue}`);
  }

  searchStudent(searchValue: string): Observable<any> {
    return this.http.get<any[]>(`${this.SearchStudUrl}?searchValue=${searchValue}`);
  }

  // Add new training
  addTraining(formData: FormData): Observable<any> {
    return this.http.post<any>(this.addTrainingapiUrl, formData); // Use POST for FormData
  }

  assignStudents(assignData: any): Observable<any> {
    return this.http.post(`${this.assignStudentUrl}`, assignData);
  }

  // Send DELETE request with an array of IDs
  deleteTraining(trainingIds: number[]) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.request('DELETE', `${this.delTrainingapiUrl}`, {
      body: trainingIds,
      headers: headers
    });
  }

  getTrainingById(id: number): Observable<any> {
    return this.http.get<any>(`https://localhost:7172/api/Training/getTraining/${id}`);
  }

  updateTraining(formData: FormData): Observable<any> {
    return this.http.put(`${this.updateTraUrl}`, formData);
  }

  getTrainingByIds(id: number): Observable<any> {
    return this.http.get(`https://localhost:7172/api/Training/getTrainingById/${id}`);
  }

  getAssignedStudentIds(trainingId: number) {
    return this.http.get<number[]>(`https://localhost:7172/api/AssignStudents/GetStudentIds/${trainingId}`);
  }

  // notification
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
      container.style.top = '70px';
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

  //popup for delete training
  showConfirmPopup(count: number, callback: () => void) {
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
    overlay.style.padding = "30px";
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
    title.innerText = "Confirm Deletion";
    title.style.marginBottom = "20px";
    title.style.color = "#0e3e56";
    title.style.fontSize = "22px";
    popup.appendChild(title);

    // Add message
    const message = document.createElement("p");
    message.innerText = `Are you sure! you want to delete ${count} training${count > 1 ? 's' : ''}?`;
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
    cancelButton.style.cursor = "pointer";
    cancelButton.style.borderRadius = "4px";
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

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Yes, Delete";
    deleteButton.style.background = "#d9534f";
    deleteButton.style.height = "35px";
    deleteButton.style.width = "130px";
    deleteButton.style.fontSize = "16px";
    deleteButton.style.color = "white";
    deleteButton.style.border = "none";
    deleteButton.style.padding = "8px 15px";
    deleteButton.style.cursor = "pointer";
    deleteButton.style.borderRadius = "4px";
    deleteButton.onclick = function () {
      document.body.removeChild(overlay);
      if (callback) {
        callback(); // Execute delete function
      }
    };

    // Hover effect for Confirm
    deleteButton.addEventListener("mouseover", () => {
      deleteButton.style.background = "red";
    });
    deleteButton.addEventListener("mouseout", () => {
      deleteButton.style.background = "rgb(227, 42, 42)";
    });

    deleteButton.onclick = function () {
      document.body.removeChild(overlay);
      if (callback) {
        callback(); // Execute confirm action
      }
    };

    // Append buttons to container
    buttonContainer.appendChild(deleteButton);
    buttonContainer.appendChild(cancelButton);
    popup.appendChild(buttonContainer);

    // Append popup to overlay
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  }

}
