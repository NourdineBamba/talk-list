import { Task } from "./task";

export class TasksCollection {
  private tasks: { [index: string]: Task[] } = {};

  getTasks() {
    return this.tasks;
  }

  addProject(name: string) {
    this.tasks[name] = [];
  }

  private nextId(): number {
    const allTasks = Object.values(this.tasks).reduce(
      (allTasks, currentTasks) => [...allTasks, ...currentTasks],
      []
    );

    const tasksIds = allTasks.map((task) => task.getId());

    const sortedids = tasksIds.sort((currentId, nextId) => nextId - currentId);

    return sortedids[0] + 1;
  }

  addTask(project: string, description: string) {
    const projectTasks = this.tasks[project];
    if (projectTasks == null) return false;
    projectTasks.push(new Task(this.nextId(), description, false));
    return true;
  }

  forEachProject(func: (key: string, value: Task[]) => any) {
    for (var key in this.tasks) {
      if (this.tasks.hasOwnProperty(key)) func(key, this.tasks[key]);
    }
  }

  updateTaskStatusById(taskList: Task[], taskId: string, done: boolean) {
    let found = false;

    taskList.forEach((task) => {
      if (task.getId() === +taskId) {
          task.updateStatus(done);
          found = true;
      }
  });

  return found;
  }
}
