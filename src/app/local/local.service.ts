import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  userData: any;

  constructor() { }

  writeToLocalCache(data: any) {
    localStorage.setItem("data", JSON.stringify(data));
    this.getUserData();
  }

  isLoggedIn(): boolean {
    const userData = localStorage.getItem("data");
    if (userData) return true;
    return false;
  }

  getUserData() {
    this.userData = JSON.parse(localStorage.getItem("data"));
  }

  clearLocalCache() {
    localStorage.clear();
    this.userData = {};
  }
}
