import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://localhost:7172/api/Auth/Login';
  private forgetpasswordurl = 'https://localhost:7172/api/Auth'; 
private selfregurl='https://localhost:7172/api/Student/selfRegister';
  

  constructor(private http : HttpClient) { }

  login(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl, credentials)  
      .pipe(
        catchError(error => {
          // console.error('Login error:', error);
          return throwError(error);
        })
      );
  }

  checkUserExists(emailOrUsername: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(
      `${this.forgetpasswordurl}/CheckUserExists`,
      JSON.stringify(emailOrUsername), // ✅ Send as JSON string
      { headers }
    );
  }

  forgetPassword(data: any): Observable<any> {
    return this.http.post(`${this.forgetpasswordurl}/ForgetPassword`, data); // ✅ Correct endpoint
  }

  
  selfRegister(studentData: any): Observable<any> {
    return this.http.post(`${this.selfregurl}`, studentData);
  }
  

}
