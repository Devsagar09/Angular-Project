import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://localhost:7172/api/Auth/Login';
  

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
}
