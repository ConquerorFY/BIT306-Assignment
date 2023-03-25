import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ApiService } from './api/api.service';
import { LocalService } from './local/local.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bit306';
  isLoginPage = false;
  userData: any;
  dataLoaded: boolean = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private localService: LocalService
  ) {
    router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(_ => {
        if (!this.localService.isLoggedIn()) {
          this.isLoginPage = true;
          this.router.navigate(['/login']);
        } else {
          const url = this.router.url;
          if (url === "/login") {
            this.isLoginPage = true;
          } else {
            this.isLoginPage = false;
          }
          this.userData = this.localService.getUserData();
          this.dataLoaded = true;
        }
      });
  }

  logout() {
    this.apiService.logout({}).subscribe((data: any) => {
      if (data.isLogout) {
        this.localService.clearLocalCache();
        this.userData = {};
        this.router.navigate(["/login"]);
      }
    })
  }

  navigate(route) {
    this.router.navigate([`/${route}`]);
  }
}
