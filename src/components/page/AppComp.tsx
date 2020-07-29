import React, { useState, useEffect, createContext } from "react";
import { TitleComp } from "./TitleComp";
import { StatusComp } from "./StatusComp";
import { appStrings } from "../../loc/strings";
import { Task } from "../../modules/task";
import { ListStatusDetails, ListViews, ListStatus, ListActions } from "../../modules/list";
import { TasksDataProvider } from "../../modules/TasksDataProvider";
import { TaskInputComp, TaskListComp, TaskListToolbarComp } from "../tasks";

import "./style.scss"
import "../../style/general.scss"
import logo from "../../assets/zartis-logo.png"

export const TodoListContext = createContext({});

export function AppComp() {

  const [todoListTasks, setTodoListTasks] = useState([]);
  const [todoCurrentView, setTodoCurrentView] = useState(ListViews.all);
  const [todoListState, setTodoListState] = useState({
    status: ListStatus.ok,
    loading: true,
    msg: "",
  })

  /** retrieve the tasks from server */
  useEffect(() => {
    TasksDataProvider.connect()
      .then((tasks) => {
        setTodoListTasks(tasks);
        setTodoListState({
          ...todoListState,
          msg: "Tasks data fetched from server",
          loading: false,
        });
      })
      .catch((err) => {
        setTodoListState({
          ...todoListState,
          status: ListStatus.err,
          msg: err,
          loading: false
        })
      });
      console.debug(todoListState);
  }, []);

  /** update the filtered collection of tasks */
  useEffect(() => {
    console.debug(`updated currentView is '${todoCurrentView}'`);
  }, [todoCurrentView]);

  /** update the filtered collection of tasks */
  useEffect(() => {
    console.debug("Some tasks has changed");
    console.debug(todoListTasks);
    /* setTodoListTasks({
      ...todoListTasks,
    }); */
  }, [todoListTasks]);


  /** updates or removes the current error on the app */
  const updateErr = (error: string): void => {
    error ?
      setTodoListState({
        ...todoListState,
        msg: error, status: ListStatus.err, loading: false
      }) :
      setTodoListState({
        ...todoListState,
        msg: "", status: ListStatus.ok, loading: false
      });
  }


  /** performs a list action */
  //TODO: any make conjuntion of values
  //TODO: update the list of filteredTasks?
  const listAction = async (value: any, action: ListActions): Promise<void> => {
    setTodoListState({ ...todoListState, loading: true });
    switch (action) {
      case (ListActions.toogle):
        try {
          await TasksDataProvider.toggleTask(value);
          setTodoListTasks(await TasksDataProvider.retrieve());
        }
        catch (err) {
          updateErr(`Could not change the status of the task '${value}'. Error details: ${err}`);
        }
        break;
      case (ListActions.delete):
        try {
          await TasksDataProvider.deleteTask(value);
          setTodoListTasks(await TasksDataProvider.retrieve());
        }
        catch (err) {
          updateErr(`Could not change the status of the task '${value}'. Error details: ${err}`);
        }
        break;
      case (ListActions.add):
        try {
          await TasksDataProvider.addTask(value);
          setTodoListTasks( await TasksDataProvider.retrieve());
        }
        catch (err) {
          updateErr(`Could not add the new task '${value}'. Error details: ${err}`);
        }
        break;
      case (ListActions.changeView):
        try {
          setTodoCurrentView(value);
          setTimeout(() => { console.debug(`current view is ${todoCurrentView}`); }, 3000);
          console.debug(`current view is ${todoCurrentView}`);
        }
        catch (err) {
          updateErr(`Could not change to the list view '${value}'. Error details: ${err}`);
        }
        break;
      case (ListActions.clearDone):
        try {
          setTodoListTasks(await TasksDataProvider.clearDoneTasks());
        }
        catch (err) {
          updateErr(`Could not change to the list view '${value}'. Error details: ${err}`);
        }
        break;
    }
    setTodoListState({ ...todoListState, loading: false });

    Promise.resolve();
  }



  return (
    <div className="ZartisApp">
      <div className="App-header">
        <TitleComp title={appStrings.appTitle} logo={logo} />
        <StatusComp listStatus={{ status: todoListState.status, msg: todoListState.msg }} />
      </div>
      <div className="App-body">
        <TaskInputComp submitErr={updateErr} saveInput={listAction} disable={todoListState.loading} />
        <TaskListComp
          tasksFiltered={TasksDataProvider.viewResults(todoCurrentView, todoListTasks) }
          action={listAction} />
        <TaskListToolbarComp
          view={todoCurrentView}
          tasks={todoListTasks}
          actions={{
            udpateView: listAction,
            clearDone: listAction
          }}
          loading={todoListState.loading} />
      </div>
    </div>
  );
}






