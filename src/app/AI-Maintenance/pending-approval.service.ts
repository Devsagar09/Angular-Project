import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PendingApprovalService {

   private apiUrl = 'https://localhost:7172/api/DisplayData/DisplayPending'; // Update with your API URL

   private approvalUrl = 'https://localhost:7172/api/ManageEnrollment';

   private denyUrl = 'https://localhost:7172/api/ManageEnrollment/Deny';

   private searchPA = 'https://localhost:7172/api/DisplayData/searchPendingApproval';

    constructor(private http: HttpClient) { }

    DisplayPendingApproval():Observable<any>{
      return this.http.get<any[]>(this.apiUrl)
    }

     searchPendingApproval(searchValue: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.searchPA}?searchValue=${searchValue}`);
      }

     // Approve training
    approveTraining(paData: { student_id: number, training_id: number }){
      return this.http.post(`${this.approvalUrl}/Approval`, {
        studentId: paData.student_id,
    trainingId: paData.training_id
      });
    }

    // Deny training
    denyTraining(paData: { student_id: number, training_id: number }) {
      return this.http.post(`${this.approvalUrl}/Deny`, {
        studentId: paData.student_id,
        trainingId: paData.training_id
      });
    }
}
