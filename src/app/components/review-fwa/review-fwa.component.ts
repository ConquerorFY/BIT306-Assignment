import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { LocalService } from 'src/app/local/local.service';

@Component({
  selector: 'app-review-fwa',
  templateUrl: './review-fwa.component.html',
  styleUrls: ['./review-fwa.component.css']
})
export class ReviewFwaComponent implements OnInit {
  displayedColumns: string[] = [
    "Request ID",
    "Request Date",
    "Work Type",
    "Description",
    "Reason",
    "Status",
    "Comment",
    "Employee ID"
  ];
  pendingRequests: any;
  acceptedRequests: any;
  rejectedRequests: any;

  constructor(
    private apiService: ApiService,
    private localService: LocalService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.findEmployeeRequests();
  }

  findEmployeeRequests() {
    const supvId = this.localService.getUserData().employeeID;
    this.apiService.getFWA({ employeeID: supvId }).subscribe((data: any) => {
      if (data.isSucceed) {
        this.pendingRequests = data.data.pending;
        this.acceptedRequests = data.data.accepted;
        this.rejectedRequests = data.data.rejected;
      }
    });
  }

  openDialog(requestId: number): void {
    this.localService.selectedFwaRequestsID = requestId;
    this.dialog.open(DialogAnimationsExampleDialog);
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: './dialog-animations-example-dialog.html',
  styleUrls: ['./dialog-animations-example-dialog.css']
})
export class DialogAnimationsExampleDialog implements OnInit {
  selectedRequest: any;
  employeeList: any;
  comments = '';

  constructor(
    public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>,
    public apiService: ApiService,
    public localService: LocalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getSelectedRequestsData();
    this.getEmployeesList();
  }

  getSelectedRequestsData() {
    this.apiService.getSingleFWA({ requestID: this.localService.selectedFwaRequestsID }).subscribe((data: any) => {
      if (data.isSucceed) this.selectedRequest = data.data;
    })
  }

  getEmployeesList() {
    this.apiService.getEmployees().subscribe((data: any) => {
      if (data.isSucess) {
        this.employeeList = data.data;
      }
    })
  }

  getSelectedEmployee(empId: string) {
    return this.employeeList.filter((e) => e.employeeID === empId)[0];
  }

  inputValue(e: any) {
    this.comments = e.target.value;
    // console.log(this.comments);
  }

  handleClick(status: string) {
    let newFWARequestData = {
      ...this.selectedRequest,
      status,
      comment: this.comments,
    }
    let newEmployeeData = {
      ...this.getSelectedEmployee(this.selectedRequest.employeeID),
      FWAStatus: this.selectedRequest.workType
    }

    this.apiService.updateFWA(newFWARequestData).subscribe((data: any) => {
      if (data.isUpdated) {
        this.apiService.updateEmployee(newEmployeeData).subscribe((data: any) => {
          if (data.isSuccess) {
            this.dialogRef.close();
            this.router.navigate(['/home']);
          }
        })
      }
    })
  }
}
