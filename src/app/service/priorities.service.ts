import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Category } from '../model/Category';
import { Priority } from '../model/Priority';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrioritiesService {

  url = 'assets/mock/priorities.json';
  allPriorities: Priority[] = [];

  constructor(private http: HttpClient) {
  }

  getAllPriorities(): Observable<Priority[]> {
    if (this.allPriorities.length > 0 ) {
      return of(this.allPriorities);
    } else {
    return this.http.get(`${this.url}`)
      .pipe(map(priorities => {
        this.allPriorities = priorities as Priority[];
        return this.allPriorities;
      }));
    }
  }

}
