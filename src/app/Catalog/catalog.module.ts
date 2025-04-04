import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogComponent } from './catalog/catalog.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { DocumentViewerComponent } from './document-viewer/document-viewer.component';


@NgModule({
  declarations: [
    CatalogComponent,
    DocumentViewerComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    NgxExtendedPdfViewerModule
  ]
})
export class CatalogModule { }
