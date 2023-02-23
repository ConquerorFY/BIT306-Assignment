import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-submit-fwa',
  templateUrl: './submit-fwa.component.html',
  styleUrls: ['./submit-fwa.component.css']
})
export class SubmitFwaComponent implements OnInit {
  workType = new FormControl('', [Validators.required]);
  description = new FormControl('', [Validators.required]);
  reason = new FormControl('', [Validators.required]);

  constructor(private dataService: DataService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  getErrorMessage(formControl: FormControl) {
    return 'You must enter a value!';
  }

  resetForm() {
    this.workType.reset();
    this.description.reset();
    this.reason.reset();
  }

  getLastRequestID() {
    return this.dataService.fwa.length;
  }

  getCurrentDate() {
    let date = new Date();
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  }

  getEmployeeID() {
    return this.dataService.loggedInUserData.employeeID;
  }

  submitForm() {
    let newFwa = {
      requestID: this.getLastRequestID() + 1,
      requestDate: this.getCurrentDate(),
      workType: this.workType.value,
      description: this.description.value,
      reason: this.reason.value,
      status: "Pending",
      comment: "",
      employeeID: this.getEmployeeID()
    };
    this.dataService.fwa.push(newFwa);
    this.openSnackBar("Successfully Submitted New FWA Request!", "Close");
    this.resetForm();
    console.log(this.dataService.fwa);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
