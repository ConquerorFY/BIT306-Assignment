import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bit306';
  isLogin = false;

  constructor(private router: Router) {
    router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const url = this.router.url;
        this.isLogin = url === "/login" || url === "/";
      });
  }

  logout() {
    localStorage.removeItem("userData");
    this.router.navigate(["/login"]);
  }
}
