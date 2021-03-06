import { Component, OnInit } from '@angular/core';
import { Task } from './model/Task';
import { Category } from './model/Category';
import { Priority } from './model/Priority';
import { IntroService } from './service/intro.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { concatMap, map, switchMap } from 'rxjs/operators';
import { CategoriesService } from './service/categories.service';
import { PrioritiesService } from './service/priorities.service';
import { TasksService } from './service/tasks.service';
import { of, zip } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styles: []
})

export class AppComponent implements OnInit {

  categoryMap = new Map<Category, number>();

  tasks: Task[] = [];
  categories: Category[] = [];
  priorities: Priority[] = [];

  totalTasksCountInCategory = 0;
  completedCountInCategory = 0;
  uncompletedCountInCategory = 0;
  uncompletedTotalTasksCount = 0;

  showStat = true;

  selectedCategory: Category | null = null;

  searchTaskText = '';
  searchCategoryText = '';

  priorityFilter!: Priority;
  statusFilter!: boolean;

  menuOpened!: boolean;
  menuMode!: 'over' | 'push' | 'slide';
  menuPosition!: 'start' | 'end' | 'left' | 'right' | 'top' | 'bottom';
  showBackdrop!: boolean;

  isMobile: boolean;
  isTablet: boolean;


  constructor(
    private categoriesService: CategoriesService,
    private prioritiesService: PrioritiesService,
    private tasksService: TasksService,
   // private dataHandler: DataHandlerService,
    private introService: IntroService,
    private deviceService: DeviceDetectorService
  ) {

    this.isMobile = deviceService.isMobile();
    this.isTablet = deviceService.isTablet();

    this.showStat = !this.isMobile;

    this.setMenuValues();

  }

  ngOnInit() {

    const getDataFromBackend = zip(
      this.tasksService.getTasksFromBack(),
      this.categoriesService.getCategoriesFromBack(),
      this.prioritiesService.getPrioritiesFromBack()
    );

    getDataFromBackend.subscribe(data => {
      this.tasks = data[0];
      this.categories = data[1];
      this.priorities = data[2];

      this.fillCategories();
    })

    if (!this.isMobile && !this.isTablet) {
      this.introService.startIntroJS(true);
    }


  }

  onAddCategory(title: string): void {
    this.categoriesService.addCategory(new Category(title))
      .pipe(switchMap(data => this.categoriesService.getCategoriesFromBack()))
      .subscribe(categories => {
        this.categories = categories;
        this.onSearchCategory(this.searchCategoryText);
      })
  }

  fillCategories() {

    if (this.categoryMap) {
      this.categoryMap.clear();
    }

    this.categories = this.categories.sort((a, b) => a.title.localeCompare(b.title));

    this.categories.forEach(cat => {
        let count = this.tasksService.getUncompletedCountInCategory(cat);
        this.categoryMap.set(cat, count);
      }
    );

    this.updateStat();

  }

  onSearchCategory(title: string): void {
    this.searchCategoryText = title;
    this.categories = this.categoriesService.search(title);
    this.fillCategories();
  }

  onSelectCategory(category: Category | null): void {
    this.selectedCategory = category;
    this.updateTasksAndStat();

    if (this.isMobile) {
      this.menuOpened = false;
    }

  }

  onDeleteCategory(category: Category) {
    this.categoriesService.deleteCategory(category.id)
      .pipe(switchMap(data => this.categoriesService.getCategoriesFromBack()))
      .subscribe(categories => {
        this.selectedCategory = null;
        this.categories = categories;
        this.onSearchCategory(this.searchCategoryText);
      })
  }

  onUpdateCategory(category: Category): void {
    this.categoriesService.updateCategory(category.id, category)
      .pipe(switchMap(data => this.categoriesService.getCategoriesFromBack()))
      .subscribe(categories => {
        this.categories = categories;
        this.onSearchCategory(this.searchCategoryText);
      })
  }

  onUpdateTask(task: Task): void {

    this.tasksService.updateTask(task.id, task)
      .pipe(switchMap(data => this.tasksService.getTasksFromBack()))
      .subscribe(tasks => {
        this.updateTasks();
        this.fillCategories();
    });

  }

  onDeleteTask(task: Task) {

    this.tasksService.deleteTask(task.id)
      .pipe(switchMap(data => this.tasksService.getTasksFromBack()))
      .subscribe(tasks => {
        this.updateTasks();
        this.fillCategories();
      });
    }

  onSearchTasks(searchString: string): void {
    this.searchTaskText = searchString;
    this.updateTasks();
  }

  onFilterTasksByStatus(status: boolean): void {
    this.statusFilter = status;
    this.updateTasks();
  }

  onFilterTasksByPriority(priority: Priority): void {
    this.priorityFilter = priority;
    this.updateTasks();
  }

  updateTasks(): void {
    this.tasks = this.tasksService.search(
      this.selectedCategory,
      this.searchTaskText,
      this.statusFilter,
      this.priorityFilter
    );
  }

  onAddTask(task: Task) {
    this.tasksService.addTask(task)
      .pipe(switchMap(() => this.tasksService.getTasksFromBack()))
      .subscribe(() => {
        this.updateTasks();
        this.fillCategories();
      })
  }

  updateTasksAndStat(): void {

    this.updateTasks();
    this.updateStat();

  }

  updateStat(): void {

    this.totalTasksCountInCategory = this.tasksService.getTotalCountInCategory(this.selectedCategory);
    this.completedCountInCategory = this.tasksService.getCompletedCountInCategory(this.selectedCategory);
    this.uncompletedCountInCategory = this.tasksService.getUncompletedCountInCategory(this.selectedCategory);
    this.uncompletedTotalTasksCount = this.tasksService.getUncompletedCountInCategory(null);
  }

  toggleStat(showStat: boolean): void {
    this.showStat = showStat;
  }

  onClosedMenu() {
    this.menuOpened = false;
  }

  setMenuValues() {

    this.menuPosition = 'left';

    if (this.isMobile) {
      this.menuOpened = false;
      this.menuMode = 'over';
      this.showBackdrop = true;
    } else {
      this.menuOpened = true;
      this.menuMode = 'push';
      this.showBackdrop = false;
    }

  }

  toggleMenu() {
    this.menuOpened = !this.menuOpened;
  }

}
