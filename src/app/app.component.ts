import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bit306';
  isLoginPage = false;
  userData = null;

  constructor(private router: Router, private dataService: DataService) {
    router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const url = this.router.url;
        this.isLoginPage = url === "/login" || (!this.dataService.isLoggedIn && url === "/");
        this.userData = this.dataService.loggedInUserData;
      });
  }

  logout() {
    this.dataService.loggedInUserData = null;
    this.dataService.isLoggedIn = false;
    this.router.navigate(["/login"]);
  }

  navigate(route) {
    this.router.navigate([`/${route}`]);
  }
}
