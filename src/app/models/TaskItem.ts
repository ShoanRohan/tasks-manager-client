export interface TaskItem {
    id:number;
    title: string;       // חובה
    description?: string; // אופציונלי
    priority: Priority;
    dueDate: Date;       // חובה
    status:Status;
}

export enum Priority {
    Low = 'נמוכה',
    Medium = 'בינונית',
    High = 'גבוהה'
}

export enum Status {
    Pending = 'ממתינה', 
    InProgress = 'בתהליך',
    Completed = 'הושלמה'    
}