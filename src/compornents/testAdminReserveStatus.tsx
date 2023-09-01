import React, { useState, useEffect } from 'react';
import { DataGrid ,GridValueGetterParams,jaJP, GridToolbar, GridToolbarExport} from '@mui/x-data-grid';
import { User, Workplace, Statistics, Reservation } from './types';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { getStatistics, getAllUsers, getWorkplace } from './API';  // Add API import here

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

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 11 }, (_, i) => currentYear - i);

export default function TestAdminOrderSummaryPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [employeeSummaries, setEmployeeSummaries] = useState<EmployeeSummary[]>([]);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event: SelectChangeEvent<number>) => {
        setSelectedYear(event.target.value as number);
    };
    const gridToolbarExport=()=>{
        return(
        <GridToolbarExport
            csvOptions={{
                fileName: 'customerDataBase',
                utf8WithBom: true,
            }}
          />
        )
    }

    

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const users = await getAllUsers();
                setUsers(users);
                const summaries = await Promise.all(users.map(async user => {
                    const monthlySummary: MonthlySummary[] = [];
                    for (let month = 0; month < 12; month++) {
                        const stats = await getStatistics(selectedYear, month + 1);
                        const userStats = stats.employee_monthly_order_counts[user.employee_number];
                        const orderCount = userStats ? userStats.count : 0;
                        const totalAmount = userStats ? stats.employee_monthly_order_amounts[user.employee_number].amount : 0;
                        monthlySummary.push({ month: month + 1, orderCount, totalAmount });
                        console.log(stats)
                    }
                    return { id: user.id, name: user.name, monthlySummary };
                }));
                setEmployeeSummaries(summaries);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [selectedYear]);

    const columns = [
        { field: 'id', headerName: '社員ID', width: 70 },
        { field: 'name', headerName: '社員名', width: 130 },
        ...Array.from({ length: 12 }, (_, month) => [
            {
                field: `${month + 1}月注文数`,
                headerName: `${month + 1}月注文数`,
                width: 200,
                valueGetter: (params: GridValueGetterParams) => {
                    const summary: EmployeeSummary = params.row;
                    const monthlySummary = summary.monthlySummary[month];
                    return monthlySummary ? `${monthlySummary.orderCount} ` : 'データなし';
                }
            },
            {
                field: `${month + 1}月合計金額`,
                headerName: `${month + 1}月合計金額`,
                width: 200,
                valueGetter: (params: GridValueGetterParams) => {
                    const summary: EmployeeSummary = params.row;
                    const monthlySummary = summary.monthlySummary[month];
                    return monthlySummary ? `${monthlySummary.totalAmount}` : 'データなし';
                }
            }
        ]).flat()
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
            {isLoading
              ? <div>Loading...</div>
              : <DataGrid rows={employeeSummaries} columns={columns}
                          slots={{
                            toolbar: gridToolbarExport,
                          }}
                          localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}  />}
          </div>
        </div>
    );
}
