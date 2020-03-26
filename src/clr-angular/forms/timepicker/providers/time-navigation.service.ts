/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TimeModel } from '../model/time.model';
import { DEFAULT_HOUR_STEP, DEFAULT_MINUTE_STEP } from '../utils/constants';

@Injectable()
export class TimeNavigationService {
  private _value: TimeModel;
  private _valueChanged = new Subject<TimeModel>();

  private hourStep = DEFAULT_HOUR_STEP;
  private minuteStep = DEFAULT_MINUTE_STEP;

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

  get value() {
    return this._value;
  }

  set value(time: TimeModel) {
    this._value = time;
  }

  public notifyValueChange(time: TimeModel) {
    this._value = time;
    this._valueChanged.next(time);
  }

  public valueChanged(): Observable<TimeModel> {
    return this._valueChanged.asObservable();
  }

  public incrementHours(): void {
    this.notifyValueChange(this.value.incrementHoursBy(this.hourStep));
  }

  public decrementHours(): void {
    this.notifyValueChange(this.value.incrementHoursBy(-this.hourStep));
  }

  public incrementMinutes(): void {
    this.notifyValueChange(this.value.incrementMinutesBy(this.minuteStep));
  }

  public decrementMinutes(): void {
    this.notifyValueChange(this.value.incrementMinutesBy(-this.minuteStep));
  }
}
