import { Task } from '../modules/task';

export enum TodoTasksReducerActions {
    save,
    empty
}

/** Update the tasks data state */
export const TodoTasksReducer = (state: Task[], action: { payload?: Task[], type: TodoTasksReducerActions }): any => {
    switch (action.type) {

        case (TodoTasksReducerActions.empty):
            return [];
        case (TodoTasksReducerActions.save):
            return action.payload;
        default:
            return state;
    }
}

