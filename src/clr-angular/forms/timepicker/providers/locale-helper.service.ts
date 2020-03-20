/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FormatWidth, getLocaleTimeFormat } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';

/**
 * This service extracts the Angular CLDR data needed by the timepicker.
 */
@Injectable()
export class LocaleHelperService {
  constructor(@Inject(LOCALE_ID) public locale: string) {
    this.initializeLocaleDateFormat();
  }

  private _localeTimeFormat: string;

  get localeTimeFormat(): string {
    return this._localeTimeFormat;
  }

  private initializeLocaleDateFormat(): void {
    this._localeTimeFormat = getLocaleTimeFormat(this.locale, FormatWidth.Short);
  }
}
