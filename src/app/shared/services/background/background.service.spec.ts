import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';
import { HttpClient } from '@angular/common/http';
import { BackgroundService } from './background.service';

describe('BackgroundService', () => {
  let service: BackgroundService;
  let mockHttpClient: HttpClient;

  beforeEach(() => {
    mockHttpClient = mock(HttpClient);
    TestBed.configureTestingModule({
      providers: [
        { provide: BackgroundService, useValue: instance(mockHttpClient) },
      ],
    });
    service = TestBed.inject(BackgroundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
