/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { TimeModel } from '../model/time.model';

/**
 * This service is responsible for:
 * 1. Initializing the displayed timepicker dialog.
 * 2. Moving the calendar to the next, previous or current hours and minutes
 * 3. Managing the focused and selected time models.
 */
@Injectable()
export class TimeNavigationService {
  /**
   * Variable to store today's date.
   */
  private _timeNow: Date = new Date();
  private _nowModel: TimeModel;

  private initializeTodaysDate(): void {
    this._timeNow = new Date();
    this._nowModel = new TimeModel(this._timeNow.getFullYear(), this._timeNow.getMonth());
  }

  get nowModel(): TimeModel {
    return this._nowModel;
  }

  public selectedDay: TimeModel;

  private _selectedDayChange: Subject<TimeModel> = new Subject<TimeModel>();

  get selectedDayChange(): Observable<TimeModel> {
    return this._selectedDayChange.asObservable();
  }

  /**
   * Notifies that the selected day has changed so that the date can be emitted to the user.
   * Note: Only to be called from day.ts
   */
  notifySelectedDayChanged(dayModel: TimeModel) {
    this.selectedDay = dayModel;
    this._selectedDayChange.next(dayModel);
  }

  public focusedDay: TimeModel;

  /**
   * Initializes the calendar based on the selected day.
   */
  initializeCalendar(): void {
    this.focusedDay = null; // Can be removed later on the store focus
    this.initializeTodaysDate();
    if (this.selectedDay) {
      this._displayedCalendar = new CalendarModel(this.selectedDay.year, this.selectedDay.month);
    } else {
      this._displayedCalendar = new CalendarModel(this.nowModel.year, this.nowModel.month);
    }
  }
}
