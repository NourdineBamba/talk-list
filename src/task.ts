import * as util from "util";

export class Task {
  constructor(
    private _id: number,
    private _description: string,
    private _done: boolean
  ) {}

  getId() {
    return this._id;
  }

  getDescription() {
    return this._description;
  }

  getDone() {
    return this._done;
  }

  updateStatus(val: boolean) {
    this._done = val;
  }

  toString() {
    return util.format(
      "    [%s] %d: %s",
      this._done ? "x" : " ",
      this._id,
      this._description
    );
  }
}
