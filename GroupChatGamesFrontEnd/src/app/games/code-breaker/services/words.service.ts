import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

export type CodeWords = {
  solution: string;
  clutter: string[];
}

@Injectable({
  providedIn: 'root'
})
export class WordsService {

  private word = 'shot';
  private wordClutter = [
    'seen',
    'food',
    'once',
    'path',
    'soak',
    'beat',
    'slat',
    'grow',
    'loan',
    'ship'
  ]

  constructor(private http: HttpClient) { }

  public getWords(): Observable<CodeWords> {
    return this.http.get<CodeWords>(`${environment.api_root}/hackitch`);
  }
}
