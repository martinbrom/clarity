/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export class TimeModel {
  // TODO: Seconds, milliseconds?
  constructor(public readonly hour: number, public readonly minute: number) {}

  /**
   * Checks if the passed TimeModel is equal to itself.
   */
  isEqual(time: TimeModel) {
    if (time) {
      return this.hour === time.hour && this.minute === time.minute;
    }
    return false;
  }

  toDate(): Date {
    const time = new Date();
    time.setHours(this.hour);
    time.setMinutes(this.minute);
    return time;
  }

  /**
   * Clones the current time model.
   */
  clone(): TimeModel {
    return new TimeModel(this.hour, this.minute);
  }

  toComparisonString(): string {
    return `${TimeModel.pad(this.hour)}${TimeModel.pad(this.minute)}`;
  }

  private static pad(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
