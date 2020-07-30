import React from "react";
import { Task, TaskStatus } from '../../modules/task';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import "./style.scss"
import { TodoAction, TodoActionsReducer } from "../../hooks/TodoActionsReducer";

export function TaskLineComp({ task, action }: { task: Task, action(action: TodoAction): void }) {
    return (
        <li className={task.status === TaskStatus.done ? "done" : ""}>
            <div className="taskStatus" onClick={() => action({ payload: task.id, type: TodoActionsReducer.toogle },)}>{taskStatusIcon(task.status)}</div>
            <div className="taskName unselectable">{task.name}</div>
            <div className="taskDelete" onClick={() => action({ payload: task.id, type: TodoActionsReducer.delete },)}><FontAwesomeIcon icon={faTimesCircle} className="greyColor" /></div>
        </li>
    );
}


function taskStatusIcon(status: TaskStatus) {
    switch (status) {
        case TaskStatus.done:
            return <FontAwesomeIcon icon={faCheckCircle} className="corpColor2" />
        case TaskStatus.pending:
            return <FontAwesomeIcon icon={faCircleNotch} className="corpColor2" />
    }
}