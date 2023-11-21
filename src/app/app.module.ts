import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlanerComponent } from './planer/planer.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule} from "@angular/forms";
import {CdkDrag, CdkDropList} from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [
    AppComponent,
    PlanerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSlideToggleModule,
    MatInputModule,
    MatDatepickerModule,
    BrowserAnimationsModule,
    FormsModule,
    CdkDrag,
    CdkDropList,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
