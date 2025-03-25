import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { IdpComponent } from './idp/idp.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
 

@NgModule({
  declarations: [
    IdpComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule
  ] 
})
export class IdpModule { }
