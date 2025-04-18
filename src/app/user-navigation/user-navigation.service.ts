import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserNavigationService {
  private apiUrl = 'https://localhost:7172/api/Profile/GetProfileImage'; 

  constructor(private http: HttpClient) {}

  GetProfileImage(studentId: string | null): Observable<any> {
    if (!studentId) {
      console.error('Student ID is missing from session storage.');
      return new Observable(); 
    }
    return this.http.get<any>(`${this.apiUrl}?studentId=${studentId}`); 
  }
}

  
