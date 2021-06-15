import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../model/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  url = 'assets/mock/categories.json';

  constructor(private http: HttpClient) {
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get(`${this.url}`) as Observable<Category[]>;
  }

}
