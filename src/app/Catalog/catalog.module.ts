import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogComponent } from './catalog/catalog.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    CatalogComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule
  ]
})
export class CatalogModule { }
