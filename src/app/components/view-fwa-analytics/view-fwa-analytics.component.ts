import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import moment from 'moment';
import { ApiService } from 'src/app/api/api.service';
import Employee from 'src/app/interfaces/employee';

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
  departmentsList: any = [];
  departmentsCountList: any = [];
  selectedDepartment = new FormControl('');
  selectedDepartmentFWA: any;
  scheduleData: any = [];
  selectedDate: string = "";

  constructor(
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {
    this.findAllTabsFWAEmployeeCount();
    this.getAllDepartments();
  }

  findAllTabsFWAEmployeeCount(): void {
    this.apiService.getEmployeeFWACount().subscribe((data: any) => {
      this.totalFlexiHoursCount = data.flexiCount;
      this.totalHybridCount = data.hybridCount;
      this.totalWorkFromHomeCount = data.wfhCount;
    })
  }

  getAllDepartments() {
    this.apiService.getAllDepartments().subscribe((data: any) => {
      this.departmentsList = data.map(d => {
        return {
          id: d.deptID,
          value: d.deptName
        }
      })
    })
  }

  getDepartmentID(dList: any, dVal: string) {
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
    this.departmentsCountList = [];
    const selectedDepartmentID = this.getDepartmentID(this.departmentsList, this.selectedDepartment.value);
    this.apiService.getEmployeeFWARequestsByDepartment({ deptID: selectedDepartmentID }).subscribe((data: any) => {
      if (data.isSuccess) {
        for (let [key, value] of Object.entries(data.data)) {
          this.departmentsCountList.push({
            date: key,
            count: value,
            isExpanded: false
          })
        }
      }
    })
  }

  getDateSchedule(date: string) {
    this.selectedDate = moment(date).format('Y-MM-DD');
    this.getEmployeeWorkSchedules();
  }

  getEmployeeWorkSchedules(): void {
    const selectedDepartmentID = this.getDepartmentID(this.departmentsList, this.selectedDepartment.value);
    this.apiService.getEmployeeScheduleByDepartment({ deptID: selectedDepartmentID, date: this.selectedDate }).subscribe((data: any) => {
      if (data.isSuccess) {
        this.scheduleData = data.data;
      }
    });
  }
}