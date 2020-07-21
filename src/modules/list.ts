import {  appStrings} from "../loc/strings";

export enum ListViews {
    all,
    active,
    completed
}

export enum ListActions {
    clearDone,
    add,
    delete,
    toogle,
    changeView
}

export enum ListStatus {
    ok,
    err
}

export interface ListStatusDetails {
    status: ListStatus;
    msg: string;
}