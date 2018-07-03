import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule, ReactiveFormsModule
} from '@angular/forms';
import { AbstractFormComponent } from './form-component/form-component.component';
export { AbstractFormComponent };
@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: []
})
export class FormSugarModule { }
