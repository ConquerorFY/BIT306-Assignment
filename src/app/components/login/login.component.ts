import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api/api.service';
import { LocalService } from 'src/app/local/local.service';

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

  constructor(
    private router: Router,
    private apiService: ApiService,
    private localService: LocalService
  ) { }

  ngOnInit(): void {
  }

  validateLogin() {
    const formBody = { employeeID: this.employeeID, password: this.password };
    this.apiService.login(formBody).subscribe((data: any) => {
      if (data.isSucceed) {
        this.showString = data.message;
        this.localService.writeToLocalCache(data.data);
        this.router.navigate(['/home'])
      } else {
        this.showString = data.message;
      }
    })
  }

  submit() {
    this.validateLogin();
    this.clear();
  }

  clear() {
    this.employeeID = "";
    this.password = "";
    this.show = true;
  }
}