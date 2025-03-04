import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TasksApiService } from 'src/app/services/tasks-api.service';
import { TaskItem } from 'src/app/models/TaskItem';
import { BehaviorSubject } from 'rxjs';
import { Modal } from 'bootstrap';
import { TaskPopUpFormService } from 'src/app/services/task-pop-up-form.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent {

  tasks: TaskItem[] = [];
  choosenTask?: TaskItem;

  constructor(private tasksApiService: TasksApiService, private taskPopupService: TaskPopUpFormService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasksApiService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  openTaskForm(task?: TaskItem) {
    if (task)
      this.taskPopupService.openModal(task);
    else
      this.taskPopupService.openModal();
  }

  onTaskUpdate(task: any) {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = task; 
    } else {
      this.tasks.push(task); 
    }
  }

  deleteTask(taskId: number): void {
    this.tasksApiService.deleteTask(taskId).subscribe(() => this.loadTasks());
  }

}
