/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export function timesAreEqual(time1: Date, time2: Date) {
  if (time1 instanceof Date && time2 instanceof Date) {
    return time1.getHours() === time2.getHours() && time1.getMinutes() === time2.getMinutes();
  } else {
    return false;
  }
}
