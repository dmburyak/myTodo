import { Injectable } from '@angular/core';
import { Observable, zip } from 'rxjs';

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


  getAllTasks(): Task[] {
    return this.tasksService.getAllTasks();
  }

  addTask(task: Task): Observable<Task> {
    return this.taskDaoArray.add(task);
  }

  deleteTask(id: number): Observable<Task> {
    return this.taskDaoArray.delete(id);
  }

  updateTask(task: Task): Observable<Task> {
    return this.taskDaoArray.update(task);
  }

  searchTasks(category: Category | null, searchText: string, status: boolean, priority: Priority): Task[] {
    return this.tasksService.search(category, searchText, status, priority);
  }
/*
  getCompletedCountInCategory(category: Category | null): number {
    return this.tasksService.getCompletedCountInCategory(category);
  }

  getUncompletedTotalCount(): number {
    return this.tasksService.getUncompletedCountInCategory(null);
  }

  getUncompletedCountInCategory(category: Category | null): number {
    return this.tasksService.getUncompletedCountInCategory(category);
  }

  getTotalCountInCategory(category: Category | null): number {
    return this.tasksService.getTotalCountInCategory(category);
  }
*/
// getTotalCount(): Observable<number> {
//   return this.taskDaoArray.getTotalCount();
// }

  // addCategory(title: string): Observable<Category> {
  //   return this.categoryDaoArray.add(new Category(null, title));
  // }

  /*
  getCategoriesFromBackend(): Observable<any> {
  return this.categoriesService.getCategoriesFromBack();
  }

  addCategory(title: string): Observable<any> {
    return this.categoriesService.addCategory(new Category(title));
    }
*/

  getAllCategories(): Category[] {
    return this.categoriesService.getAllCategories();
  }

  searchCategories(title: string): Category[] {
    return this.categoriesService.search(title);
  }

  updateCategory(category: Category): Observable<Category> {
    return this.categoryDaoArray.update(category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.categoriesService.deleteCategory(id);
  }


// Priorities

  getAllPriorities(): Priority[] {
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
