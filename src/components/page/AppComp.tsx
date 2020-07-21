import React from "react";
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

interface AppProps {

}

interface AppState {
  status: ListStatusDetails;
  tasks: Task[];
  tasksFiltered: Task[];
  loading: boolean;
  currentView: ListViews;
}


export class AppComp extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      status: { status: ListStatus.ok, msg: "" },
      tasks: [],
      tasksFiltered: [],
      loading: true,
      currentView: ListViews.all
    };
  }

  /** retrive the task from server */
  async componentDidMount() {
    try {
      let tasks: Task[] = await TasksDataProvider.connect();
      this.setState({
        tasks: tasks,
        tasksFiltered: TasksDataProvider.viewResults(ListViews.all, tasks),
        loading: false
      });
    }
    catch (err) {
      this.setState({
        loading: false,
        status: { status: ListStatus.err, msg: err }
      });
    }

  }



  render = () => {
    //const { tasksFiltered } = this.state.tasksFiltered;
    return (
      <div className="ZartisApp">
        <div className="App-header">
          <TitleComp title={appStrings.appTitle} logo={logo} />
          <StatusComp listStatus={this.state.status} />
        </div>
        <div className="App-body">
          <TaskInputComp submitErr={this.updateErr} saveInput={this.listAction} />
          <TaskListComp
            tasksFiltered={this.state.tasksFiltered}
            action={this.listAction}
          />
          <TaskListToolbarComp
            view={this.state.currentView}
            tasks={this.state.tasks}
            actions={{
              udpateView: this.listAction,
              clearDone: this.listAction
            }}
            loading={this.state.loading}
          />
        </div>
      </div>
    );
  }

  /** updates or removes the current error on the app */
  private updateErr = (error: string): void => {
    error ?
      this.setState({ status: { msg: error, status: ListStatus.err } ,loading:false}) :
      this.setState({ status: { msg: "", status: ListStatus.ok },loading:false });
  }




  /** performs a list action */
  //TODO: any make conjuntion of values
  //TODO: update the list of filteredTasks?
  private listAction = async (value: any, action: ListActions): Promise<void> => {
    this.setState({ loading: true });
    switch (action) {
      case (ListActions.toogle):
        try {
          await TasksDataProvider.toggleTask(value, this.state.tasks);
          this.setState({
            tasksFiltered: TasksDataProvider.viewResults(this.state.currentView, this.state.tasks),
            loading: false
          })
        }
        catch (err) {
          this.updateErr(`Could not change the status of the task '${value}'. Error details: ${err}`);
        }
        break;
      case (ListActions.delete):
        try {
          await TasksDataProvider.deleteTask(value, this.state.tasks);
          this.setState({
            tasksFiltered: TasksDataProvider.viewResults(this.state.currentView, this.state.tasks),
            loading: false
          })
        }
        catch (err) {
          this.updateErr(`Could not change the status of the task '${value}'. Error details: ${err}`);
        }
        break;
      case (ListActions.add):
        try {
          await TasksDataProvider.addTask(value, this.state.tasks);
          this.setState({
            tasksFiltered: TasksDataProvider.viewResults(this.state.currentView, this.state.tasks),
            loading: false
          })
        }
        catch (err) {
          this.updateErr(`Could not add the new task '${value}'. Error details: ${err}`);
        }
        break;
      case (ListActions.changeView):
        try {
          this.setState({
            tasksFiltered: TasksDataProvider.viewResults(value, this.state.tasks),
            currentView: value,
            loading: false
          })

        }
        catch (err) {
          this.updateErr(`Could not change to the list view '${value}'. Error details: ${err}`);
        }
        break;
      case (ListActions.clearDone):
        try {
          let cleanedTasks: Task[] = await TasksDataProvider.clearDoneTasks(this.state.tasks)
          this.setState({
            tasks: cleanedTasks,
            tasksFiltered: TasksDataProvider.viewResults(this.state.currentView, cleanedTasks),
            loading: false
          })

        }
        catch (err) {
          this.updateErr(`Could not change to the list view '${value}'. Error details: ${err}`);
        }
        break;
    }
    Promise.resolve();
  }

}
