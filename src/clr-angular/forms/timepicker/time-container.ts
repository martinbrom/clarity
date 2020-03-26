/*
 * Copyright (c) 2016-2020 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { Component, Optional, ContentChild, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgControl } from '@angular/forms';

import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { DynamicWrapper } from '../../utils/host-wrapping/dynamic-wrapper';
import { IfErrorService } from '../common/if-error/if-error.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { FocusService } from '../common/providers/focus.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ClrLabel } from '../common/label';

import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrPopoverPositions } from '../../utils/popover/enums/positions.enum';
import { ClrPopoverEventsService } from '../../utils/popover/providers/popover-events.service';
import { ClrPopoverPositionService } from '../../utils/popover/providers/popover-position.service';
import { ViewManagerService } from '../timepicker/providers/view-manager.service';
import { TimeFormControlService } from './providers/time-form-control.service';
import { TimepickerEnabledService } from './providers/timepicker-enabled.service';
import { ClrPopoverPosition } from '../../utils/popover/interfaces/popover-position.interface';
import { TimepickerViewEnum } from './utils/constants';
import { TimeNavigationService } from './providers/time-navigation.service';

@Component({
  selector: 'clr-time-container',
  template: `
      <ng-content select="label"></ng-content>
      <label *ngIf="!label && addGrid()"></label>
      <div class="clr-control-container" [ngClass]="controlClass()">
        <div class="clr-input-wrapper" clrPopoverAnchor>
          <div class="clr-input-group" clrPopoverOpenCloseButton [class.clr-focus]="focus">
            <ng-content select="[clrTime]"></ng-content>
          </div>
          <clr-timepicker-view-manager *clrPopoverContent="open at popoverPosition; outsideClickToClose: true; scrollToClose: true" clrFocusTrap></clr-timepicker-view-manager>
          <clr-icon class="clr-validate-icon" shape="exclamation-circle"></clr-icon>
        </div>
        <ng-content select="clr-control-helper" *ngIf="!invalid"></ng-content>
        <ng-content select="clr-control-error" *ngIf="invalid"></ng-content>
      </div>
    `,
  providers: [
    ControlIdService,
    ClrPopoverToggleService,
    ClrPopoverEventsService,
    ClrPopoverPositionService,
    IfErrorService,
    ControlClassService,
    FocusService,
    NgControlService,
    TimepickerEnabledService,
    TimeFormControlService,
    ViewManagerService,
  ],
  host: {
    '[class.clr-form-control-disabled]': 'isInputTimeDisabled',
    '[class.clr-form-control]': 'true',
    '[class.clr-row]': 'addGrid()',
  },
})
export class ClrTimeContainer implements DynamicWrapper, OnInit, OnDestroy {
  _dynamic: boolean;
  invalid = false;
  focus = false;
  control: NgControl;
  @ContentChild(ClrLabel) label: ClrLabel;

  @Input('clrPosition')
  set clrPosition(position: string) {
    if (position && ClrPopoverPositions[position]) {
      this.viewManagerService.position = ClrPopoverPositions[position];
    }
  }

  get popoverPosition(): ClrPopoverPosition {
    return this.viewManagerService.position;
  }

  @Input('clrView')
  set view(view: TimepickerViewEnum) {
    this.viewManagerService.currentView = view;
  }

  public get open() {
    return this.toggleService.open;
  }

  private subscriptions: Subscription[] = [];

  constructor(
    private toggleService: ClrPopoverToggleService,
    private timepickerEnabledService: TimepickerEnabledService,
    private timeFormControlService: TimeFormControlService,
    public commonStrings: ClrCommonStringsService,
    private ifErrorService: IfErrorService,
    private focusService: FocusService,
    private viewManagerService: ViewManagerService,
    private controlClassService: ControlClassService,
    @Optional() private layoutService: LayoutService,
    private ngControlService: NgControlService
  ) {
    this.subscriptions.push(
      this.focusService.focusChange.subscribe(state => {
        this.focus = state;
      }),
      this.ngControlService.controlChanges.subscribe(control => {
        this.control = control;
      }),
      this.toggleService.openChange.subscribe(state => {
        this.timeFormControlService.markAsTouched();
      })
    );
  }

  ngOnInit() {
    this.subscriptions.push(
      this.ifErrorService.statusChanges.subscribe(invalid => {
        this.invalid = invalid;
      })
    );
  }

  /**
   * Returns the classes to apply to the control
   */
  controlClass() {
    return this.controlClassService.controlClass(this.invalid, this.addGrid());
  }

  /**
   * Determines if the control needs to add grid classes
   */
  addGrid() {
    return this.layoutService && !this.layoutService.isVertical();
  }

  /**
   * Returns if the Timepicker is enabled or not. If disabled, hides the timepicker trigger.
   */
  get isEnabled(): boolean {
    return this.timepickerEnabledService.isEnabled;
  }

  /**
   * Return if Timepicker is disabled or not as Form Control
   */
  get isInputTimeDisabled(): boolean {
    /* clrForm wrapper or without clrForm */
    return (
      (this.control && this.control.disabled) || (this.timeFormControlService && this.timeFormControlService.disabled)
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
