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
import { DEFAULT_HOUR_STEP, DEFAULT_MINUTE_STEP, MAXIMUM_HOUR_VALUE, MAXIMUM_MINUTE_VALUE } from '../utils/constants';

@Injectable()
export class TimeIOService {
  // TODO: Implement spacing and separators based on locale

  public disabledTimes: TimeRange = {
    // TODO: turn this into an Array of min/max ranges that allow configuration of multiple ranges.
    minTime: new TimeModel(0, 0),
    maxTime: new TimeModel(MAXIMUM_HOUR_VALUE, MAXIMUM_MINUTE_VALUE),
  };

  private delimiter: string = ':';
  // AM & PM
  private useDayPeriods: boolean = false;
  private hourStep: number = DEFAULT_HOUR_STEP;
  private minuteStep: number = DEFAULT_MINUTE_STEP;

  constructor(private localeHelperService: LocaleHelperService, private formattingService: TimeFormattingService) {
    this.determineDayPeriodUsage(this.localeHelperService.localeTimeFormat);
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

  // TODO: Min & Max step bounds?
  public setHourStep(step: number): void {
    if (!!step) {
      this.hourStep = step;
    } else {
      this.hourStep = DEFAULT_HOUR_STEP;
    }
  }

  // TODO: Min & Max step bounds?
  public setMinuteStep(step: number): void {
    if (!!step) {
      this.minuteStep = step;
    } else {
      this.minuteStep = DEFAULT_MINUTE_STEP;
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
    return time;
  }

  // TODO: TEST!!!
  determineDayPeriodUsage(localeFormat: string) {
    this.useDayPeriods = localeFormat.indexOf('a') >= 0;
  }

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

    const parts: number[] = timeString.split(this.delimiter).map(n => parseInt(n, 10));
    if (parts.length === 2 && this.isValidTime(parts[0], parts[1])) {
      return [parts[0], parts[1]];
    }

    return [defaultHour, defaultMinute];
  }
}
