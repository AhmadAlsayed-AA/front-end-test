import { Component } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import * as moment from 'moment';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ErrorModalComponent } from './components/error-modal/error-modal.component';
import { Order } from './order';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'front-end-test';
  isCalc: boolean = false;
  order: Order = new Order();
  ETA = new Date();
  minDate = new Date();
  CalculationForm: FormGroup = this.fb.group({
    OrderDate: ['', Validators.compose([Validators.required])],
    FabricType: ['', Validators.compose([Validators.required])],
    Quantity: [
      '',
      [Validators.required, Validators.max(100), Validators.min(1)],
    ],
  });
  /**
   *
   */
  constructor(private fb: FormBuilder, public dialog: MatDialog) {}
  ngOnInit() {}
  addBusinessDays = function (startingDate: any, daysToAdjust: any) {
    var newDate = new Date(startingDate.valueOf()),
      businessDaysLeft,
      isWeekend,
      direction;

    if (daysToAdjust === 0) {
      return startingDate;
    }
    direction = daysToAdjust > 0 ? 1 : -1;

    businessDaysLeft = Math.abs(daysToAdjust);
    while (businessDaysLeft) {
      newDate.setDate(newDate.getDate() + direction);
      isWeekend = newDate.getDay() in { 0: 'Sunday', 6: 'Saturday' };
      if (!isWeekend) {
        businessDaysLeft--;
      }
    }
    return newDate;
  };

  getETA() {
    if (this.CalculationForm.valid) {
      this.order = this.CalculationForm.value;
      var days = 0;
      this.isCalc = true;
      if (this.order.FabricType == 'cotton' && this.order.Quantity < 50) {
        days = 2;
      } else if (
        this.order.FabricType == 'cotton' &&
        this.order.Quantity >= 50
      ) {
        days = 3;
      } else if (this.order.FabricType == 'linen' && this.order.Quantity < 50) {
        days = 4;
      } else if (
        this.order.FabricType == 'linen' &&
        this.order.Quantity >= 50
      ) {
        days = 4;
      } else {
        this.openDialog();
        return;
      }
      this.ETA = new Date(this.addBusinessDays(this.order.OrderDate, days));
    } else this.openDialog();
  }
  openDialog(): void {
    this.dialog.open(ErrorModalComponent, {
      height: '200px',
      width: '800px',
    });
  }
}
