import React, { useContext } from 'react';

import { appStrings } from "../../loc/strings";
import { Task } from '../../modules/task';
import { ListViews } from '../../modules/list';
import { TasksDataProvider } from '../../modules/TasksDataProvider';
import loadingGif from "../../assets/horizontal-loader.gif";
import { TodoListContext } from '../page/AppComp';
import { TodoActionsReducer, TodoAction } from '../../hooks/TodoActionsReducer';


export function TaskListToolbarComp({ tasks, view, actions, loading }: { tasks: Task[], view: ListViews, actions(action: TodoAction): void, loading: boolean }) {
    let doneTasks: number = TasksDataProvider.viewResults(ListViews.completed, tasks).length;
    const todoTasks = useContext(TodoListContext);

    return (
        <div className="taskToolbar">
            <div className={`taskListStatus ${loading ? `loadingGif` : ``}`}> {loading ? <img src={loadingGif} /> : taskStats(todoTasks, view)}</div>
            <div className="taskListViews">
                <button className={view === ListViews.all ? "active" : ""} onClick={() => actions({ payload: ListViews.all, type: TodoActionsReducer.changeView },)}>
                    {appStrings.allTasksView}
                </button>
                <button className={view === ListViews.active ? "active" : ""} onClick={() => actions({ payload: ListViews.active, type: TodoActionsReducer.changeView })}>
                    {appStrings.activeTaskView}
                </button>
                <button className={view === ListViews.completed ? "active" : ""} onClick={() => actions({ payload: ListViews.completed, type: TodoActionsReducer.changeView })}>
                    {appStrings.completedTaskView}
                </button>
            </div>
            <div className="taskListClear">
                <button
                    onClick={() => actions({ payload: null, type: TodoActionsReducer.refresh })}>
                    {`${appStrings.refresh} `}
                </button>
                <button
                    disabled={doneTasks > 0 ? false : true}
                    onClick={() => actions({ payload: ListViews.completed, type: TodoActionsReducer.clearDone })}>
                    {`${appStrings.clearCompleted} ${doneTasks > 0 ? `(${doneTasks})` : ``}`}
                </button>
            </div>
        </div>
    );
}

function taskStats(tasks: Task[], view: ListViews) {
    switch (view) {
        case (ListViews.all):
            return pendingTask(tasks) > 0 ?
                (<span> {`${pendingTask(tasks)} ${appStrings.leftTask} ${appStrings.task}`}</span>) :
                (<span> {`${appStrings.allTasksView} ${appStrings.task} ${appStrings.completed}`}</span>);

        case (ListViews.active):
            return (<span> {`${TasksDataProvider.viewResults(view, tasks).length} active ${appStrings.task}`}</span>);

        case (ListViews.completed):
            return (<span> {`${TasksDataProvider.viewResults(view, tasks).length} completed ${appStrings.task}`}</span>);
    }
}

/** Returns the number of pending tasks for the current collection of tasks */
function pendingTask(tasks: Task[]) {
    return TasksDataProvider.viewResults(ListViews.active, tasks).length;
}