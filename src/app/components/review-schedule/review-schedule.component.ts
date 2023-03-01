import { Component, OnInit } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import moment from 'moment';
import Schedule from 'src/app/interfaces/schedule';
import { DataService } from 'src/app/services/data.service';

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
  selector: 'app-review-schedule',
  templateUrl: './review-schedule.component.html',
  styleUrls: ['./review-schedule.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_ORG },
  ],
})
export class ReviewScheduleComponent {
  selectedDate: string = '';
  displayedColumns: string[] = [
    "Schedule ID",
    "Schedule Date",
    "Work Location",
    "Work Hours",
    "Work Report",
    "Supervisor Comments",
    "Employee ID"
  ];
  scheduleData: Schedule[];

  constructor(private dataService: DataService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  getDateSchedule(date: string) {
    this.selectedDate = moment(date).format('Y-MM-DD');
    this.getEmployeeWorkSchedules();
  }

  getEmployeeWorkSchedules(): void {
    const supvID = this.dataService.loggedInUserData.employeeID;
    let employeeIDs: string[] = []; // need to initialize an empty array if want to straight use push() or other array methods without assigning an array (as below)
    let scheduleData: Schedule[] = [];

    // Get all employee IDs under the supervisor
    for (let i = 0; i < this.dataService.users.length; i++) {
      if (this.dataService.users[i].supvID === supvID) employeeIDs.push(this.dataService.users[i].employeeID);
    }

    // Get all work schedules related to the employee IDs and with the same selected date
    for (let i = 0; i < this.dataService.schedules.length; i++) {
      if (employeeIDs.indexOf(this.dataService.schedules[i].employeeID) > -1 && this.dataService.schedules[i].date === this.selectedDate) scheduleData.push(this.dataService.schedules[i]);
    }

    this.scheduleData = scheduleData;
  }

  openDialog(scheduleId: number): void {
    this.dataService.reviewSelectedScheduleID = scheduleId;
    this.dialog.open(DialogAnimationsExampleDialog);
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: './dialog-animations-example-dialog.html',
  styleUrls: ['./dialog-animations-example-dialog.css']
})
export class DialogAnimationsExampleDialog implements OnInit {
  selectedSchedule: Schedule;
  comments = '';

  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>, public dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.getSelectedRequestsData();
  }

  getSelectedRequestsData() {
    this.selectedSchedule = this.dataService.schedules.filter((data) => {
      return data.scheduleID === this.dataService.reviewSelectedScheduleID;
    })[0];
  }

  inputValue(e: any) {
    this.comments = e.target.value;
    // console.log(this.comments);
  }

  handleClick(status: string) {
    if (status === "Save") {
      // set schedule comment
      for (let i = 0; i < this.dataService.schedules.length; i++) {
        if (this.dataService.schedules[i].scheduleID === this.selectedSchedule.scheduleID) {
          this.dataService.schedules[i].supervisorComments = this.comments;
        }
      }
      this.dialogRef.close();
      this.router.navigate(['/home']);
    } else if (status === "Cancel") {
      this.dialogRef.close();
    }
  }
}
