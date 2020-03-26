/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component } from '@angular/core';

import { TimeNavigationService } from './providers/time-navigation.service';
import { ViewManagerService } from './providers/view-manager.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrAriaLiveService } from '../../utils/a11y/aria-live.service';
import { TimepickerPeriodEnum } from './utils/constants';

@Component({
  selector: 'clr-timepicker-digital',
  providers: [ClrAriaLiveService],
  template: `
        <div class="hours">
          <button (click)="incrementHours()" (scroll)="scrollHours($event)">
            <clr-icon shape="caret up"></clr-icon>
          </button>
          <div class="hours-text"></div>
          <button (click)="decrementHours()">
            <clr-icon shape="caret down"></clr-icon>
          </button>
        </div>
        <div class="time-separator-wrapper"></div>
        <div class="minutes" (scroll)="scrollMinutes($event)">
          <button (click)="incrementMinutes()">
            <clr-icon shape="caret up"></clr-icon>
          </button>
          <div class="minutes-text"></div>
          <button (click)="decrementMinutes()">
            <clr-icon shape="caret down"></clr-icon>
          </button>
        </div>
        <div class="periods" *ngIf="periodsVisible()">
          <button (click)="switchToAM()" [class.active]="isAMSelected()">AM</button>
          <button (click)="switchToPM()" [class.active]="isPMSelected()">PM</button>
        </div>
    `,
  host: {
    '[class.timepicker-digital]': 'true',
  },
})
export class ClrTimepickerDigital {
  constructor(
    private timeNavigationService: TimeNavigationService,
    private viewManagerService: ViewManagerService,
    public commonStrings: ClrCommonStringsService
  ) {}

  periodSelected: TimepickerPeriodEnum;

  public isAMSelected(): boolean {
    return this.periodSelected === TimepickerPeriodEnum.AM;
  }

  public isPMSelected(): boolean {
    return this.periodSelected === TimepickerPeriodEnum.PM;
  }

  public switchToAM(): void {
    this.periodSelected = TimepickerPeriodEnum.AM;
  }

  public switchToPM(): void {
    this.periodSelected = TimepickerPeriodEnum.PM;
  }

  scrollHours(event: Event): void {
    // TODO: Figure out
    console.log(event);
  }

  scrollMinutes(event: Event): void {
    // TODO: Figure out
    console.log(event);
  }

  incrementHours(): void {
    this.timeNavigationService.incrementHours();
  }

  decrementHours(): void {
    this.timeNavigationService.decrementHours();
  }

  incrementMinutes(): void {
    this.timeNavigationService.incrementMinutes();
  }

  decrementMinutes(): void {
    this.timeNavigationService.decrementMinutes();
  }

  periodsVisible(): boolean {
    return this.viewManagerService.isTwelveHourType();
  }
}
