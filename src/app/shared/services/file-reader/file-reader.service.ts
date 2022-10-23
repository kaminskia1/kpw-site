import { InjectionToken } from '@angular/core';

export const FileReaderService = new InjectionToken<FileReader>('FileReader', {
  factory: () => new FileReader(),
});
