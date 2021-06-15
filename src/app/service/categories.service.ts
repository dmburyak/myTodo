import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../model/Category';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  url = 'assets/mock/categories.json';
  allCategories: Category[] = [];

  constructor(private http: HttpClient) {
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get(this.url) as Observable<Category[]>;
  }

  filterCategories(title: string) {
    this.allCategories = this.allCategories.filter(
      cat => cat.title.toUpperCase().includes(title.toUpperCase()))
      .sort((c1, c2) => c1.title.localeCompare(c2.title));
    return this.allCategories;
  }

  search(title: string): Observable<Category[]> {

    if (this.allCategories.length > 0) {
      return of(this.filterCategories(title));
    } else {
      return this.getAllCategories().pipe(
        map(categories => {
        this.allCategories = categories as Category[];
        return this.filterCategories(title);
      }));
    }


  }

}
