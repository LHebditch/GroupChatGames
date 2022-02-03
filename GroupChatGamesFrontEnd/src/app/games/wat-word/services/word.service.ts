import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WordService {

  constructor(private http: HttpClient) { }

  public getWord(): Observable<{ word: string }> {
    return this.http.get<{ word: string }>(`${environment.api_root}/word-of-day`);
  }
}
