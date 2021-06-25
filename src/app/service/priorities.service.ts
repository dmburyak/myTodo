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

  // url = 'assets/mock/priorities.json';
  url = 'http://localhost:3300/priorities';
  allPriorities: Priority[] = [];

  constructor(private http: HttpClient) {
  }

  getPrioritiesFromBack(): Observable<any> {
    return this.http.get(`${this.url}`)
      .pipe(map((priorities => this.allPriorities = priorities as Priority[])));
  }

  getAllPriorities(): Priority[] {
      return this.allPriorities;
  }

  addPriority(priority: Priority) {
    return this.http.post(this.url, priority);
  }

  deletePriority(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}/delete`);
  }

  updatePriority(id: number, priority: Priority): Observable<any> {
    return this.http.patch(`${this.url}/${id}/update`, priority);
  }

}
