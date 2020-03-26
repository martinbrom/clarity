/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { TimeModel } from '../model/time.model';
import { TimeRange } from '../interfaces/time-range.interface';
import { LocaleHelperService } from './locale-helper.service';
import { TimeFormattingService } from './time-formatting.service';
import { MAXIMUM_HOUR_VALUE, MAXIMUM_MINUTE_VALUE, TimepickerPeriodEnum } from '../utils/constants';

@Injectable()
export class TimeIOService {
  // TODO: Implement spacing and separators based on locale
  // TODO: 12-hour date format

  public disabledTimes: TimeRange = {
    // TODO: turn this into an Array of min/max ranges that allow configuration of multiple ranges.
    minTime: new TimeModel(0, 0),
    maxTime: new TimeModel(MAXIMUM_HOUR_VALUE, MAXIMUM_MINUTE_VALUE),
  };

  private delimiter: string = ':';
  // AM & PM
  // private useDayPeriods: boolean = false;

  constructor(private localeHelperService: LocaleHelperService, private formattingService: TimeFormattingService) {
    // this.determineDayPeriodUsage(this.localeHelperService.localeTimeFormat);
  }

  // expects a time in a format of either HH:mm or H:mm
  public setMinTime(timeString: string): void {
    if (!!timeString) {
      const [hour, minute] = this.parseTimeString(timeString);
      this.disabledTimes.minTime = new TimeModel(hour, minute);
    } else {
      this.disabledTimes.minTime = new TimeModel(0, 0);
    }
  }

  // expects a time in a format of either HH:mm or H:mm
  public setMaxTime(timeString: string): void {
    if (!!timeString) {
      const [hour, minute] = this.parseTimeString(timeString, MAXIMUM_HOUR_VALUE, MAXIMUM_MINUTE_VALUE);
      this.disabledTimes.maxTime = new TimeModel(hour, minute);
    } else {
      this.disabledTimes.maxTime = new TimeModel(0, 0);
    }
  }

  toLocaleDisplayFormatString(time: Date): string {
    if (time) {
      if (isNaN(time.getTime())) {
        return '';
      }

      return (
        this.formattingService.pad(time.getHours()) + this.delimiter + this.formattingService.pad(time.getMinutes())
      );
    }
    return '';
  }

  toISOFormat(time: Date): string {
    if (time) {
      if (isNaN(time.getTime())) {
        return '';
      }

      return this.formattingService.pad(time.getHours()) + ':' + this.formattingService.pad(time.getMinutes());
    }
    return '';
  }

  get placeholderText(): string {
    return 'HH' + this.delimiter + 'mm';
  }

  getTimeValueFromTimeString(timeString: string): Date {
    if (!timeString) {
      return null;
    }

    const [hour, minute] = this.parseTimeString(timeString);
    const time = new Date();
    time.setHours(hour);
    time.setMinutes(minute);
    time.setSeconds(0);
    return time;
  }

  // TODO: TEST!!!
  // determineDayPeriodUsage(localeFormat: string) {
  //   this.useDayPeriods = localeFormat.indexOf('a') >= 0;
  // }

  /**
   * Checks if the time is valid depending on the hour and minute provided.
   */
  private isValidTime(hour: number, minute: number): boolean {
    return hour >= 0 && hour <= MAXIMUM_HOUR_VALUE && minute >= 0 && minute <= MAXIMUM_MINUTE_VALUE;
  }

  private parseTimeString(timeString: string, defaultHour = 0, defaultMinute = 0): [number, number] {
    if (!timeString) {
      return [defaultHour, defaultMinute];
    }

    let parts: number[] = [];
    if (timeString.indexOf(this.delimiter) >= 0) {
      parts = timeString.split(this.delimiter).map(n => parseInt(n, 10));
    } else if (timeString.length === 4) {
      parts = [+timeString.substring(0, 2), +timeString.substring(2)];
    }

    if (parts.length === 2 && this.isValidTime(parts[0], parts[1])) {
      return [parts[0], parts[1]];
    }

    return [defaultHour, defaultMinute];
  }
}
