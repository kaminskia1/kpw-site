import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BackgroundUrl } from '../../models/background-url/background-url.model';

@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  http: HttpClient;

  route = `${environment.api}/backgroundUrl`;

  constructor(http: HttpClient) {
    this.http = http;
  }

  getBackgroundUrl(): Observable<BackgroundUrl> {
    return this.http.get<BackgroundUrl>(this.route, { responseType: 'json' });
  }

  getBackgroundImage(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }
}
