import React from 'react';

import { appStrings } from "../../loc/strings";
import { Task, TaskStatus } from '../../modules/task';
import { ListViews, ListActions } from '../../modules/list';
import { TasksDataProvider } from '../../modules/TasksDataProvider';
import loadingGif from "../../assets/horizontal-loader.gif";

interface Actions {
    udpateView(view: ListViews, action: ListActions): void;
    clearDone(view: ListViews, action: ListActions): void;
}

export function TaskListToolbarComp({ tasks, view, actions, loading }: { tasks: Task[], view: ListViews, actions: Actions, loading: boolean }) {
    let doneTasks: number = TasksDataProvider.viewResults(ListViews.completed, tasks).length
    return (
        <div className="taskToolbar">
            <div className={`taskListStatus ${loading ? `loadingGif` : ``}`}> {loading ? <img src={loadingGif} /> : taskStats(tasks, view)}</div>
            <div className="taskListViews">
                <button className={view === ListViews.all ? "active" : ""} onClick={() => actions.udpateView(ListViews.all, ListActions.changeView)}>
                    {appStrings.allTasksView}
                </button>
                <button className={view === ListViews.active ? "active" : ""} onClick={() => actions.udpateView(ListViews.active, ListActions.changeView)}>
                    {appStrings.activeTaskView}
                </button>
                <button className={view === ListViews.completed ? "active" : ""} onClick={() => actions.udpateView(ListViews.completed, ListActions.changeView)}>
                    {appStrings.completedTaskView}
                </button>
            </div>
            <div className="taskListClear">
                <button
                    disabled={doneTasks > 0 ? false : true}
                    onClick={() => actions.clearDone(ListViews.completed, ListActions.clearDone)}>
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