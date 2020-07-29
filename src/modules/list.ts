import { appStrings } from "../loc/strings";

export enum ListViews {
    all = 0,
    active = 1,
    completed = 2
}

export enum ListActions {
    clearDone,
    add,
    delete,
    toogle,
    changeView,
    refresh
}

export enum ListStatus {
    ok,
    err
}

export interface ListStatusDetails {
    status: ListStatus;
    msg: string;
}