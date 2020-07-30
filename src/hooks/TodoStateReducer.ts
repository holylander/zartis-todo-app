
import { ListStatus, TodoState } from '../modules/list';


export enum TodoStateReducerActions {
    fetch,
    success,
    error,
    inputError
}

export const todoStateInit: TodoState = {
    status: ListStatus.ok,
    loading: true,
    msg: ""
}

/** Updates the list state */
export function TodoStateReducer(state: TodoState, action: { payload?: any, type: TodoStateReducerActions }) {
    switch (action.type) {
        case TodoStateReducerActions.fetch:
            return { ...state, queried: true, loading: true, };
        case TodoStateReducerActions.success:
            return { ...state, queried: false, loading: false, status: ListStatus.ok, msg: action.payload };
        case TodoStateReducerActions.error:
            return { ...state, queried: false, loading: false, status: ListStatus.err, msg: action.payload };
        case TodoStateReducerActions.inputError:
            return { ...state, queried: false, loading: false, status: ListStatus.inputErr, msg: action.payload };

        default:
            return state;
    }
};