export class TaskDetails {
  constructor(private _description: string, private _done: boolean) {}

  getDescription() {
    return this._description;
  }

  getDone() {
    return this._done;
  }

  updateStatus(val: boolean) {
    this._done = val;
  }
}
