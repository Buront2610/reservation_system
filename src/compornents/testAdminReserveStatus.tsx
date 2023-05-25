import React, { useState, useEffect } from 'react';
import { DataGrid ,GridValueGetterParams} from '@mui/x-data-grid';
import { Employee, Reservation,Bento } from './types';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// Demo Data
const demoEmployees: Employee[] = [
    { id: 1, name: "A太郎", workplace_id: 1 },
    { id: 3018, name: "Test Doe", workplace_id: 2}
    // ...other employees
  ];
  
  const bentos: Bento[] = [
    { id: 1, name: "Chicken Bento", price: 500 },
    // ...other bentos
  ];
  
  const demoReservations: Reservation[] = [
    { id: 1, employee_id: 1, reservation_date: "2023-01-10", bento_id: 1, quantity: 1 },
    { id: 2, employee_id: 1, reservation_date: "2023-01-15", bento_id: 1, quantity: 1 },
    { id: 3, employee_id: 1, reservation_date: "2023-02-05", bento_id: 1, quantity: 1 },
    { id: 4, employee_id: 3018, reservation_date: "2023-05-15", bento_id: 1, quantity: 1 },
    // ...other reservations
  ];
  

interface MonthlySummary {
    month: number;
    orderCount: number;
    totalAmount: number;
}

interface EmployeeSummary {
    id: number;
    name: string;
    monthlySummary: MonthlySummary[];
}


// 現在の年を取得
const currentYear = new Date().getFullYear();

// 選択可能な年の範囲を設定 (ここでは現在の年から10年前までとする)
const years = Array.from({ length: 11 }, (_, i) => currentYear - i);


export default function TestAdminOrderSummaryPage() {
    const [employees, setEmployees] = useState<Employee[]>(demoEmployees);
    const [reservations, setReservations] = useState<Reservation[]>(demoReservations);
    const [employeeSummaries, setEmployeeSummaries] = useState<EmployeeSummary[]>([]);
        // 選択された年を管理するためのstate
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // 選択された年に応じてデータを更新
   
    // 選択された年に応じてデータを更新
    const rows = employeeSummaries;

    // 年を選択するためのドロップダウンメニューのハンドラ
    const handleChange = (event: SelectChangeEvent<number>) => {
        setSelectedYear(event.target.value as number); // target.value is unknown, cast it to number
      };
      

      useEffect(() => {
        // Compute summaries on component mount and whenever employees or reservations change
        const summaries = employees.map(employee => {
            const employeeReservations = reservations.filter(r => r.employee_id === employee.id && new Date(r.reservation_date).getFullYear() === selectedYear);
            const monthlySummary: MonthlySummary[] = Array(12).fill(null).map((_, month) => {
                const monthlyReservations = employeeReservations.filter(r => new Date(r.reservation_date).getMonth() === month);
                return {
                    month: month + 1, // Months are 0-indexed in JS Date
                    orderCount: monthlyReservations.length,
                    totalAmount: monthlyReservations.reduce((total, r) => total + r.quantity * (bentos.find(b => b.id === r.bento_id)?.price || 0), 0)
                };
            });
    
            return { id: employee.id, name: employee.name, monthlySummary };
        });
    
        setEmployeeSummaries(summaries);
    }, [employees, reservations, selectedYear]);
    
    const columns = [
        { field: 'name', headerName: 'Employee', width: 130 },
        ...Array(12).fill(null).map((_, month) => ({
            field: `${month + 1}月`,
            headerName: `${month + 1}月`,
            width: 200,
            valueGetter: (params: GridValueGetterParams) => {
                const summary: EmployeeSummary = params.row;
                const monthlySummary = summary.monthlySummary[month];
                return monthlySummary ? `${monthlySummary.orderCount} 注文, 合計金額${monthlySummary.totalAmount} ` : 'データなし';
            }
        }))
    ];

    return (
        <div>
          <FormControl>
            <InputLabel id="year-select-label">Year</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={selectedYear}
              onChange={handleChange}
            >
              {years.map(year => (
                <MenuItem value={year} key={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid rows={rows} columns={columns}  />
          </div>
        </div>
      );
}

