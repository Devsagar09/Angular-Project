import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PendingApprovalService {

   private apiUrl = 'https://localhost:7172/api/DisplayData/DisplayPending'; // Update with your API URL

    constructor(private http: HttpClient) { }

    DisplayPendingApproval():Observable<any>{
      return this.http.get<any[]>(this.apiUrl)
    }
}
