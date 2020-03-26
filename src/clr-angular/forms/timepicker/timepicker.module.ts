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
import { ClrTimepickerDigital } from './timepicker-digital';
import { ClrConditionalModule } from '../../utils/conditional/conditional.module';
import { ClrPopoverModuleNext } from '../../utils/popover/popover.module';
import { TimeNavigationService } from './providers/time-navigation.service';

export const CLR_TIMEPICKER_DIRECTIVES: Type<any>[] = [
  ClrTimeContainer,
  ClrTimeInput,
  ClrTimepickerDigital,
  ClrTimepickerViewManager,
];

@NgModule({
  imports: [CommonModule, ClrCommonFormsModule, ClrIconModule, ClrConditionalModule, ClrPopoverModuleNext],
  declarations: [CLR_TIMEPICKER_DIRECTIVES],
  exports: [CLR_TIMEPICKER_DIRECTIVES],
  providers: [TimeNavigationService],
  entryComponents: [ClrTimeContainer],
})
export class ClrTimepickerModule {}
