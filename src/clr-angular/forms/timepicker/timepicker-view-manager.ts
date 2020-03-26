/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ViewManagerService } from './providers/view-manager.service';

@Component({
  selector: 'clr-timepicker-view-manager',
  templateUrl: './timepicker-view-manager.html',
  host: {
    '[class.timepicker]': 'true',
    '[attr.aria-modal]': 'true',
  },
})
export class ClrTimepickerViewManager {
  constructor(private viewManagerService: ViewManagerService) {}

  /**
   * Returns if the current view is digital.
   */
  get isDigitalView(): boolean {
    return this.viewManagerService.isDigitalView();
  }
}
