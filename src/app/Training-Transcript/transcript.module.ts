import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranscriptComponent } from './transcript/transcript.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    TranscriptComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    FontAwesomeModule
  ]
})
export class TranscriptModule { }
