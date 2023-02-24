import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  selectedDepartment: string = '';
  department = this.dataService.department;
  employeeId = new FormControl('', [Validators.required]);
  supervisorId = new FormControl('', []);
  name = new FormControl('', [Validators.required]);
  position = new FormControl('', [Validators.required]);
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private dataService: DataService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  getErrorMessage(formControl: FormControl) {
    if (formControl.hasError('required')) {
      return 'You must enter a value!';
    }
    return formControl.hasError('email') ? 'Not a valid email!' : '';
  }

  findSupervisorName(id: string) {
    const matchedSupervisor = this.dataService.users.filter((data) => {
      return data.employeeID === id;
    })[0]

    return matchedSupervisor?.name ? matchedSupervisor?.name : '-';
  }

  findDepartmentID() {
    const matchedDepartment = this.dataService.department.filter((data) => {
      return data.deptName === this.selectedDepartment;
    })[0];
    return matchedDepartment.deptID;
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
      "FWAStatus": false
    } :
      {
        "employeeID": this.employeeId.value,
        "name": this.name.value,
        "password": newPassword,
        "email": this.email.value,
        "position": this.position.value,
        "deptID": this.findDepartmentID()
      };
    this.dataService.users.push(newUser);
    this.openSnackBar("Successfully Registered New User!", "Close");
    this.resetForm();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
