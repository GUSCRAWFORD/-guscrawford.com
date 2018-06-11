import { TestBed, inject } from '@angular/core/testing';

import { ODataV4Service } from './odata-v4.service';

describe('ODataV4Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ODataV4Service]
    });
  });

  it('should be created', inject([ODataV4Service], (service: ODataV4Service) => {
    expect(service).toBeTruthy();
  }));
});
