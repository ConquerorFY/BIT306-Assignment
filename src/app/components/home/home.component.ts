import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalService } from 'src/app/local/local.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public localService: LocalService, private router: Router) { }

  ngOnInit(): void {
  }

  navigate(path: string) {
    this.router.navigate([`/${path}`]);
  }
}
