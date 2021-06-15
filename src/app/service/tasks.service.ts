import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Task } from '../model/Task';
import { Category } from '../model/Category';
import { Priority } from '../model/Priority';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  url = 'assets/mock/tasks.json';
  allTasks: Task[] = [];

  constructor(private http: HttpClient) {
  }

  searchTasks(category: Category | null, searchText: string, status: boolean, priority: Priority): Observable<Task[]> {
    return this.search(category, searchText, status, priority);
  }

  search(category: Category | null, searchText: string, status: boolean, priority: Priority): Observable<Task[]> {

    if (this.allTasks.length > 0) {
      return of(this.filterTasks(category, searchText, status, priority));
    } else {
      return this.http.get(this.url).pipe(map(tasks => {
        this.allTasks = tasks as Task[];
        return this.filterTasks(category, searchText, status, priority);
      }))
    }
  }

  private filterTasks(category: Category | null, searchText: string, status: boolean, priority: Priority): Task[] {

    let filteredTasks = this.allTasks;

    // поочереди применяем все условия (какие не пустые)
    if (status != null) {
      filteredTasks = filteredTasks.filter(task => task.completed === status);
    }

    if (category != null) {
      filteredTasks = filteredTasks.filter(task => task.category.title === category.title);
    }

    if (priority != null) {
      filteredTasks = filteredTasks.filter(task => task.priority === priority);
    }

    if (searchText != null) {
      filteredTasks = filteredTasks.filter(
        task =>
          task.title.toUpperCase().includes(searchText.toUpperCase()) // учитываем текст поиска (если '' - возвращаются все значения)
      );

    }

    return filteredTasks;
  }

  // кол-во завершенных задач в заданной категории (если category === null, то для всех категорий)
  getCompletedCountInCategory(category: Category | null): Observable<number> {
    return this.search(category, null, true, null)
      .pipe(map(tasks => tasks.length));
  }

  // кол-во незавершенных задач в заданной категории (если category === null, то для всех категорий)
  getUncompletedCountInCategory(category: Category | null): Observable<number> {
    return this.searchTasks(category, null, false, null)
      .pipe(map(tasks => tasks.length));
  }

  // кол-во всех задач в заданной категории (если category === null, то для всех категорий)
  getTotalCountInCategory(category: Category | null): Observable<number> {
    return this.searchTasks(category, null, null, null)
      .pipe(map(tasks => tasks.length));
  }

}
