import React from 'react';
import { Task } from '../../modules/task';
import { TaskLineComp } from "./TaskLineComp";

import "./style.scss"
import { ListActions } from '../../modules/list';

interface Actions {
    toogleTask(taskId: number, action: ListActions): void;
    deleteTask(taskId: number, action: ListActions): void;
}


export function TaskListComp({ tasksFiltered, action, children }: { tasksFiltered: Task[], action(taskId: number, action: ListActions): void , children:any}) {
    return (
        <div>
            {children}
            
        </div>
    );

}