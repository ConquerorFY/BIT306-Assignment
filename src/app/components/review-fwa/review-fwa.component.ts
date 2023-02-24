import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

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
  pendingRequests = this.findEmployeeRequests("Pending");
  acceptedRequests = this.findEmployeeRequests("Accepted");
  rejectedRequests = this.findEmployeeRequests("Rejected");

  constructor(private dataService: DataService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  findEmployeeRequests(status: string) {
    const supvId = this.dataService.loggedInUserData.employeeID;
    let employeeIdList = [];
    let requests = [];

    // Find all employee id under the supervisor
    for (let e of this.dataService.users) {
      if (e?.supvID === supvId) {
        employeeIdList.push(e.employeeID);
      }
    }

    // Find all the employees' request based on status
    for (let r of this.dataService.fwa) {
      if (employeeIdList.indexOf(r.employeeID) > -1 && r.status === status) {
        requests.push(r);
      }
    }

    return requests;
  }

  openDialog(requestId: number): void {
    this.dataService.reviewFwaSelectedRequests = requestId;
    this.dialog.open(DialogAnimationsExampleDialog);
  }
}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: './dialog-animations-example-dialog.html',
  styleUrls: ['./dialog-animations-example-dialog.css']
})
export class DialogAnimationsExampleDialog implements OnInit {
  selectedRequest = null;
  comments = '';

  constructor(public dialogRef: MatDialogRef<DialogAnimationsExampleDialog>, public dataService: DataService, private router: Router) { }

  ngOnInit() {
    this.getSelectedRequestsData();
  }

  getSelectedRequestsData() {
    this.selectedRequest = this.dataService.fwa.filter((data) => {
      return data.requestID === this.dataService.reviewFwaSelectedRequests;
    })[0];
  }

  inputValue(e: any) {
    this.comments = e.target.value;
    // console.log(this.comments);
  }

  handleClick(status: string) {
    // set request status and comment
    for (let i = 0; i < this.dataService.fwa.length; i++) {
      if (this.dataService.fwa[i].requestID === this.selectedRequest.requestID) {
        this.dataService.fwa[i].status = status;
        this.dataService.fwa[i].comment = this.comments;
      }
    }
    // set employee status
    for(let i = 0; i < this.dataService.users.length; i++) {
      if (this.dataService.users[i].employeeID === this.selectedRequest.employeeID) {
        this.dataService.users[i].FWAStatus = status;
      }
    }
    this.dialogRef.close();
    this.router.navigate(['/home']);
  }
}
