import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private apiBase = "https://localhost:7172/api/DisplayData"; 
  private apiUrl = 'https://localhost:7172/api/CountStudentDashboard/getCountStudentDashboard';

  constructor(private http: HttpClient) {}

  getNotStartedTrainings(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/GetNotStarted/${studentId}`);
  }

  getInProgressTrainings(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/GetInProgress/${studentId}`);
  }

  getStudentChart(studentId: number): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/${studentId}`);
  }
}
