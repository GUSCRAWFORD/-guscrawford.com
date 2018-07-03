import { FormSugarModule } from './form-sugar.module';

describe('FormBlockModule', () => {
  let formBlockModule: FormSugarModule;

  beforeEach(() => {
    formBlockModule = new FormSugarModule();
  });

  it('should create an instance', () => {
    expect(formBlockModule).toBeTruthy();
  });
});
