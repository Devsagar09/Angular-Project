import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public idpIcon = "assets/icons/idp-icon.png";
  public catalogIcon = "assets/icons/catalog-icon.png";
  public transcriptIcon = "assets/icons/transcript-icon.png";
}
