/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export class TimeModel {
  // TODO: Seconds, milliseconds?
  constructor(public readonly hours: number, public readonly minutes: number) {}

  /**
   * Checks if the passed TimeModel is equal to itself.
   */
  isEqual(time: TimeModel) {
    if (time) {
      return this.hours === time.hours && this.minutes === time.minutes;
    }
    return false;
  }

  toDate(): Date {
    const time = new Date();
    time.setHours(this.hours);
    time.setMinutes(this.minutes);
    time.setSeconds(0);
    return time;
  }

  incrementHoursBy(value: number): TimeModel {
    return new TimeModel((this.hours + value + 24) % 24, this.minutes);
  }

  incrementMinutesBy(value: number): TimeModel {
    return new TimeModel(this.hours, (this.minutes + value + 60) % 60);
  }

  /**
   * Clones the current time model.
   */
  clone(): TimeModel {
    return new TimeModel(this.hours, this.minutes);
  }

  toComparisonString(): string {
    return `${this.pad(this.hours)}${this.pad(this.minutes)}`;
  }

  private pad(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
}
