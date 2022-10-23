import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';
import { HttpClient } from '@angular/common/http';
import { BackgroundService } from './background.service';
import { Observable, of } from "rxjs";
import { BackgroundLinkModel } from "../../models/background-url/background-link.model";

describe('BackgroundService', () => {
  let service: BackgroundService;
  let mockHttpClient: HttpClient;

  beforeEach(() => {
    mockHttpClient = instance(mock(HttpClient));
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: mockHttpClient },
      ],
    });
    service = TestBed.inject(BackgroundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getBackgroundUrl', () => {
    let expected: BackgroundLinkModel;
    let actual: Observable<BackgroundLinkModel>;

    beforeEach(() => {
      expected = {
        url: 'https://www.example.com',
        location: 'Los Angeles, CA',
      };
      spyOn(mockHttpClient, 'get').and.returnValue(of(expected));
      actual = service.getBackgroundUrl();
    });

    it('should return an observable of BackgroundLinkModel', () => {
      expect(actual).toEqual(jasmine.any(Observable));
      actual.subscribe((result: BackgroundLinkModel) => {
        expect(result).toEqual(expected);
      });
    });
  });

  describe('getBackgroundImage', () => {
    let expected: Blob;
    let actual: Observable<Blob>;

    beforeEach(() => {
      expected = new Blob();
      spyOn(mockHttpClient, 'get').and.returnValue(of(expected));
      actual = service.getBackgroundImage('https://www.example.com');
    });

    it('should return an observable of Blob', () => {
      expect(actual).toEqual(jasmine.any(Observable));
      actual.subscribe((result: Blob) => {
        expect(result).toEqual(expected);
      });
    });
  });
});
