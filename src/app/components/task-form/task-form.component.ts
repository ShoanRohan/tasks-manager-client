import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Modal } from 'bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { TaskItem } from 'src/app/models/TaskItem';
import { TaskPopUpFormService } from 'src/app/services/task-pop-up-form.service';
import { TasksApiService } from 'src/app/services/tasks-api.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit, OnDestroy {

  @ViewChild('taskFormModal') modalElement!: ElementRef;

  taskForm!: FormGroup;
  taskToEdit: TaskItem | null = null;
  priorities: string[] = [];
  statuses: string[] = [];
  private modal!: Modal;
  private destroy$ = new Subject<void>();

  @Output() taskUpdated = new EventEmitter<TaskItem>();

  constructor(
    private fb: FormBuilder,
    private tasksApiService: TasksApiService,
    private taskPopupService: TaskPopUpFormService, private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.priorities = this.tasksApiService.priorities;
    this.statuses = this.tasksApiService.statuses;

    this.taskForm = this.fb.group({
      title: [null, Validators.required],
      description: [''],
      priority: [null, Validators.required],
      dueDate: [null, Validators.required],
      status: ['', Validators.required]
    });

  }

  ngAfterViewInit(): void {
    this.modal = new Modal(this.modalElement.nativeElement);
    this.taskPopupService.taskToEdit$.pipe(takeUntil(this.destroy$)).subscribe(task => {

      if (task !== null) {
        this.taskToEdit = task;
         console.log(task);
        this.taskForm.patchValue(task);
      } else {
        this.taskToEdit = null;
        this.taskForm.reset();
      }
    });

    this.taskPopupService.modalVisibility$.pipe(takeUntil(this.destroy$)).subscribe(open => {
      this.toggleModal(open);
    })
  }

  private toggleModal(show: boolean): void {
    if (!this.modal) return;
    if (show) {
      this.modal.show();
    } else {
      this.modal.hide();
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    const newTask: TaskItem = {
      id: this.taskToEdit?.id || 0,
      ...this.taskForm.value
    };

    if (this.taskToEdit?.id)
      this.updateTask(newTask);

    else
      this.createTask(newTask);
  }


  createTask(newTask: TaskItem): void {
    this.tasksApiService.createTask(newTask).subscribe((task) => {
      console.log(task);
      this.taskToEdit = task;
      this.taskUpdated.emit(task); 
      this.taskPopupService.closeModal();
    }, (error) => {
      console.error(error);
    }
    );
    
  }

  updateTask(taskToEdit: TaskItem): void {
    this.tasksApiService.updateTask(taskToEdit).subscribe((task) => {
      console.log(task);
      this.taskToEdit = task;
      this.taskUpdated.emit(task); 
      this.taskPopupService.closeModal();
    });
  }

  closeModal(): void {
    this.taskPopupService.closeModal();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
