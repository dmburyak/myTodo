import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../model/Task';
import { Category } from '../model/Category';
import { Priority } from '../model/Priority';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  // url = 'assets/mock/tasks.json';
  url = 'http://localhost:3300/tasks';
  allTasks: Task[] = [];

  constructor(private http: HttpClient) {
  }

  getTasksFromBack(): Observable<any> {
    return this.http.get(this.url)
      .pipe(map(tasks => this.allTasks = tasks as Task[]));
  }

  getAllTasks(): Task[] {
    return this.allTasks;
  }

  // searchTasks(category: Category | null, searchText: string, status: boolean, priority: Priority): Observable<Task[]> {
  //  console.log('all0');
  //   return this.search(category, searchText, status, priority);
  // }

  search(category: Category | null, searchText: string, status: boolean, priority: Priority): Task[] {
    return this.filterTasks(category, searchText, status, priority);
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
      filteredTasks = filteredTasks.filter(task => task.priority.title === priority.title);
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
  getCompletedCountInCategory(category: Category | null): number {
  return this.search(category, null, true, null).length;

  }

  // кол-во незавершенных задач в заданной категории (если category === null, то для всех категорий)
  getUncompletedCountInCategory(category: Category | null): number {
    return this.search(category, null, false, null).length;
  }

  // кол-во всех задач в заданной категории (если category === null, то для всех категорий)
  getTotalCountInCategory(category: Category | null): number {
    return this.search(category, null, null, null).length;
  }

  addTask(task: Task) {
    return this.http.post(this.url, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}/delete`);
  }

  updateTask(id: number, task: Task): Observable<any> {
    return this.http.patch(`${this.url}/${id}/update`, task);
  }

}
