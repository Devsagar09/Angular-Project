import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  private apiBase = "https://localhost:7172/api/DisplayData/DisplayEnrollment"
  private searchapi = "https://localhost:7172/api/Search/SearchEnroll"

  constructor(private http: HttpClient) { }

  getEnrollment(studentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBase}/${studentId}`);
  }

   searchEnrollment(query:string,studentId:number): Observable<any> {
        return this.http.get(`${this.searchapi}?searchValue=${encodeURIComponent(query)}&studentID=${studentId}`);
      }
}
