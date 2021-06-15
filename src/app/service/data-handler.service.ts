import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Category } from '../model/Category';
import { Priority } from '../model/Priority';
import { Task } from '../model/Task';
import { TaskDAOArray } from '../data/dao/impl/TaskDAOArray';
import { CategoryDAOArray } from '../data/dao/impl/CategoryDAOArray';
import { PriorityDAOArray } from '../data/dao/impl/PriorityDAOArray';
import { CategoriesService } from './categories.service';
import { PrioritiesService } from './priorities.service';
import { TasksService } from './tasks.service';


@Injectable({
  providedIn: 'root'
})
export class DataHandlerService {

  private taskDaoArray = new TaskDAOArray();
  private categoryDaoArray = new CategoryDAOArray();
  private priorityDaoArray = new PriorityDAOArray();

  constructor(
    private categoriesService: CategoriesService,
    private prioritiesService: PrioritiesService,
    private tasksService: TasksService
  ) {
  }

  // getAllTasks(): Observable<Task[]> {
  //   return this.taskDaoArray.getAll();
  // }

  addTask(task: Task): Observable<Task> {
    return this.taskDaoArray.add(task);
  }

  deleteTask(id: number): Observable<Task> {
    return this.taskDaoArray.delete(id);
  }

  updateTask(task: Task): Observable<Task> {
    return this.taskDaoArray.update(task);
  }

  searchTasks(category: Category | null, searchText: string, status: boolean, priority: Priority): Observable<Task[]> {
    // return this.taskDaoArray.search(category, searchText, status, priority);
    return this.tasksService.search(category, searchText, status, priority);
  }

  getCompletedCountInCategory(category: Category | null): Observable<number> {
    // return this.taskDaoArray.getCompletedCountInCategory(category);
    return this.tasksService.getCompletedCountInCategory(category);
  }

  getUncompletedTotalCount(): Observable<number> {
    // return this.taskDaoArray.getUncompletedCountInCategory(null);
    return this.tasksService.getUncompletedCountInCategory(null);
  }

  getUncompletedCountInCategory(category: Category | null): Observable<number> {
    // return this.taskDaoArray.getUncompletedCountInCategory(category);
    return this.tasksService.getUncompletedCountInCategory(category);
  }

  getTotalCountInCategory(category: Category | null): Observable<number> {
    // return this.taskDaoArray.getTotalCountInCategory(category);
    return this.tasksService.getTotalCountInCategory(category);
  }

  getTotalCount(): Observable<number> {
    return this.taskDaoArray.getTotalCount();
    // return this.tasksService.getTotalCount();
  }

  addCategory(title: string): Observable<Category> {
    return this.categoryDaoArray.add(new Category(null, title));
  }

  getAllCategories(): Observable<Category[]> {
      // return this.categoryDaoArray.getAll();
  return this.categoriesService.getAllCategories();
  }

  searchCategories(title: string): Observable<Category[]> {
    return this.categoryDaoArray.search(title);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.categoryDaoArray.update(category);
  }

  deleteCategory(id: number | null): Observable<Category> {
    return this.categoryDaoArray.delete(id);
  }


  // Priorities

  // getAllPriorities(): Observable<Priority[]> {
  //   return this.priorityDaoArray.getAll();
  // }

  getAllPriorities(): Observable<Priority[]> {
    return this.prioritiesService.getAllPriorities();
  }

  addPriority(priority: Priority): Observable<Priority> {
    return this.priorityDaoArray.add(priority);
  }

  deletePriority(id: number): Observable<Priority> {
    return this.priorityDaoArray.delete(id);
  }

  updatePriority(priority: Priority): Observable<Priority> {
    return this.priorityDaoArray.update(priority);
  }
}
