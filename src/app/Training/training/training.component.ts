import { Component } from '@angular/core';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-traning',
  standalone: false,
  templateUrl: './training.component.html',
  styleUrl: './training.component.css'
})
export class TrainingComponent {

  trainingDatas: any;

  constructor(private trainingService: TrainingService){}

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
