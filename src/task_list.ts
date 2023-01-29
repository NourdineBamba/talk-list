/// <reference path="../typings/node/node.d.ts" />

import * as readline from "readline";
import * as util from "util";
import { Task } from "./task";
import { TasksCollection } from "./tasks_collection";
function splitFirstSpace(s: string) {
  var pos = s.indexOf(" ");
  if (pos === -1) {
    return [s];
  }
  return [s.substring(0, pos), s.substring(pos + 1)];
}

export class TaskList {
  static QUIT = "quit";
  private readline;
  private tasksCollection: TasksCollection;

  constructor(reader: NodeJS.ReadableStream, writer: NodeJS.WritableStream) {
    this.tasksCollection = new TasksCollection();

    this.readline = readline.createInterface({
      terminal: false,
      input: reader,
      output: writer,
    });

    this.readline.setPrompt("> ");
    this.readline.on("line", (cmd) => {
      if (cmd == TaskList.QUIT) {
        this.readline.close();
        return;
      }
      this.execute(cmd);
      this.readline.prompt();
    });
    this.readline.on("close", () => {
      writer.end();
    });
  }

  println(ln: string) {
    this.readline.output.write(ln);
    this.readline.output.write("\n");
  }

  run() {
    this.readline.prompt();
  }

  execute(commandLine: string) {
    var commandRest = splitFirstSpace(commandLine);
    var command = commandRest[0];
    switch (command) {
      case "show":
        this.show();
        break;
      case "add":
        this.add(commandRest[1]);
        break;
      case "check":
        this.check(commandRest[1]);
        break;
      case "uncheck":
        this.uncheck(commandRest[1]);
        break;
      case "help":
        this.help();
        break;
      default:
        this.error(command);
        break;
    }
  }

  private showTaskList(taskList: Task[]) {
    taskList.forEach((task) => {
      this.println(task.toString());
    });
  }

  private show() {
    this.tasksCollection.forEachProject((project, taskList) => {
      this.println(project);
      this.showTaskList(taskList);
      this.println("");
    });
  }

  private add(commandLine: string) {
    var subcommandRest = splitFirstSpace(commandLine);
    var subcommand = subcommandRest[0];
    if (subcommand === "project") {
      return this.tasksCollection.addProject(subcommandRest[1]);
    }

    if (subcommand === "task") {
      var projectTask = splitFirstSpace(subcommandRest[1]);
      const isSuccess = this.tasksCollection.addTask(
        projectTask[0],
        projectTask[1]
      );
      if (!isSuccess) {
        this.println(
          util.format(
            'Could not find a project with the name "%s".',
            projectTask[0]
          )
        );
      }
    }
  }

  private check(idString: string) {
    this.setDone(idString, true);
  }

  private uncheck(idString: string) {
    this.setDone(idString, false);
  }

  private setDone(idString: string, done: boolean) {
    var id = parseInt(idString, 10);
    var found = false;
    this.tasksCollection.forEachProject((project, taskList) => {
      const isUpdated = this.tasksCollection.updateTaskStatusById(
        taskList,
        idString,
        done
      );
      if (!found) found = isUpdated;
    });
    if (!found)
      this.println(util.format("Could not find a task with an ID of %d.", id));
  }

  private help() {
    this.println("Commands:");
    this.println("  show");
    this.println("  add project <project name>");
    this.println("  add task <project name> <task description>");
    this.println("  check <task ID>");
    this.println("  uncheck <task ID>");
    this.println("");
  }

  private error(command: string) {
    this.println("I don't know what the command \"" + command + '" is.');
  }
}

if (require.main == module) {
  new TaskList(process.stdin, process.stdout).run();
}
