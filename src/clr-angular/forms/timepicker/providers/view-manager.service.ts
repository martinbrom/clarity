/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { ClrPopoverPositions } from '../../../utils/popover/enums/positions.enum';
import { ClrPopoverPosition } from '../../../utils/popover/interfaces/popover-position.interface';
import { TimepickerTypeEnum, TimepickerViewEnum } from '../utils/constants';

/**
 * This service manages which view is visible in the datepicker popover.
 */
@Injectable()
export class ViewManagerService {
  private _currentView: TimepickerViewEnum = TimepickerViewEnum.DIGITALVIEW;
  private _currentType: TimepickerTypeEnum = TimepickerTypeEnum.FULL;
  position: ClrPopoverPosition = ClrPopoverPositions['bottom-left'];

  isDigitalView(): boolean {
    return this._currentView === TimepickerViewEnum.DIGITALVIEW;
  }

  set currentView(view: TimepickerViewEnum) {
    if (view !== this._currentView) {
      this._currentView = view;
    }
  }

  changeToDigitalView(): void {
    this._currentView = TimepickerViewEnum.DIGITALVIEW;
  }

  isFullType(): boolean {
    return this._currentView === TimepickerViewEnum.DIGITALVIEW && this._currentType === TimepickerTypeEnum.FULL;
  }

  isTwelveHourType(): boolean {
    return this._currentType === TimepickerTypeEnum.TWELVEHOURS;
  }

  set currentType(type: TimepickerTypeEnum) {
    if (type !== this._currentType) {
      this._currentType = type;
    }
  }

  changeToFullType(): void {
    this._currentType = TimepickerTypeEnum.FULL;
  }

  changeToTwelveHourType(): void {
    this._currentType = TimepickerTypeEnum.TWELVEHOURS;
  }
}
