import { FormBlockModule } from './form-block.module';

describe('FormBlockModule', () => {
  let formBlockModule: FormBlockModule;

  beforeEach(() => {
    formBlockModule = new FormBlockModule();
  });

  it('should create an instance', () => {
    expect(formBlockModule).toBeTruthy();
  });
});
