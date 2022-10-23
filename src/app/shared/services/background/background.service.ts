import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BackgroundLinkModel } from '../../models/background-url/background-link.model';

@Injectable({
  providedIn: 'root',
})
export class BackgroundService {
  http: HttpClient;

  route: string = `${environment.api}/background-url`;

  constructor(http: HttpClient) {
    this.http = http;
  }

  getBackgroundUrl(lastLocation: string = ''): Observable<BackgroundLinkModel> {
    return this.http.get<BackgroundLinkModel>(this.route, { params: { lastLocation }, responseType: 'json' });
  }

  getBackgroundImage(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }
}
