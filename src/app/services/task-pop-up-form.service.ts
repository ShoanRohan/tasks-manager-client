import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TaskItem } from '../models/TaskItem';

@Injectable({
  providedIn: 'root'
})
export class TaskPopUpFormService {

  private taskToEditSubject = new BehaviorSubject<TaskItem | null>(null);
  taskToEdit$ = this.taskToEditSubject.asObservable();

  private modalVisibilitySubject = new BehaviorSubject<boolean>(false);
  modalVisibility$ = this.modalVisibilitySubject.asObservable();

  openModal(task: TaskItem | null = null) {
    this.taskToEditSubject.next(task);
    this.modalVisibilitySubject.next(true);
  }

  closeModal() {
    this.modalVisibilitySubject.next(false);
  }
}
