/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TimepickerTimeInputDemo } from './timepicker-time-input';
import { TimepickerTimeInputExplicitWrapperDemo } from './timepicker-time-input-explicit-wrapper';
import { TimepickerDemo } from './timepicker.demo';

const ROUTES: Routes = [
  {
    path: '',
    component: TimepickerDemo,
    children: [
      { path: '', redirectTo: 'timepicker-time-input', pathMatch: 'full' },
      { path: 'timepicker-time-input', component: TimepickerTimeInputDemo },
      { path: 'timepicker-time-explicit-wrapped', component: TimepickerTimeInputExplicitWrapperDemo },
    ],
  },
];

export const ROUTING: ModuleWithProviders = RouterModule.forChild(ROUTES);
