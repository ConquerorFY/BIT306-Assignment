import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
import Schedule from 'src/app/interfaces/schedule';
import Employee from 'src/app/interfaces/employee';
import { Router } from '@angular/router';

export const MY_FORMATS_ORG = {
  parse: {
    dateInput: 'MM/DD',
  },
  display: {
    dateInput: 'MM/DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-update-schedule',
  templateUrl: './update-schedule.component.html',
  styleUrls: ['./update-schedule.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_ORG },
  ],
})
export class UpdateScheduleComponent implements OnInit {
  employeeData: Employee;
  scheduleData: Schedule;
  selectedDate: string = '';
  location = new FormControl('', [Validators.required]);
  hours = new FormControl('', [Validators.required]);
  report = new FormControl('', [Validators.required]);
  buttonText: string;

  constructor(private dataService: DataService, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.employeeData = this.dataService.loggedInUserData;
  }

  getErrorMessage() {
    return 'You must enter a value!'; // assume all errors are Validators.required errors
  }

  getDateSchedule(date: string) {
    this.selectedDate = moment(date).format('Y-MM-DD');
    if (this.getDateScheduleIfExist()) {
      this.scheduleData = this.getDateScheduleIfExist();
      this.location.setValue(this.scheduleData.workLocation);
      this.hours.setValue(this.scheduleData.workHours);
      this.report.setValue(this.scheduleData.workReport);
      this.buttonText = 'Update';
    } else {
      this.scheduleData = null;
      this.buttonText = 'Create';
    }
  }

  findSupervisorName(id: string) {
    const matchedSupervisor = this.dataService.users.filter((data) => {
      return data.employeeID === id;
    })[0]

    return matchedSupervisor?.name ? matchedSupervisor?.name : '-';
  }

  resetForm() {
    this.selectedDate = '';
    this.location.reset();
    this.hours.reset();
    this.report.reset();
  }

  getDateScheduleIfExist(): Schedule {
    for (let schedule of this.dataService.schedules) {
      if (schedule.date === this.selectedDate) {
        return schedule;
      }
    }
    return null;
  }

  removeExistingDateScheduleIfAny() {
    let targetIndex = 0;
    for (targetIndex; targetIndex < this.dataService.schedules.length; targetIndex++) {
      if (this.selectedDate === this.dataService.schedules[targetIndex].date) break;
    }
    if (targetIndex < this.dataService.schedules.length) this.dataService.schedules.splice(targetIndex, 1);
  }

  generateScheduleID() {
    let maxID = 0;
    for (let schedule of this.dataService.schedules) {
      if (schedule.scheduleID > maxID) {
        maxID = schedule.scheduleID;
      }
    }
    return maxID + 1;
  }

  submitForm() {
    let newSchedule: Schedule;
    if (this.scheduleData) {
      this.removeExistingDateScheduleIfAny();
      newSchedule = {
        ...this.scheduleData,
        workLocation: this.location.value,
        workHours: this.hours.value,
        workReport: this.report.value
      };
    } else {
      newSchedule = {
        scheduleID: this.generateScheduleID(),
        date: this.selectedDate,
        workLocation: this.location.value,
        workHours: this.hours.value,
        workReport: this.report.value,
        supervisorComments: "",
        employeeID: this.employeeData.employeeID
      }
    }
    this.dataService.schedules.push(newSchedule);
    this.openSnackBar("Successfully Updated Daily Schedule!", "Close");
    this.resetForm();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}
