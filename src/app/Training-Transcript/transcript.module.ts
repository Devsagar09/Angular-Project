import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranscriptComponent } from './transcript/transcript.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TranscriptComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    FontAwesomeModule,
    FormsModule
  ]
})
export class TranscriptModule { }
