import { appStrings } from "../loc/strings";

export enum ListViews {
    all = 0,
    active = 1,
    completed = 2
}



export enum ListStatus {
    ok,
    err,
    inputErr
}

export interface ListStatusDetails {
    status: ListStatus;
    msg: string;
}

export interface TodoState{
    status: ListStatus,
    loading: boolean,
    msg: string,
    //queried: boolean
}