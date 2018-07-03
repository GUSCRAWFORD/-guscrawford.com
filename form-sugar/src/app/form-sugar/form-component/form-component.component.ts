import { FormBlockService, FormBuilder, FormControl, FormController } from '../form-block.service';

export class AbstractFormComponent {

  constructor(formSurgar:FormBlockService, formBuilder:FormBuilder) {
    this.formController = new FormController(formBuilder);
  }
  formController:FormController;

}
