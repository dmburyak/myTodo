import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
// import {DataHandlerService} from '../../service/data-handler.service';
import {Priority} from '../../model/Priority';
import { PrioritiesService } from '../../service/priorities.service';
import { TasksService } from '../../service/tasks.service';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-settings-dialog',
    templateUrl: './settings-dialog.component.html',
    styleUrls: ['./settings-dialog.component.css']
})

// диалоговое окно настроек приложения
// т.к. настройки не привязаны к другим компонентам (окнам),
// то он самостоятельно может загружать нужные данные с помощью dataHandler (а не получать их с помощью @Input)

export class SettingsDialogComponent implements OnInit {

    priorities: Priority[];

    constructor(
        private dialogRef: MatDialogRef<SettingsDialogComponent>, // для возможности работы с текущим диалог. окном
     //   private dataHandler: DataHandlerService, // ссылка на сервис для работы с данными
        private prioritiesService: PrioritiesService,
        private tasksService: TasksService,
    ) {
    }

    ngOnInit() {
        // получаем все значения, чтобы отобразить настроку цветов
      this.priorities = this.prioritiesService.getAllPriorities()
    }

    // нажали Закрыть
    onClose() {

        this.dialogRef.close(false);

    }


    // т.к. мы меняем значения в массивах, то изменения сразу отражаются на списке задач (не требуется доп. обновления)

    // добавили приоритет
    onAddPriority(priority: Priority): void {
        this.prioritiesService.addPriority(priority).subscribe();
    }

    // удалили приоритет
    onDeletePriority(priority: Priority): void {
        this.prioritiesService.deletePriority(priority.id).subscribe();
    }

    // обновили приоритет
    onUpdatePriority(priority: Priority): void {
        this.prioritiesService.updatePriority(priority.id, priority)
          .pipe(switchMap(data => this.tasksService.getTasksFromBack()))
          .subscribe();

    }

}
