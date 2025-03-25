import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
private apiUrl = 'https://localhost:7172/api/Student/GetStudents';
private searchUrl = 'https://localhost:7172/api/Student/searchStudent';

  constructor(private http: HttpClient) { }

  getStudent():Observable<any>{
    return this.http.get<any[]>(this.apiUrl)
  }

  searchStudent(searchValue:string):Observable<any>{
    return this.http.get<any[]>(`${this.searchUrl}?searchValue=${searchValue}`);
  }
}
