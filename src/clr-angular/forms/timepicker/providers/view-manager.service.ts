/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { ClrPopoverPositions } from '../../../utils/popover/enums/positions.enum';
import { ClrPopoverPosition } from '../../../utils/popover/interfaces/popover-position.interface';
import { TimepickerViewEnum } from '../utils/constants';

/**
 * This service manages which view is visible in the datepicker popover.
 */
@Injectable()
export class ViewManagerService {
  private _currentView: TimepickerViewEnum = TimepickerViewEnum.DIGITALVIEW;
  position: ClrPopoverPosition = ClrPopoverPositions['bottom-left'];

  get isDigitalView(): boolean {
    return this._currentView === TimepickerViewEnum.DIGITALVIEW;
  }

  get isAnalogView(): boolean {
    return this._currentView === TimepickerViewEnum.ANALOGVIEW;
  }

  changeToDigitalView(): void {
    this._currentView = TimepickerViewEnum.DIGITALVIEW;
  }

  changeToAnalogView(): void {
    this._currentView = TimepickerViewEnum.ANALOGVIEW;
  }
}
