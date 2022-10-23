import { TestBed } from '@angular/core/testing';
import { FileReaderService } from "./file-reader.service";
import { InjectionToken } from "@angular/core";

const FILE_READER_SERVICE_TOKEN = new InjectionToken<FileReader>('FileReaderService');
const FILE_READER_SERVICE = [ { provide: FILE_READER_SERVICE_TOKEN, useFactory: FileReader } ];

describe('FileReaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: FILE_READER_SERVICE,
    });
  });

  it('should be created', () => {
    const service: FileReader = TestBed.inject<FileReader>(FileReaderService);
    expect(service).toBeTruthy();
  });
});
