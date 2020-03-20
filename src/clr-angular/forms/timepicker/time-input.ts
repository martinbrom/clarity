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
import { filter, switchMap } from 'rxjs/operators';
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
import { DatepickerFocusService } from '../datepicker/providers/datepicker-focus.service';
import { TimeNavigationService } from './providers/time-navigation.service';
import { TimepickerViewEnum } from './utils/constants';

// TODO: Seconds? Milliseconds?
@Directive({
  selector: '[clrTime]',
  host: {
    '[class.clr-input]': 'true',
  },
  providers: [],
})
export class ClrTimeInput extends WrappedFormControl<ClrTimeContainer> implements OnInit, AfterViewInit, OnDestroy {
  @Input() placeholder: string;
  @Output('clrTimeChange') timeChange: EventEmitter<Date> = new EventEmitter<Date>(false);
  @Input('clrTime')
  set time(time: Date) {
    // TODO:
    if (this.previousTimeChange !== time) {
      this.updateTime(this.getValidTimeValue(time));
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
    this.timeIOService.setHourStep(step);
  }

  @Input('clrMinuteStep')
  set minuteStep(step: number) {
    this.timeIOService.setMinuteStep(step);
  }

  @Input('clrView')
  set view(view: TimepickerViewEnum) {
    // TODO: set where? maybe belongs onto the container
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
    @Optional() private timeIOService: TimeIOService,
    @Optional() private timepickerEnabledService: TimepickerEnabledService,
    @Optional() private timeNavigationService: TimeNavigationService,
    @Optional() private timeFormControlService: TimeFormControlService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() private focusService: FocusService,
    private datepickerFocusService: DatepickerFocusService
  ) {
    super(viewContainerRef, ClrTimeContainer, injector, control, renderer, el);
  }

  ngOnInit() {
    super.ngOnInit();
    this.populateServicesFromContainerComponent();

    this.subscriptions.push(
      this.listenForUserSelectedDayChanges(),
      this.listenForControlValueChanges(),
      this.listenForTouchChanges(),
      this.listenForDirtyChanges(),
      this.listenForInputRefocus()
    );
  }

  ngAfterViewInit() {
    // I don't know why I have to do this but after using the new HostWrapping Module I have to delay the processing
    // of the initial Input set by the user to here. If I do not 2 issues occur:
    // 1. The Input setter is called before ngOnInit. ngOnInit initializes the services without which the setter fails.
    // 2. The Renderer doesn't work before ngAfterViewInit (It used to before the new HostWrapping Module for some reason).
    // I need the renderer to set the value property on the input to make sure that if the user has supplied a Date
    // input object, we reflect it with the right date on the input field using the IO service. I am not sure if
    // these are major issues or not but just noting them down here.
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
    const validDateValue = this.timeIOService.getTimeValueFromTimeString(target.value);
    if (this.usingClarityTimepicker() && validDateValue) {
      this.updateTime(validDateValue, true);
    } else if (this.usingNativeTimepicker()) {
      const [year, month, day] = target.value.split('-');
      this.updateTime(new Date(+year, +month - 1, +day), true);
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

  private populateServicesFromContainerComponent() {
    if (!this.container) {
      this.timeIOService = this.getProviderFromContainer(TimeIOService);
      this.timepickerEnabledService = this.getProviderFromContainer(TimepickerEnabledService);
      this.timeFormControlService = this.getProviderFromContainer(TimeFormControlService);
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
    const date = this.getValidTimeValue(value);

    if (setByUserInteraction) {
      this.emitTimeOutput(date);
    } else {
      this.previousTimeChange = date;
    }

    if (this.timeNavigationService) {
      this.timeNavigationService.selectedDay = date ? new TimeModel(date.getHours(), date.getMinutes()) : null;
    }

    this.updateInput(date);
  }

  private updateInput(time: Date) {
    // TODO: Rewrite from date
    if (time) {
      const timeString = this.timeIOService.toLocaleDisplayFormatString(time);
      if (this.usingNativeTimepicker()) {
        // valueAsDate expects UTC, date from input is time-zoned
        time.setMinutes(time.getMinutes() - time.getTimezoneOffset());
        this.renderer.setProperty(this.el.nativeElement, 'valueAsDate', time);
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
        filter(() => !this.datepickerFocusService.elementIsFocused(this.el.nativeElement))
      )
      .subscribe((value: string) => this.updateTime(this.timeIOService.getTimeValueFromTimeString(value)));
  }

  // TODO: Maybe remove
  private listenForUserSelectedDayChanges() {
    return this.timeNavigationService.selectedDayChange.subscribe(dayModel => this.updateTime(dayModel.toDate(), true));
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

  private listenForInputRefocus() {
    return this.timeNavigationService.selectedDayChange
      .pipe(filter(date => !!date))
      .subscribe(v => this.datepickerFocusService.focusInput(this.el.nativeElement));
  }
}
