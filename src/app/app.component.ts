import { Component, OnInit } from '@angular/core';
import { DataHandlerService } from './service/data-handler.service';
import { Task } from './model/Task';
import { Category } from './model/Category';
import { Priority } from './model/Priority';
import { of, zip } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { IntroService } from './service/intro.service';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styles: []
})

export class AppComponent implements OnInit {

  categoryMap = new Map<Category, number>();

  tasks!: Task[];
  categories!: Category[];
  priorities!: Priority[];

  totalTasksCountInCategory!: number;
  completedCountInCategory!: number;
  uncompletedCountInCategory!: number;
  uncompletedTotalTasksCount!: number;

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
    private dataHandler: DataHandlerService,
    private introService: IntroService,
    private deviceService: DeviceDetectorService
  ) {

    this.isMobile = deviceService.isMobile();
    this.isTablet = deviceService.isTablet();

    this.showStat = !this.isMobile;

    this.setMenuValues();

  }

  ngOnInit() {

    this.dataHandler.getAllPriorities()
      .subscribe(priorities => this.priorities = priorities);

    this.dataHandler.getAllCategories()
      .subscribe(categories => {
        this.categories = categories;
        this.fillCategories();
      });

    this.onSelectCategory(null);

    if (!this.isMobile && !this.isTablet) {
      this.introService.startIntroJS(true);
    }

  }

  onAddCategory(title: string): void {
    this.dataHandler.addCategory(title)
      .subscribe(() => {
          this.onSearchCategory(this.searchCategoryText);
          this.fillCategories();
        }
      );
  }

  fillCategories() {

    if (this.categoryMap) {
      this.categoryMap.clear();
    }

    this.categories = this.categories.sort((a, b) => a.title.localeCompare(b.title));

    this.categories.forEach(cat => {
        this.dataHandler.getUncompletedCountInCategory(cat)
          .subscribe(count => {
            this.categoryMap.set(cat, count)
          });
      }
    );

  }

  onSearchCategory(title: string): void {

    this.searchCategoryText = title;

    this.dataHandler.searchCategories(title)
      .subscribe(categories => {
        this.categories = categories;
        this.fillCategories();
      });
  }

  onSelectCategory(category: Category | null): void {
    this.selectedCategory = category;
    this.updateTasksAndStat();

    if (this.isMobile) {
      this.menuOpened = false;
    }

  }

  onDeleteCategory(category: Category) {
    this.dataHandler.deleteCategory(category.id)
      .subscribe(cat => {
        this.selectedCategory = null;
        this.categoryMap.delete(cat);
        this.onSearchCategory(this.searchCategoryText);
        this.updateTasks();
      });
  }

  onUpdateCategory(category: Category): void {
    this.dataHandler.updateCategory(category)
      .subscribe(() => {
        this.onSearchCategory(this.searchCategoryText);
      });
  }

  onUpdateTask(task: Task): void {

    this.dataHandler.updateTask(task).subscribe(() => {
      this.fillCategories();
      this.updateTasksAndStat();
    });

  }

  onDeleteTask(task: Task) {

    this.dataHandler.deleteTask(task.id)
      .pipe(
        concatMap(task => {
            if (!task.category) {
              return of(({t: task, count: 0}));
            }
            return this.dataHandler.getUncompletedCountInCategory(task.category)
              .pipe(map(count => {
                return ({t: task, count});
              }))
          }
        ))
      .subscribe(result => {

        const t = result.t as Task;
        if (t.category) {
          this.categoryMap.set(t.category, result.count);
        }

        this.updateTasksAndStat();

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
    this.dataHandler.searchTasks(
      this.selectedCategory,
      this.searchTaskText,
      this.statusFilter,
      this.priorityFilter
    ).subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }

  onAddTask(task: Task) {

    this.dataHandler.addTask(task).pipe(
      concatMap(task => {
          if (!task.category) {
            return of(({t: task, count: 0}));
          }
          return this.dataHandler.getUncompletedCountInCategory(task.category)
            .pipe(map(count => {
              return ({t: task, count});
            }));
        }
      ))
      .subscribe(result => {

        const t = result.t as Task;

        if (t.category) {
          this.categoryMap.set(t.category, result.count);
        }

        this.updateTasksAndStat();

      });

  }

  updateTasksAndStat(): void {

    this.updateTasks();
    this.updateStat();

  }

  updateStat(): void {

    zip(
      this.dataHandler.getTotalCountInCategory(this.selectedCategory),
      this.dataHandler.getCompletedCountInCategory(this.selectedCategory),
      this.dataHandler.getUncompletedCountInCategory(this.selectedCategory),
      this.dataHandler.getUncompletedTotalCount())

      .subscribe(array => {
        this.totalTasksCountInCategory = array[0];
        this.completedCountInCategory = array[1];
        this.uncompletedCountInCategory = array[2];
        this.uncompletedTotalTasksCount = array[3]; // нужно для категории Все
      });
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
