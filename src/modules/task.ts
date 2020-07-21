export enum TaskStatus {
    done,
    pending
}

export interface Task {
    name: string;
    status: TaskStatus;
    id: number;    
}

