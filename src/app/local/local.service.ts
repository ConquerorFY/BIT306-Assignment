import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalService {
  selectedFwaRequestsID: number = 0;
  selectedScheduleID: number = 0;

  constructor() { }

  writeToLocalCache(data: any) {
    localStorage.setItem("data", JSON.stringify(data));
  }

  isLoggedIn(): boolean {
    const userData = localStorage.getItem("data");
    if (userData) return true;
    return false;
  }

  getUserData() {
    return JSON.parse(localStorage.getItem("data"));
  }

  clearLocalCache() {
    localStorage.clear();
  }
}
