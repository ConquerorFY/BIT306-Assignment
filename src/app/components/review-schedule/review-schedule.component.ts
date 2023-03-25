import { Component, OnInit } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
  scheduleData: any;

  constructor(
    private apiService: ApiService,
    private localService: LocalService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  getDateSchedule(date: string) {
    this.selectedDate = moment(date).format('Y-MM-DD');
    this.getEmployeeWorkSchedules();
  }

  getEmployeeWorkSchedules(): void {
    const supvID = this.localService.getUserData().employeeID;
    this.apiService.getSchedules({ employeeID: supvID }).subscribe((data: any) => {
      this.scheduleData = data.filter(s => s.date === this.selectedDate);
    })
  }

  openDialog(scheduleId: number): void {
    this.localService.selectedScheduleID = scheduleId;
    this.dialog.open(DialogAnimationsExampleDialog);
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: './dialog-animations-example-dialog.html',
  styleUrls: ['./dialog-animations-example-dialog.css']
})
export class DialogAnimationsExampleDialog implements OnInit {
  selectedSchedule: any;
  comments = '';

  constructor(
    public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>,
    public apiService: ApiService,
    public localService: LocalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getSelectedRequestsData();
  }

  getSelectedRequestsData() {
    this.apiService.getScheduleBasedOnID({ scheduleID: this.localService.selectedScheduleID }).subscribe((data: any) => {
      if (data.isSuccess) this.selectedSchedule = data.data;
    })
  }

  inputValue(e: any) {
    this.comments = e.target.value;
    // console.log(this.comments);
  }

  handleClick(status: string) {
    if (status === "Save") {
      let newScheduleData = {
        ...this.selectedSchedule,
        supervisorComments: this.comments
      }
      this.apiService.updateSchedule(newScheduleData).subscribe((data: any) => {
        if (data.isUpdated) {
          this.dialogRef.close();
          this.router.navigate(['/home']);
        }
      })
    } else if (status === "Cancel") {
      this.dialogRef.close();
    }
  }
}
