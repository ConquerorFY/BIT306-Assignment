import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/api/api.service';
import { LocalService } from 'src/app/local/local.service';

@Component({
  selector: 'app-submit-fwa',
  templateUrl: './submit-fwa.component.html',
  styleUrls: ['./submit-fwa.component.css']
})
export class SubmitFwaComponent implements OnInit {
  workType = new FormControl('', [Validators.required]);
  description = new FormControl('', [Validators.required]);
  reason = new FormControl('', [Validators.required]);

  newRequestID: number = 0;

  constructor(
    private apiService: ApiService,
    private localService: LocalService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.apiService.getNewFWARequestID().subscribe((data: any) => {
      if (data.isSucceed) this.newRequestID = data.id;
    })
  }

  getErrorMessage(formControl: FormControl) {
    return 'You must enter a value!';
  }

  resetForm() {
    this.workType.reset();
    this.description.reset();
    this.reason.reset();
  }

  getCurrentDate() {
    let date = new Date();
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  }

  getEmployeeID() {
    return this.localService.getUserData().employeeID;
  }

  submitForm() {
    let newFwa = {
      requestID: this.newRequestID,
      requestDate: this.getCurrentDate(),
      workType: this.workType.value,
      description: this.description.value,
      reason: this.reason.value,
      status: "Pending",
      comment: "",
      employeeID: this.getEmployeeID()
    };
    this.apiService.insertFWA(newFwa).subscribe((data: any) => {
      if (data.isSucceed) {
        this.openSnackBar(data.message, "Close");
        this.resetForm();
      }
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
