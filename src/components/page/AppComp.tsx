import React, { useState, useEffect, createContext, useReducer } from "react";
import { TitleComp } from "./TitleComp";
import { StatusComp } from "./StatusComp";
import { appStrings } from "../../loc/strings";
import { ListStatus } from "../../modules/list";
import { TasksDataProvider } from "../../modules/TasksDataProvider";
import { TaskInputComp, TaskListComp, TaskListToolbarComp } from "../tasks";
import { useTodoActionsReducer, TodoActionsReducer } from "../../hooks/TodoActionsReducer";


import "./style.scss"
import "../../style/general.scss"
import logo from "../../assets/zartis-logo.png"
import { TodoStateReducerActions } from "../../hooks/TodoStateReducer";

/** tasks context object */
export const TodoListContext = createContext([]);

export function AppComp() {

  const [todoTasks, todoStatus, todoCurrentView, performTodoAction, todoStatusDispatch] = useTodoActionsReducer();


  /** updates or removes the current error status on the app */
  const updateErr = (error: string): void => {
    if (error) {
      todoStatusDispatch({ type: TodoStateReducerActions.inputError, payload: error });
    }
    if (!error && todoStatus.Status !== ListStatus.ok)
      todoStatusDispatch({ type: TodoStateReducerActions.success, payload: "Valid string at input" });
  }

  /** connect to api once component is mounted */
  useEffect(() => {
    performTodoAction({ type: TodoActionsReducer.init });
  }, []);

  /** log any action result on console */
  useEffect(() => {
    console.debug(`${todoStatus.status === ListStatus.ok ? "OK: " : "ERROR: "} ${todoStatus.msg}`);
  }, [todoStatus.msg]);

  return (
    <div className="ZartisApp">
      <TodoListContext.Provider value={todoTasks}>
        <div className="App-header">
          <TitleComp title={appStrings.appTitle} logo={logo} />
          <StatusComp listStatus={{ status: todoStatus.status, msg: todoStatus.msg }} />
        </div>
        <div className="App-body">
          <TaskInputComp submitErr={updateErr} saveInput={performTodoAction} disable={todoStatus.loading} />
          <TaskListComp
            tasksFiltered={TasksDataProvider.viewResults(todoCurrentView, todoTasks)}
            action={performTodoAction} />
          <TaskListToolbarComp
            view={todoCurrentView}
            tasks={todoTasks}
            actions={performTodoAction}
            loading={todoStatus.loading} />
        </div>
      </TodoListContext.Provider>
    </div>
  );
}






