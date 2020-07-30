import React from 'react';
import { Task } from '../../modules/task';
import { TaskLineComp } from "./TaskLineComp";

import "./style.scss"
import { TodoAction } from '../../hooks/TodoActionsReducer';



export function TaskListComp({ tasksFiltered, action }: { tasksFiltered: Task[], action( action: TodoAction): void }) {
    return (
        <div>
            <ul className="taskLine">
                {tasksFiltered.map((task) => { return (<TaskLineComp key={`task-id-${task.id}`} {...{ task: task, action: action  }} />); })}
            </ul>
        </div>
    );

}