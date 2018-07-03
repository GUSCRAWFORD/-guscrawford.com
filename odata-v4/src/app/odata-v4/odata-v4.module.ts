import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ODataV4Service } from './odata-v4.service'
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers:[ODataV4Service]
})
export class ODataV4Module { };
export { ODataV4Service };
