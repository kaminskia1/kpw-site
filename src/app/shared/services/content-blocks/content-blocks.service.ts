import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ContentBlockModel } from '../../models/link-item/content-block.model';

@Injectable({
  providedIn: 'root',
})
export class ContentBlocksService {
  http: HttpClient;

  route: string = `${environment.api}/content-blocks`;

  constructor(http: HttpClient) {
    this.http = http;
  }

  getContentBlocks(): Observable<ContentBlockModel[]> {
    return this.http.get<ContentBlockModel[]>(this.route, { responseType: 'json' });
  }
}
