import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskItem } from '../models/TaskItem';


@Injectable({
  providedIn: 'root'
})

export class TasksApiService {

  private apiUrl = environment.apiUrl + '/Tasks';

   priorities = ['נמוכה', 'בינונית', 'גבוהה']; /// לסדר 
   statuses = ['ממתינה', 'בתהליך', 'הושלמה'];

  constructor(private http: HttpClient) { }

  getTasks():Observable< TaskItem[]> {
    return this.http.get<TaskItem[]>(this.apiUrl);
  }

  createTask(task: TaskItem): Observable<TaskItem> {
    return this.http.post<TaskItem>(this.apiUrl, task);
  }
  
  updateTask(task: TaskItem): Observable<TaskItem> {
    return this.http.put<TaskItem>(`${this.apiUrl}/${task.id}`, task);
  }
  
     deleteTask(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
  
}
