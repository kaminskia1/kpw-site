import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';
import { HttpClient } from '@angular/common/http';
import { ContentBlocksService } from './content-blocks.service';
import { Observable, of } from "rxjs";
import { ContentBlockModel } from "../../models/link-item/content-block.model";

describe('ContentBlocksService', () => {
  let service: ContentBlocksService;
  let mockHttpClient: HttpClient;

  beforeEach(() => {
    mockHttpClient = instance(mock(HttpClient));
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: mockHttpClient },
      ],
    });
    service = TestBed.inject(ContentBlocksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getContentBlocks', () => {
    let expected: ContentBlockModel[];
    let actual: Observable<ContentBlockModel[]>;

    beforeEach(() => {
      expected = [];
      spyOn(mockHttpClient, 'get').and.returnValue(of(expected));
      actual = service.getContentBlocks();
    });

    it('should return an observable of ContentBlockModel[]', () => {
      expect(actual).toEqual(jasmine.any(Observable));
      actual.subscribe((result: ContentBlockModel[]) => {
        expect(result).toEqual(expected);
      });
    });
  });
});
