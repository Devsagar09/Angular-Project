import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { IdpComponent } from './idp/idp.component';
import { NgxPaginationModule } from 'ngx-pagination';
 

@NgModule({
  declarations: [
    IdpComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule
  ] 
})
export class IdpModule { }
