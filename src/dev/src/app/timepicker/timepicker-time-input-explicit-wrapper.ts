/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, LOCALE_ID } from '@angular/core';

@Component({
  selector: 'clr-timepicker-time-input-wrapper-present-demo',
  styleUrls: ['./timepicker.demo.scss'],
  templateUrl: './timepicker-time-input-explicit-wrapper.html',
  providers: [{ provide: LOCALE_ID, useValue: 'en' }],
  // providers: [{provide: LOCALE_ID, useValue: "ar-AE"}]
  // providers: [{provide: LOCALE_ID, useValue: "hi"}]
  // providers: [{provide: LOCALE_ID, useValue: "ak"}]
  // providers: [{provide: LOCALE_ID, useValue: "fr"}]
  // providers: [{provide: LOCALE_ID, useValue: "ru-UA"}]
  // providers: [{provide: LOCALE_ID, useValue: "de"}]
  // Do not remove the above comments. They are present to make sure that we can test different locales easily.
})
export class TimepickerTimeInputExplicitWrapperDemo {
  time: Date = new Date();

  timeChanged(time: Date) {
    console.log('Timepicker Container Output Changed', time);
    this.time = time;
  }
}
