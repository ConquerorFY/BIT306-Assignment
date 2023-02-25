import { Injectable } from '@angular/core';
import employeeData from "../../data/employee.json";
import departmentData from "../../data/department.json";
import fwaData from "../../data/fwarequest.json";
import scheduleData from "../../data/dailyschedule.json";
import Employee from '../interfaces/employee';
import Department from '../interfaces/department';
import FWA from '../interfaces/fwa';
import Schedule from '../interfaces/schedule';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  users: Employee[] = employeeData;
  department: Department[] = departmentData;
  fwa: FWA[] = fwaData;
  schedules: Schedule[] = scheduleData;

  isLoggedIn: boolean = false;
  loggedInUserData: Employee;
  reviewFwaSelectedRequests: number;

  constructor() { }
}
