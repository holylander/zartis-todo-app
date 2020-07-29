import { Task, TaskStatus } from "./task";
import { ListViews } from "./list";

export class TasksDataProvider {

    static tasks: Task[] = [];
    private static taskId: number = 0;


    /** add a new task, with a sequential ID */
    public static async addTask(taskname: string) {
        this.taskId++
        try {
            let newTask: Task = { name: taskname, status: TaskStatus.pending, id: TasksDataProvider.taskId };
            await this.wait(500);
            TasksDataProvider.tasks.push(newTask);
            return Promise.resolve(newTask.id);
        }
        catch (err) {
            return Promise.reject(`Could not add the task '${taskname}'`);
        }

    }

    /** Changes the status of a task */
    public static async toggleTask(id: number): Promise<TaskStatus> {
        try {
            let task: Task = TasksDataProvider.tasks.filter((task) => task.id === id)[0];
            await this.wait(500);
            task.status === TaskStatus.done ? task.status = TaskStatus.pending : task.status = TaskStatus.done;
            return Promise.resolve(task.status);
        }
        catch {
            return Promise.reject("Could not change the status of the task");
        }
    }

    /** delete an existing task */
    public static async deleteTask(id: number): Promise<void> {
        try {
            let task: Task = TasksDataProvider.tasks.filter((task) => task.id === id)[0];
            await this.wait(500);
            TasksDataProvider.tasks.splice(TasksDataProvider.tasks.indexOf(task), 1);
            return Promise.resolve();
        }
        catch {
            return Promise.reject(`Could not delete the task with id '${id}'`);
        }
    }

    /** Delete the completed tasks and return the number of deleted tasks */
    public static async clearDoneTasks(): Promise<Task[]> {
        try {
            await this.wait(500);
            TasksDataProvider.tasks = TasksDataProvider.viewResults(ListViews.active, TasksDataProvider.tasks);
            return Promise.resolve(TasksDataProvider.tasks);
        }
        catch (err) {
            return Promise.reject("Could not delete the completed tasks");
        }
    }

    /** Returns a filtered collection of tasks */
    public static viewResults = (view: ListViews, tasks: Task[]): Task[] => {
        switch (view) {
            case ListViews.all:
                return tasks;
            case ListViews.active:
                return tasks.filter((task) => task.status === TaskStatus.pending);
            case ListViews.completed:
                return tasks.filter((task) => task.status === TaskStatus.done);
        }
    }

    public static async connect(): Promise<Task[]> {
        await this.wait(500);
        await TasksDataProvider.addTask("Test task 1");
        await TasksDataProvider.addTask("Test task 2");
        return Promise.resolve(TasksDataProvider.tasks);
    }

    public static async retrieve(): Promise<Task[]> {
        await this.wait(500);
        return Promise.resolve(TasksDataProvider.tasks);
    }

    private static async wait(ms: number) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

}