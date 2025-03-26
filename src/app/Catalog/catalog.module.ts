import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogComponent } from './catalog/catalog.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CatalogComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule
  ]
})
export class CatalogModule { }
