import { TodoStateReducer, todoStateInit, TodoStateReducerActions } from "./TodoStateReducer";
import { TodoTasksReducer, TodoTasksReducerActions, } from "./TodoTasksReducer";
import { useReducer, useState } from "react";
import { TasksDataProvider } from "../modules/TasksDataProvider";
import { ListViews } from "../modules/list";

export interface TodoAction {
    payload: any;
    type: TodoActionsReducer;
}

export enum TodoActionsReducer {
    clearDone,
    add,
    delete,
    toogle,
    changeView,
    refresh,
    init,
    load,
    error
}

export const useTodoActionsReducer = () => {
    const [todoTasks, todoTaskDispatch] = useReducer(TodoTasksReducer, []);
    const [todoStatus, todoStatusDispatch] = useReducer(TodoStateReducer, todoStateInit);
    const [todoCurrentView, setTodoCurrentView] = useState(ListViews.all);

    const performTodoAction = async (action: { payload: any, type: TodoActionsReducer }) => {
        todoStatusDispatch({ type: TodoStateReducerActions.fetch });

        switch (action.type) {
            case TodoActionsReducer.init:
                try {
                    todoTaskDispatch({ payload: await TasksDataProvider.connect(), type: TodoTasksReducerActions.save });
                    todoStatusDispatch({ payload: "Tasks data were recovered from server", type: TodoStateReducerActions.success });
                }
                catch (err) {
                    todoStatusDispatch({ payload: `Could not update the tasks from server. Error details: ${err}`, type: TodoStateReducerActions.error });
                }
                break;
            case (TodoActionsReducer.toogle):
                try {
                    await TasksDataProvider.toggleTask(action.payload);
                    todoTaskDispatch({ payload: await TasksDataProvider.retrieve(), type: TodoTasksReducerActions.save });
                    todoStatusDispatch({ payload: `Task id '${action.payload}' was toogled`, type: TodoStateReducerActions.success });
                }
                catch (err) {
                    todoStatusDispatch({ payload: `Could not change the status of the task '${action.payload}'. Error details: ${err}`, type: TodoStateReducerActions.error });
                }
                break;
            case (TodoActionsReducer.delete):
                try {
                    await TasksDataProvider.deleteTask(action.payload);
                    todoTaskDispatch({ payload: await TasksDataProvider.retrieve(), type: TodoTasksReducerActions.save });
                    todoStatusDispatch({ payload: `Task id '${action.payload}' was deleted`, type: TodoStateReducerActions.success });
                }
                catch (err) {
                    todoStatusDispatch({ payload: `Could not change the status of the task '${action.payload}'. Error details: ${err}`, type: TodoStateReducerActions.error });
                }
                break;
            case (TodoActionsReducer.add):
                try {
                    await TasksDataProvider.addTask(action.payload);
                    todoTaskDispatch({ payload: await TasksDataProvider.retrieve(), type: TodoTasksReducerActions.save });
                    todoStatusDispatch({ payload: `Task id '${action.payload}' was added`, type: TodoStateReducerActions.success });
                }
                catch (err) {
                    todoStatusDispatch({ payload: `Could not add the new task '${action.payload}'. Error details: ${err}`, type: TodoStateReducerActions.error });
                }
                break;
            case (TodoActionsReducer.clearDone):
                try {
                    todoTaskDispatch({ payload: await TasksDataProvider.clearDoneTasks(), type: TodoTasksReducerActions.save });
                    todoStatusDispatch({ payload: `All completed tasks were cleared`, type: TodoStateReducerActions.success });
                }
                catch (err) {
                    todoStatusDispatch({ payload: `Could not change to the list view '${action.payload}'. Error details: ${err}`, type: TodoStateReducerActions.error });
                }
                break;
            case (TodoActionsReducer.refresh):
                try {
                    todoTaskDispatch({ payload: await TasksDataProvider.retrieve(), type: TodoTasksReducerActions.save });
                    todoStatusDispatch({ payload: `All existing tasks were retrieved`, type: TodoStateReducerActions.success });
                }
                catch (err) {
                    todoStatusDispatch({ payload: `Could not update the tasks from server. Error details: ${err}`, type: TodoStateReducerActions.error });
                }
                break;
            case (TodoActionsReducer.changeView):
                try {
                    setTodoCurrentView(action.payload)
                    todoStatusDispatch({ payload: `List view was updated`, type: TodoStateReducerActions.success });
                }
                catch (err) {
                    todoStatusDispatch({ payload: `Could not update the list view: ${err}`, type: TodoStateReducerActions.error });
                }
                break;
        }
    }


    return [todoTasks, todoStatus, todoCurrentView, performTodoAction, todoStatusDispatch];
};