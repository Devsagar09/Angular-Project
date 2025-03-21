import { Component } from '@angular/core';
import { TraningService } from '../traning.service';

@Component({
  selector: 'app-traning',
  standalone: false,
  templateUrl: './traning.component.html',
  styleUrl: './traning.component.css'
})
export class TraningComponent {

  trainingDatas: any;

  constructor(private trainingService: TraningService){}

  // goToDashboard() {
  //   this.router.navigate(['/dashboard']);
  // }

  ngOnInit(): void{
    this.loadtraining();
  }
  loadtraining():void{
    this.trainingService.getTraining().subscribe({
      next: (data) =>{
        this.trainingDatas = data
      },
      error: (error)=>{
        console.error('error fetching training data', error);
      }
    })
  }
}
