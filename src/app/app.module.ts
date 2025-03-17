import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {IconModule} from '@progress/kendo-angular-icons';  
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { HomeComponent } from './home/home.component'; 

import { CardModule } from '@progress/kendo-angular-layout'; 
import { AvatarModule } from '@progress/kendo-angular-layout';

import { ChartsModule } from '@progress/kendo-angular-charts';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './Shared/footer/footer.component';
 

@NgModule({
  declarations: [
    AppComponent,
    NotFoundPageComponent,
    HomeComponent,
    FooterComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconModule,
    ButtonsModule,
    CardModule,
    AvatarModule,
    ChartsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
