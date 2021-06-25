import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../model/Category';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  // url = 'assets/mock/categories.json';
  url = 'http://localhost:3300/categories';
  allCategories: Category[] = [];

  constructor(private http: HttpClient) {
  }

  getCategoriesFromBack(): Observable<any> {
    return this.http.get(this.url)
      .pipe(map(categories => this.allCategories = categories as Category[]));
  }

  getAllCategories(): Category[] {
    return this.allCategories;
  }

  filterCategories(title: string) {
    this.allCategories = this.allCategories.filter(
      cat => cat.title.toUpperCase().includes(title.toUpperCase()))
      .sort((c1, c2) => c1.title.localeCompare(c2.title));
    return this.allCategories;
  }

  search(title: string): Category[] {
    return this.filterCategories(title);
  }

  addCategory(category: Category) {
    return this.http.post(this.url, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}/delete`);
  }

  updateCategory(id: number, category: Category): Observable<any> {
    return this.http.patch(`${this.url}/${id}/update`, category);
  }

}
