/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  PLATFORM_ID,
  Renderer2,
  Self,
  ViewContainerRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { filter, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { FocusService } from '../common/providers/focus.service';
import { WrappedFormControl } from '../common/wrapped-control';
import { isBooleanAttributeSet } from '../../utils/component/is-boolean-attribute-set';
import { ClrTimeContainer } from './time-container';
import { timesAreEqual } from './utils/time-utils';
import { TimeFormControlService } from './providers/time-form-control.service';
import { TimeIOService } from './providers/time-io.service';
import { TimepickerEnabledService } from './providers/timepicker-enabled.service';
import { TimeModel } from './model/time.model';
import { TimeNavigationService } from './providers/time-navigation.service';
import { LocaleHelperService } from './providers/locale-helper.service';
import { TimeFormattingService } from './providers/time-formatting.service';

// TODO: Seconds? Milliseconds?
@Directive({
  selector: '[clrTime]',
  host: {
    '[class.clr-input]': 'true',
  },
  providers: [
    TimeIOService,
    LocaleHelperService,
    TimeFormattingService,
    TimepickerEnabledService,
    TimeFormControlService,
  ],
})
export class ClrTimeInput extends WrappedFormControl<ClrTimeContainer> implements OnInit, AfterViewInit, OnDestroy {
  @Input() placeholder: string;
  @Output('clrTimeChange') timeChange: EventEmitter<Date> = new EventEmitter<Date>(false);
  @Input('clrTime')
  set time(time: Date) {
    if (this.previousTimeChange !== time) {
      this.updateTime(time);
    }

    if (!this.initialClrTimeInputValue) {
      this.initialClrTimeInputValue = time;
    }
  }

  @Input()
  set min(timeString: string) {
    this.timeIOService.setMinTime(timeString);
  }

  @Input()
  set max(timeString: string) {
    this.timeIOService.setMaxTime(timeString);
  }

  @Input('clrHourStep')
  set hourStep(step: number) {
    if (this.timeNavigationService) {
      this.timeNavigationService.setHourStep(step);
    }
  }

  @Input('clrMinuteStep')
  set minuteStep(step: number) {
    if (this.timeNavigationService) {
      this.timeNavigationService.setMinuteStep(step);
    }
  }

  protected index = 1;
  private initialClrTimeInputValue: Date;
  private previousTimeChange: Date;

  constructor(
    viewContainerRef: ViewContainerRef,
    injector: Injector,
    protected el: ElementRef,
    protected renderer: Renderer2,
    @Self()
    @Optional()
    protected control: NgControl,
    @Optional() private container: ClrTimeContainer,
    private timeIOService: TimeIOService,
    private timepickerEnabledService: TimepickerEnabledService,
    private timeNavigationService: TimeNavigationService,
    @Optional() private timeFormControlService: TimeFormControlService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() private focusService: FocusService
  ) {
    super(viewContainerRef, ClrTimeContainer, injector, control, renderer, el);
  }

  ngOnInit() {
    super.ngOnInit();

    this.subscriptions.push(
      this.listenForUserTimeChanges(),
      this.listenForControlValueChanges(),
      this.listenForTouchChanges(),
      this.listenForDirtyChanges()
    );
  }

  // See date-input.ts, ngAfterViewInit()
  ngAfterViewInit() {
    this.processInitialInputs();
  }

  @HostListener('focus')
  setFocusStates() {
    this.setFocus(true);
  }

  @HostListener('blur')
  triggerValidation() {
    super.triggerValidation();
    this.setFocus(false);
  }

  @HostBinding('attr.placeholder')
  get placeholderText(): string {
    return this.placeholder ? this.placeholder : this.timeIOService.placeholderText;
  }

  @HostBinding('attr.type')
  get inputType(): string {
    return isPlatformBrowser(this.platformId) && this.usingNativeTimepicker() ? 'time' : 'text';
  }

  @HostListener('change', ['$event.target'])
  onValueChange(target: HTMLInputElement) {
    // TODO: Implement
    const validTimeValue = this.timeIOService.getTimeValueFromTimeString(target.value);
    if (this.usingClarityTimepicker() && validTimeValue) {
      this.updateTime(validTimeValue, true);
    } else if (this.usingNativeTimepicker()) {
      const [hour, month, day] = target.value.split('-');
      this.updateTime(new Date(+hour, +month - 1, +day), true);
    } else {
      this.emitTimeOutput(null);
    }
  }

  @HostBinding('disabled')
  @Input('disabled')
  set disabled(value: boolean | string) {
    if (this.timeFormControlService) {
      this.timeFormControlService.setDisabled(isBooleanAttributeSet(value));
    }
  }
  get disabled() {
    if (this.timeFormControlService) {
      return this.timeFormControlService.disabled;
    }
    return null;
  }

  private usingClarityTimepicker() {
    return this.timepickerEnabledService.isEnabled;
  }

  private usingNativeTimepicker() {
    return !this.timepickerEnabledService.isEnabled;
  }

  private setFocus(focus: boolean) {
    if (this.focusService) {
      this.focusService.focused = focus;
    }
  }

  private processInitialInputs() {
    if (this.timepickerHasFormControl()) {
      this.updateTime(this.timeIOService.getTimeValueFromTimeString(this.control.value));
    } else {
      this.updateTime(this.initialClrTimeInputValue);
    }
  }

  private updateTime(value: Date, setByUserInteraction = false) {
    const time = this.getValidTimeValue(value);

    if (setByUserInteraction) {
      this.emitTimeOutput(time);
    } else {
      this.previousTimeChange = time;
    }

    if (this.timeNavigationService) {
      this.timeNavigationService.value = time ? new TimeModel(time.getHours(), time.getMinutes()) : null;
    }

    this.updateInput(time);
  }

  private updateInput(time: Date) {
    if (time) {
      const timeString = this.timeIOService.toLocaleDisplayFormatString(time);
      if (this.usingNativeTimepicker()) {
        this.renderer.setProperty(this.el.nativeElement, 'value', this.timeIOService.toISOFormat(time));
      } else if (this.timepickerHasFormControl() && timeString !== this.control.value) {
        this.control.control.setValue(timeString);
      } else {
        this.renderer.setProperty(this.el.nativeElement, 'value', timeString);
      }
    } else {
      this.renderer.setProperty(this.el.nativeElement, 'value', '');
    }
  }

  private getValidTimeValue(time: Date) {
    if (this.timeIOService) {
      const timeString = this.timeIOService.toLocaleDisplayFormatString(time);
      return this.timeIOService.getTimeValueFromTimeString(timeString);
    } else {
      return null;
    }
  }

  private emitTimeOutput(time: Date) {
    if (!timesAreEqual(time, this.previousTimeChange)) {
      this.timeChange.emit(time);
      this.previousTimeChange = time;
    } else if (!time && this.previousTimeChange) {
      this.timeChange.emit(null);
      this.previousTimeChange = null;
    }
  }

  private timepickerHasFormControl() {
    return !!this.control;
  }

  private listenForControlValueChanges() {
    return of(this.timepickerHasFormControl())
      .pipe(
        filter(hasControl => hasControl),
        switchMap(() => this.control.valueChanges),
        // only update date value if not being set by user
        // filter(() => !this.datepickerFocusService.elementIsFocused(this.el.nativeElement))
        tap(() => console.log('loop'))
      )
      .subscribe((value: string) => this.updateTime(this.timeIOService.getTimeValueFromTimeString(value)));
  }

  private listenForUserTimeChanges() {
    return this.timeNavigationService.valueChanged().subscribe(timeModel => this.updateTime(timeModel.toDate(), true));
  }

  private listenForTouchChanges() {
    return this.timeFormControlService.touchedChange
      .pipe(filter(() => this.timepickerHasFormControl()))
      .subscribe(() => this.control.control.markAsTouched());
  }

  private listenForDirtyChanges() {
    return this.timeFormControlService.dirtyChange
      .pipe(filter(() => this.timepickerHasFormControl()))
      .subscribe(() => this.control.control.markAsDirty());
  }
}
