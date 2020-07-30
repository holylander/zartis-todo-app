import React, { useState, useEffect, createContext, useReducer } from "react";
import { TitleComp } from "./TitleComp";
import { StatusComp } from "./StatusComp";
import { appStrings } from "../../loc/strings";
import { Task } from "../../modules/task";
import {  ListViews, ListStatus } from "../../modules/list";
import { TasksDataProvider } from "../../modules/TasksDataProvider";
import { TaskInputComp, TaskListComp, TaskListToolbarComp } from "../tasks";
import { useTodoActionsReducer, TodoActionsReducer} from "../../hooks/TodoActionsReducer";


import "./style.scss"
import "../../style/general.scss"
import logo from "../../assets/zartis-logo.png"
import { TodoStateReducerActions } from "../../hooks/TodoStateReducer";

export const TodoListContext = createContext([]);

export function AppComp() {

  const [todoTasks, todoStatus, todoCurrentView, performTodoAction, todoStatusDispatch] = useTodoActionsReducer();


  /** updates or removes the current error status on the app */
  const updateErr = (error: string): void => {
    error?
      todoStatusDispatch({type: TodoStateReducerActions.inputError ,payload:error}):
      todoStatusDispatch({type: TodoStateReducerActions.success ,payload:""});    
  }

  /** connect to api once component is mounted */
  useEffect(()=>{
    performTodoAction({type:TodoActionsReducer.init});
  },[]);

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






