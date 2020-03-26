/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClarityModule } from '@clr/angular';

import { TimepickerTimeInputDemo } from './timepicker-time-input';
import { TimepickerTimeInputExplicitWrapperDemo } from './timepicker-time-input-explicit-wrapper';
import { ROUTING } from './timepicker.demo.routing';
import { TimepickerDemo } from './timepicker.demo';

@NgModule({
  imports: [CommonModule, ClarityModule, ROUTING, FormsModule, ReactiveFormsModule],
  declarations: [TimepickerDemo, TimepickerTimeInputDemo, TimepickerTimeInputExplicitWrapperDemo],
  exports: [TimepickerDemo, TimepickerTimeInputDemo, TimepickerTimeInputExplicitWrapperDemo],
})
export class TimepickerDemoModule {}
