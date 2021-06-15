import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../model/Category';
import { Priority } from '../model/Priority';

@Injectable({
  providedIn: 'root'
})
export class PrioritiesService {

  url = 'assets/mock/priorities.json';

  constructor(private http: HttpClient) {
  }

  getAllPriorities(): Observable<Priority[]> {
    return this.http.get(`${this.url}`) as Observable<Priority[]>;
  }

}
