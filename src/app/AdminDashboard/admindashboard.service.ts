import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdmindashboardService {

  private apiUrl = 'https://localhost:7172/api/CountAdminDashboard/getCountAdminDashboard'; // Update with your API URL

  constructor(private http: HttpClient) {}

  // getCountAdminDashboard(studentId: string): Observable<any> {
  //   const url = `${this.apiUrl}?studentId=${studentId}`; // Pass studentId as a query parameter
  //   //return this.http.get<any[]>(this.apiUrl);
  //   return this.http.get<any>(url);

  // }
  getCountAdminDashboard(studentId: string): Observable<any> {
    const url = `${this.apiUrl}/${studentId}`; // Pass studentId as a route parameter
    return this.http.get<any>(url);
  }
}
