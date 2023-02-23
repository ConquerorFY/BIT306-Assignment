import { Component, OnInit } from '@angular/core';
import employeeData from "../../../data/employee.json";
import { Router } from '@angular/router';

interface Employee {
  employeeID: number,
  name: string,
  username: string,
  password: string,
  email: string,
  position: string,
  deptID: number,
  FWAStatus: boolean
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = "";
  password: string = "";
  show: boolean = false;
  showString: string = "";
  employeeData: Employee[] = employeeData;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  validateLogin(): boolean {
    for(let i = 0; i < employeeData.length; i++) {
      if (employeeData[i].username === this.username) {
        if (employeeData[i].password === this.password) {
          localStorage.setItem("userData", JSON.stringify(employeeData[i]));
          this.showString = "Login success !!";
          return true;
        }
      }
    }
    this.showString = "Incorrect Input! Please try again!";
    return false;
  }

  submit() {
    const validate = this.validateLogin();
    this.clear();

    if(validate) {
      this.router.navigate(['/home']);
    }
  }

  clear() {
    this.username = "";
    this.password = "";
    this.show = true;
  }
}