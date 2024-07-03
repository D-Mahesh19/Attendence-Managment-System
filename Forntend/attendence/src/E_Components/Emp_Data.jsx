
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';


export default function Emp_Data() {
    const [FullName, setFullName] = useState([]);
    
    useEffect(() => {
        axios.get('http://localhost:8081/Fullget')
            .then((response) => {
                setFullName(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    
    const calculatePerformance = (employee) => {
        const performance = employee.Total_Working_days ? (employee.Days_Present / employee.Total_Working_days) * 100 : 0;
        return performance.toFixed(2);
    };
    
    const getPerformanceClass = (performance) => {
        if (performance < 50) return 'red-list';
        if (performance < 60) return 'grade-d';
        if (performance < 70) return 'grade-c';
        if (performance < 80) return 'grade-b';
        if (performance < 90) return 'grade-a';
        return 'grade-s';
    };

    const downloadExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            FullName.filter(employee => employee.Designation !== 'HR').map((employee) => ({
                'Employee Name': employee.Name,
                'Days Present': employee.Days_Present,
                'Days Absent': employee.Days_Absent,
                'Leaves Taken': employee.Leaves_Taken,
                'Total Working Days': employee.Total_Working_days,
                'Performance %': calculatePerformance(employee)
            }))
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Employee Data');
        XLSX.writeFile(workbook, 'employee_data.xlsx');
    };

    return (
        <div className='Emp_Data'>
            <h1>Employee Data and Devision</h1>
            <button onClick={downloadExcel}><i className="fa-solid fa-circle-arrow-down" id='I1'></i></button>
            <div className="Emp_Table">
                <table>
                    <thead>
                        <tr>
                            <td>Employee Name</td>
                            <td>Days Present</td>
                            <td>Days Absent</td>
                            <td>Leaves Taken</td>
                            <td>Total Working Days</td>
                            <td>Performance %</td>
                        </tr>
                    </thead>
                    <tbody>
                        {FullName.filter(employee => employee.Designation !== 'HR').map((employee) => {
                            const performance = calculatePerformance(employee);
                            const performanceClass = getPerformanceClass(performance);
                            return (
                                <tr key={employee.Name} className={performanceClass}>
                                    <td>{employee.Name}</td>
                                    <td>{employee.Days_Present}</td>
                                    <td>{employee.Days_Absent}</td>
                                    <td>{employee.Leaves_Taken}</td>
                                    <td>{employee.Total_Working_days}</td>
                                    <td>{performance}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="grade">
                    <p className="red-list">Less than 50 red list</p>
                    <p className="grade-d">Less than 60 Grade D</p>
                    <p className="grade-c">Less than 70 Grade C</p>
                    <p className="grade-b">Less than 80 Grade B</p>
                    <p className="grade-a">Less than 90 Grade A</p>
                    <p className="grade-s">Less than 100 Grade S</p>
                </div>
            </div>
        </div>
    );
}
