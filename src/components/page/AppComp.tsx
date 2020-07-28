import React, { useState, useEffect } from "react";
import { TitleComp } from "./TitleComp";
import { StatusComp } from "./StatusComp";
import { appStrings } from "../../loc/strings";
import { Task } from "../../modules/task";
import { ListStatusDetails, ListViews, ListStatus, ListActions } from "../../modules/list";
import { TasksDataProvider } from "../../modules/TasksDataProvider";
import { TaskInputComp, TaskListComp, TaskListToolbarComp, TaskLineComp } from "../tasks";

import "./style.scss"
import "../../style/general.scss"
import logo from "../../assets/zartis-logo.png"


export function AppComp() {

  const [todoListDataState, setTodoListDataState] = useState({
    tasks: [],
    tasksFiltered: [],
    currentView: ListViews.all
  })

  const [todoListState, setTodoListState] = useState({
    status: ListStatus.ok,
    loading: true,
    msg: ""
  })

  /** retrive the tasks from server */
  useEffect(() => {
    TasksDataProvider.connect()
      .then((tasks) => {
        setTodoListDataState({
          tasks: tasks,
          tasksFiltered: TasksDataProvider.viewResults(ListViews.all, tasks),
          currentView: ListViews.all
        });
        setTodoListState({
          ...todoListState,
          status: ListStatus.ok,
          msg: "Tasks data fetched from server"
        });
      })
      .catch((err) => {
        setTodoListState({
          ...todoListState,
          status: ListStatus.err,
          msg: err
        })
      })
      .finally(() => {
        setTodoListState({
          ...todoListState,
          loading: false,
        })
      })
  }, todoListDataState.tasks);


  /** updates or removes the current error on the app */
  const updateErr = (error: string): void => {
    error ?
      setTodoListState({ msg: error, status: ListStatus.err, loading: false }) :
      setTodoListState({ msg: "", status: ListStatus.ok, loading: false });
  }




  /** performs a list action */
  //TODO: any make conjuntion of values
  //TODO: update the list of filteredTasks?
  const listAction = async (value: any, action: ListActions): Promise<void> => {
    setTodoListState({ ...todoListState, loading: true });
    switch (action) {
      case (ListActions.toogle):
        try {
          await TasksDataProvider.toggleTask(value, todoListDataState.tasks);
          let tasksFromServer: Task[] = await TasksDataProvider.retrieve();
          setTodoListDataState({
            ...todoListDataState,
            tasks: await TasksDataProvider.retrieve(),
            tasksFiltered: TasksDataProvider.viewResults(todoListDataState.currentView, tasksFromServer),
          });
        }
        catch (err) {
          updateErr(`Could not change the status of the task '${value}'. Error details: ${err}`);
        }
        break;
      case (ListActions.delete):
        try {
          await TasksDataProvider.deleteTask(value, todoListDataState.tasks);
          let tasksFromServer: Task[] = await TasksDataProvider.retrieve();
          setTodoListDataState({
            ...todoListDataState,
            tasks: tasksFromServer,
            tasksFiltered: TasksDataProvider.viewResults(todoListDataState.currentView, tasksFromServer),
          });
        }
        catch (err) {
          updateErr(`Could not change the status of the task '${value}'. Error details: ${err}`);
        }
        break;
      case (ListActions.add):
        try {
          await TasksDataProvider.addTask(value, todoListDataState.tasks);
          let tasksFromServer: Task[] = await TasksDataProvider.retrieve();
          setTodoListDataState({
            ...todoListDataState,
            tasks: tasksFromServer,
            tasksFiltered: TasksDataProvider.viewResults(todoListDataState.currentView, tasksFromServer),
          });
        }
        catch (err) {
          updateErr(`Could not add the new task '${value}'. Error details: ${err}`);
        }
        break;
      case (ListActions.changeView):
        try {
          setTodoListDataState({
            ...todoListDataState,
            tasksFiltered: TasksDataProvider.viewResults(value, todoListDataState.tasks),
            currentView: value
          });
        }
        catch (err) {
          updateErr(`Could not change to the list view '${value}'. Error details: ${err}`);
        }
        break;
      case (ListActions.clearDone):
        try {
          let cleanedTasks: Task[] = await TasksDataProvider.clearDoneTasks()
          setTodoListDataState({
            ...todoListDataState,
            tasks: cleanedTasks,
            tasksFiltered: TasksDataProvider.viewResults(todoListDataState.currentView, cleanedTasks),
          });
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
        <TaskInputComp submitErr={updateErr} saveInput={listAction} />
        <TaskListComp
          tasksFiltered={todoListDataState.tasksFiltered}
          action={listAction}
        >
          <ul className="taskLine">
            {todoListDataState.tasksFiltered.map((task) => { return (<TaskLineComp key={`task-id-${task.id}`} {...{ task: task, action: listAction }} />); })}
          </ul>
        </TaskListComp>
        <TaskListToolbarComp
          view={todoListDataState.currentView}
          tasks={todoListDataState.tasks}
          actions={{
            udpateView: listAction,
            clearDone: listAction
          }}
          loading={todoListState.loading}
        />
      </div>
    </div>
  );
}






