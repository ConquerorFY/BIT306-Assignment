export default interface Employee {
    employeeID: string,
    name: string,
    password: string,
    email: string,
    position: string,
    supvID?: string,
    deptID: number,
    FWAStatus?: string
}