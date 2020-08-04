import { TasksDataProvider } from "../../modules/TasksDataProvider";
import { Task } from "../../modules/task";
import { ListViews } from "../../modules/list";

const funnyTaskNames = [
    "ñ123$",
    "\"dasdasd$",
    "'*^123$",
];

describe(
    "Testing Task Data provider",
    () => {
        test("On init, it should return 2 tasks", async () => {
            expect.assertions(1);
            let tasks: Task[];
            tasks = await TasksDataProvider.connect();
            expect(tasks.length).toBe(2);

            /* return TasksDataProvider.connect().then((data)=>{
                tasks = data;
                expect(tasks.length).toBe(2);  
            }); */
        })

        test("Add many funny name tasks", async () => {
            expect.assertions(1);
            let tasks: Task[];
            funnyTaskNames.forEach(async (taskName)=>{
                await TasksDataProvider.addTask(taskName);
            })
            tasks = await TasksDataProvider.retrieve();
            expect(tasks.length).toBe(2+funnyTaskNames.length);
        })

        test("Get filtered view - completed tasks - with 1 item", async () => {
            expect.assertions(1);
            let tasks: Task[] =  await TasksDataProvider.retrieve();
            await TasksDataProvider.toggleTask(tasks[3].id);
            expect(TasksDataProvider.viewResults(ListViews.completed,tasks).length).toBe(1);
        })

    });

