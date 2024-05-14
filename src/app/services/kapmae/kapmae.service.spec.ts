import { TestBed } from '@angular/core/testing';

import { KapmaeService } from './kapmae.service';

describe('KapmaeService', () => {
  let service: KapmaeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KapmaeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
