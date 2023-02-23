import { Injectable } from '@angular/core';
import employeeData from "../../data/employee.json";
import departmentData from "../../data/department.json";
import fwaData from "../../data/fwarequest.json";
import scheduleData from "../../data/dailyschedule.json";

interface Department {
  deptID: number,
  deptName: string
}

interface Employee {
  employeeID: number,
  name: string,
  username: string,
  password: string,
  email: string,
  position: string,
  supvID?: number,
  deptID: number,
  FWAStatus?: boolean
};

interface FWA {
  requestID: number,
  requestDate: string,
  workType: string,
  description: string,
  reason: string,
  status: string,
  comment: string,
  employeeID: number
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  users: Employee[] = employeeData;
  department: Department[] = departmentData;
  fwa: FWA[] = fwaData;
  isLoggedIn: boolean = false;
  loggedInUserData: Employee;

  constructor() { }
}
