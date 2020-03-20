/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// TODO: Extract from here and from datepicker
export const MOBILE_USERAGENT_REGEX: RegExp = /Mobi/i;

export const MAXIMUM_HOUR_VALUE = 23;
export const MAXIMUM_MINUTE_VALUE = 59;
export const DEFAULT_HOUR_STEP = 1;
// export const MINIMUM_HOUR_STEP = 1;
// export const MAXIMUM_HOUR_STEP = 24;
export const DEFAULT_MINUTE_STEP = 1;
// export const MINIMUM_MINUTE_STEP = 1;
// export const MAXIMUM_MINUTE_STEP = 60;

export const enum TimepickerViewEnum {
  ANALOGVIEW = 'ANALOGVIEW',
  DIGITALVIEW = 'DIGITALVIEW',
}
