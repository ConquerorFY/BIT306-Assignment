import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  employeeID: string = "";
  password: string = "";
  show: boolean = false;
  showString: string = "";

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
  }

  validateLogin(): boolean {
    for (let i = 0; i < this.dataService.users.length; i++) {
      if (this.dataService.users[i].employeeID === this.employeeID) {
        if (this.dataService.users[i].password === this.password) {
          this.dataService.isLoggedIn = true;
          this.dataService.loggedInUserData = this.dataService.users[i]
          this.showString = "Login success !!";
          return true;
        }
      }
    }
    this.dataService.isLoggedIn = false;
    this.showString = "Incorrect Input! Please try again!";
    return false;
  }

  submit() {
    const validate = this.validateLogin();
    this.clear();

    if (validate) {
      this.router.navigate(['/home']);
    }
  }

  clear() {
    this.employeeID = "";
    this.password = "";
    this.show = true;
  }
}