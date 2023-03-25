import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/api/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  selectedDepartment: string = '';
  selectedSupervisorName: string = '-';

  department: any;
  employeeId = new FormControl('', [Validators.required]);
  supervisorId = new FormControl('', []);
  name = new FormControl('', [Validators.required]);
  position = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);

  displayedColumns = [
    "Employee ID",
    "Employee Name",
    "Employee Email",
    "Employee Position",
    "Employee Department"
  ]
  usersList: any;

  constructor(
    private apiService: ApiService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getDepartmentList();
    this.getEmployeesList();
  }

  findDeptName(deptID: number) {
    for (let d of this.department) {
      if (d.deptID === deptID) {
        return d.deptName;
      }
    }
    return '-';
  }

  getErrorMessage(formControl: FormControl) {
    if (formControl.hasError('required')) {
      return 'You must enter a value!';
    }
    return formControl.hasError('email') ? 'Not a valid email!' : '';
  }

  findSupervisorName(id: string) {
    this.apiService.getSupervisors().subscribe((data: any) => {
      if (data.isSucess) {
        const allSupervisorsList = data.data;
        const matchedSupervisor = allSupervisorsList.filter(s => s.employeeID === id)[0];
        this.selectedSupervisorName = matchedSupervisor?.name;
      } else {
        this.selectedSupervisorName = '-'
      }
    })
  }

  findDepartmentID() {
    return this.department.filter(d => d.deptName === this.selectedDepartment)[0].deptID;
  }

  getDepartmentList() {
    this.apiService.getAllDepartments().subscribe((data: any) => {
      this.department = data;
    })
  }

  getEmployeesList() {
    this.apiService.getEmployees().subscribe((data: any) => {
      if (data.isSucess) {
        this.usersList = data.data;
      }
    })
  }

  randomPasswordGenerator(length: number) {
    const words = "abcdefghijklmnopqrstuvwxyz0123456789";
    let password = '';
    for (let i = 0; i < length; i++) {
      password += words[Math.floor(Math.random() * words.length)];
    }
    return password;
  }

  resetForm() {
    this.selectedDepartment = '';
    this.employeeId.reset();
    this.supervisorId.reset();
    this.name.reset();
    this.position.reset();
    this.email.reset();
  }

  submitForm() {
    let newPassword = this.randomPasswordGenerator(8);
    let newUser = this.supervisorId.value.length > 0 ? {
      "employeeID": this.employeeId.value,
      "name": this.name.value,
      "password": newPassword,
      "email": this.email.value,
      "position": this.position.value,
      "supvID": this.supervisorId.value,
      "deptID": this.findDepartmentID(),
      "FWAStatus": "New"
    } :
      {
        "employeeID": this.employeeId.value,
        "name": this.name.value,
        "password": newPassword,
        "email": this.email.value,
        "position": this.position.value,
        "deptID": this.findDepartmentID()
      };
    this.apiService.registerAccount(newUser).subscribe((data: any) => {
      if (data.isSucceed) {
        this.openSnackBar(data.message, "Close");
        this.resetForm();
        this.getEmployeesList();
      } else {
        this.openSnackBar(data.message, "Close");
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
