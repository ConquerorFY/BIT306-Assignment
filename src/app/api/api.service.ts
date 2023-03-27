import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api/';
  private departmentUrl = "department";
  private employeeUrl = "employee";
  private fwaUrl = "fwa";

  constructor(private http: HttpClient) { }

  getAllDepartments() {
    return this.http.get(`${this.baseUrl + this.departmentUrl}/departments`);
  }

  getEmployeeFWARequestsByDepartment(data: any) {
    return this.http.post(`${this.baseUrl + this.departmentUrl}/getEmployeeFWARequestsByDepartment`, data);
  }

  getEmployeeScheduleByDepartment(data: any) {
    return this.http.post(`${this.baseUrl + this.departmentUrl}/getEmployeeScheduleByDepartment`, data);
  }

  registerAccount(data: any) {
    return this.http.post(`${this.baseUrl + this.employeeUrl}/registerAccount`, data);
  }

  login(data: any) {
    return this.http.post(`${this.baseUrl + this.employeeUrl}/login`, data);
  }

  logout(data: any) {
    return this.http.post(`${this.baseUrl + this.employeeUrl}/logout`, data);
  }

  getEmployeeFWACount() {
    return this.http.get(`${this.baseUrl + this.employeeUrl}/getEmployeeFWACount`);
  }

  getSupervisors() {
    return this.http.get(`${this.baseUrl + this.employeeUrl}/getSupervisors`);
  }

  getEmployees() {
    return this.http.get(`${this.baseUrl + this.employeeUrl}/getEmployees`);
  }

  updateEmployee(data: any) {
    return this.http.post(`${this.baseUrl + this.employeeUrl}/updateEmployee`, data);
  }

  insertFWA(data: any) {
    return this.http.post(`${this.baseUrl + this.fwaUrl}/insertFWA`, data);
  }

  getFWA(data: any) {
    return this.http.post(`${this.baseUrl + this.fwaUrl}/getFWA`, data);
  }

  getSingleFWA(data: any) {
    return this.http.post(`${this.baseUrl + this.fwaUrl}/getFWARequest`, data);
  }

  updateFWA(data: any) {
    return this.http.post(`${this.baseUrl + this.fwaUrl}/updateFWA`, data);
  }

  getNewFWARequestID() {
    return this.http.get(`${this.baseUrl + this.fwaUrl}/getNewFWARequestID`);
  }
}
