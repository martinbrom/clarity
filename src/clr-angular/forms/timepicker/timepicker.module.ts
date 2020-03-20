/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClrCommonFormsModule } from '../common/common.module';
import { ClrTimeInput } from './time-input';
import { ClrTimeContainer } from './time-container';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrTimepickerViewManager } from './timepicker-view-manager';

export const CLR_TIMEPICKER_DIRECTIVES: Type<any>[] = [
  ClrTimeContainer,
  ClrTimeInput,
  ClrTimepickerViewManager,
];

@NgModule({
  imports: [CommonModule, ClrCommonFormsModule, ClrIconModule],
  declarations: [CLR_TIMEPICKER_DIRECTIVES],
  exports: [CLR_TIMEPICKER_DIRECTIVES],
  entryComponents: [ClrTimeContainer],
})
export class ClrTimepickerModule {}
