/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from '@angular/core';

const time1: Date = new Date(2015, 1, 1, 9, 0);
const time2: Date = new Date(2015, 1, 1, 16, 0);

@Component({
  selector: 'clr-timepicker-time-input-demo',
  styleUrls: ['./timepicker.demo.scss'],
  templateUrl: './timepicker-time-input.html',
  // providers: [{provide: LOCALE_ID, useValue: "en"}],
  // providers: [{provide: LOCALE_ID, useValue: "ar-AE"}]
  // providers: [{provide: LOCALE_ID, useValue: "hi"}]
  // providers: [{provide: LOCALE_ID, useValue: "ak"}]
  // providers: [{provide: LOCALE_ID, useValue: "fr"}]
  // providers: [{provide: LOCALE_ID, useValue: "ru-UA"}]
  // providers: [{provide: LOCALE_ID, useValue: "de"}]
  // Do not remove the above comments. They are present to make sure that we can test different locales easily.
})
export class TimepickerTimeInputDemo {
  time: Date = time1;
  timeStr: string;

  timeChanged(time: Date) {
    console.log('Timepicker Output Changed', time);
    if (time) {
      this.timeStr = time.toLocaleTimeString();
    } else {
      this.timeStr = '';
    }
  }

  updateTime(): void {
    if (this.time === time1) {
      this.time = time2;
    } else {
      this.time = time1;
    }
  }
}
