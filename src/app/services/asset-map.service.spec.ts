import { TestBed, inject } from '@angular/core/testing';

import { AssetMapService } from './asset-map.service';

describe('AssetMapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssetMapService]
    });
  });

  it('should be created', inject([AssetMapService], (service: AssetMapService) => {
    expect(service).toBeTruthy();
  }));
});
