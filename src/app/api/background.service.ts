import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";

export interface backgroundUrlObject {
  url: string,
  location: string
}

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {

  private url = 'https://kaminski.pw/api/backgroundUrl'


  constructor(private http: HttpClient) {
  }

  getBackgroundUrl(): Observable<backgroundUrlObject> {
    return this.http.get<backgroundUrlObject>(this.url, {responseType: 'json'});
  }

  getBackgroundImage(url: string): Observable<Blob> {
    return this.http.get(url, {responseType: 'blob'})
  }


}
