import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdminNavigationService {
  private apiUrl = 'https://localhost:7172/api/Profile/GetProfileImage'; 
  private displaylogo = 'https://localhost:7172/api/Profile/DisplayCompanyLogo';

  constructor(private http: HttpClient) {}

  getProfileImage(studentId: string | null): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}?studentId=${studentId}`); 
  }

  displayLogo(): Observable<any> {
    return this.http.get<any>(`${this.displaylogo}`); 
  }
}
