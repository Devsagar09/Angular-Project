import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdmindashboardService {

  private apiUrl = 'https://localhost:7172/api/CountAdminDashboard/getCountAdminDashboard'; // Update with your API URL

  constructor(private http: HttpClient) {}

  getCountAdminDashboard(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
