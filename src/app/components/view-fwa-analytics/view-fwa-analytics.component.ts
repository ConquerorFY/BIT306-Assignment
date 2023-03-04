import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import moment from 'moment';
import Employee from 'src/app/interfaces/employee';
import FWA from 'src/app/interfaces/fwa';
import Schedule from 'src/app/interfaces/schedule';
import { DataService } from 'src/app/services/data.service';

interface DepartmentsList {
  id: number,
  value: string
};
interface DepartmentsCountList {
  date: string,
  count: number | any,
  isExpanded: boolean
};

@Component({
  selector: 'app-view-fwa-analytics',
  templateUrl: './view-fwa-analytics.component.html',
  styleUrls: ['./view-fwa-analytics.component.css']
})
export class ViewFwaAnalyticsComponent implements OnInit {
  displayedColumns: string[] = [
    "Schedule ID",
    "Schedule Date",
    "Work Location",
    "Work Hours",
    "Work Report",
    "Supervisor Comments",
    "Employee ID"
  ];

  totalFlexiHoursCount: number = 0;
  totalWorkFromHomeCount: number = 0;
  totalHybridCount: number = 0;
  departmentsList: DepartmentsList[] = [];
  departmentsCountList: DepartmentsCountList[] = [];
  selectedDepartment = new FormControl('');
  selectedDepartmentFWA: FWA;
  scheduleData: Schedule[] = [];
  selectedDate: string = "";

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.findAllTabsFWAEmployeeCount();
    this.getAllDepartments();
  }

  findAllTabsFWAEmployeeCount(): void {
    for (let i = 0; i < this.dataService.fwa.length; i++) {
      if (this.dataService.fwa[i].workType.toLowerCase() === "flexi-hours") {
        this.totalFlexiHoursCount++;
      }
      else if (this.dataService.fwa[i].workType.toLowerCase() === "work-from-home") {
        this.totalWorkFromHomeCount++;
      } else if (this.dataService.fwa[i].workType.toLowerCase() === "hybrid") {
        this.totalHybridCount++;
      }
    }
  }

  getAllDepartments() {
    this.departmentsList = [];
    for (let d of this.dataService.department) {
      this.departmentsList.push({
        'id': d.deptID,
        'value': d.deptName
      });
    }
  }

  getDepartmentID(dList: DepartmentsList[], dVal: string) {
    for (let department of dList) {
      if (department.value === dVal) return department.id;
    }
    return 0;
  }

  getAllEmployeesFromSelectedDepartment(uList: Employee[], deptID: number) {
    let eList: string[] = [];

    for (let employee of uList) {
      if (employee.deptID === deptID) {
        eList.push(employee.employeeID);
      }
    }

    return eList;
  }

  findAllDepartmentFWACount() {
    let selectedDepartmentID = 0;
    let employeeList: string[] = [];

    // Get selected department ID
    selectedDepartmentID = this.getDepartmentID(this.departmentsList, this.selectedDepartment.value);

    // Get all employees from the selected department
    employeeList = this.getAllEmployeesFromSelectedDepartment(this.dataService.users, selectedDepartmentID);

    // Calculate all fwa requests count on different dates
    let tmpDepartmentsCountObj = {};
    for (let fwa of this.dataService.fwa) {
      if (employeeList.indexOf(fwa.employeeID) > -1 && !(fwa.requestDate in tmpDepartmentsCountObj)) {
        tmpDepartmentsCountObj[fwa.requestDate] = 1;
      } else if (employeeList.indexOf(fwa.employeeID) > -1 && fwa.requestDate in tmpDepartmentsCountObj) {
        tmpDepartmentsCountObj[fwa.requestDate]++;
      }
    }

    this.departmentsCountList = [];
    for (let [key, value] of Object.entries(tmpDepartmentsCountObj)) {
      this.departmentsCountList.push({
        date: key,
        count: value,
        isExpanded: false
      })
    }
  }

  getDateSchedule(date: string) {
    this.selectedDate = moment(date).format('Y-MM-DD');
    this.getEmployeeWorkSchedules();
  }

  getEmployeeWorkSchedules(): void {
    let selectedDepartmentID: number;
    let employeeList: string[] = [];
    let scheduleData: Schedule[] = [];

    // Get selected department ID
    selectedDepartmentID = this.getDepartmentID(this.departmentsList, this.selectedDepartment.value);

    // Get all employees for the selected department
    employeeList = this.getAllEmployeesFromSelectedDepartment(this.dataService.users, selectedDepartmentID);

    // Get all daily schedules that matches the date and department
    for (let s of this.dataService.schedules) {
      if (s.date === this.selectedDate && employeeList.indexOf(s.employeeID) > -1) {
        scheduleData.push(s);
      }
    }

    this.scheduleData = scheduleData;
  }
}