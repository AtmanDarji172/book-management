import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookRoutingModule } from './book-routing.module';
import { DetailsComponent } from './details/details.component';
import { AddEditComponent } from './add-edit/add-edit.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [
    DetailsComponent,
    AddEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BookRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule
  ]
})
export class BookModule { }
