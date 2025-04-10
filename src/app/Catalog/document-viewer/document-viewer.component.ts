import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-document-viewer',
  standalone: false,
  templateUrl: './document-viewer.component.html',
  styleUrl: './document-viewer.component.css'
})
export class DocumentViewerComponent {
  pdfUrl: string = '';
  loading: boolean = true;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['url']) {
        setTimeout(() => {
          this.pdfUrl = decodeURIComponent(params['url']);
          this.loading = false;
        }, 500);
      } else {
        console.error("Invalid PDF URL");
      }
    });
  }

}
