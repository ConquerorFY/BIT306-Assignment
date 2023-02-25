import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Employee from 'src/app/interfaces/employee';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userData: Employee[];

  constructor(public dataService: DataService, private router: Router) { }

  ngOnInit(): void {
  }

  navigate(path: string) {
    this.router.navigate([`/${path}`]);
  }

}
