import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() { }

  public getState<T>(stateKey: string): T | null {
    const stateString = window.localStorage.getItem(stateKey);

    if (!!stateString) {
      return JSON.parse(stateString) as T;
    }
    return null
  }

  public saveState<T>(state: T, stateKey: string): void {
    localStorage.setItem(stateKey, JSON.stringify(state));
  }

  public datesMatch(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  }
}
