import { TestBed, inject } from '@angular/core/testing';

import { FormBlockService } from './form-block.service';

describe('FormBlockService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormBlockService]
    });
  });

  it('should be created', inject([FormBlockService], (service: FormBlockService) => {
    expect(service).toBeTruthy();
  }));
});
