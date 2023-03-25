import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
import { ApiService } from 'src/app/api/api.service';
import { LocalService } from 'src/app/local/local.service';

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
  employeeData: any;
  employeesList: any;
  scheduleData: any;
  selectedDate: string = '';
  newScheduleID: number = 0;

  location = new FormControl('', [Validators.required]);
  hours = new FormControl('', [Validators.required]);
  report = new FormControl('', [Validators.required]);
  buttonText: string;

  constructor(
    private apiService: ApiService,
    private localService: LocalService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getUserData();
    this.getEmployeesList();
    this.generateScheduleID();
  }

  getErrorMessage() {
    return 'You must enter a value!'; // assume all errors are Validators.required errors
  }

  getUserData() {
    this.employeeData = this.localService.getUserData();
  }

  getEmployeesList() {
    this.apiService.getEmployees().subscribe((data: any) => {
      if (data.isSucess) this.employeesList = data.data;
    })
  }

  getDateSchedule(date: string) {
    this.resetForm();
    this.selectedDate = moment(date).format('Y-MM-DD');
    this.apiService.getSchedule({ date: this.selectedDate, employeeID: this.employeeData.employeeID }).subscribe((data: any) => {
      if (data.isFound) {
        this.scheduleData = data.data;
        this.location.setValue(this.scheduleData.workLocation);
        this.hours.setValue(this.scheduleData.workHours);
        this.report.setValue(this.scheduleData.workReport);
        this.buttonText = 'Update';
      } else {
        this.scheduleData = null;
        this.buttonText = 'Create';
      }
    })
  }

  findSupervisorName(supvID: string) {
    const matchedSupervisor = this.employeesList.filter(e => e.employeeID === supvID)[0];
    return matchedSupervisor?.name ? matchedSupervisor?.name : '-';
  }

  resetForm() {
    this.selectedDate = '';
    this.location.reset();
    this.hours.reset();
    this.report.reset();
  }

  generateScheduleID() {
    this.apiService.getNewScheduleID().subscribe((data: any) => {
      if (data.isSuccess) this.newScheduleID = data.id;
    })
  }

  submitForm() {
    let newSchedule: any;
    if (this.scheduleData) {
      newSchedule = {
        ...this.scheduleData,
        workLocation: this.location.value,
        workHours: this.hours.value,
        workReport: this.report.value
      };
      this.apiService.updateSchedule(newSchedule).subscribe((data: any) => {
        if (data.isUpdated) {
          this.openSnackBar("Successfully Updated Daily Schedule!", "Close");
          this.resetForm();
        }
      });
    } else {
      newSchedule = {
        scheduleID: this.newScheduleID,
        date: this.selectedDate,
        workLocation: this.location.value,
        workHours: this.hours.value,
        workReport: this.report.value,
        supervisorComments: "",
        employeeID: this.employeeData.employeeID
      };
      this.apiService.insertSchedule(newSchedule).subscribe((data: any) => {
        if (data.isSuccess) {
          this.openSnackBar(data.message, "Close");
          this.resetForm();
        }
      })
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
