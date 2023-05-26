import React, { useState } from 'react';
import { Workplace, Bento, User, Employee } from './types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box, Grid } from '@mui/material';
import { DataGrid,GridToolbar,jaJP } from '@mui/x-data-grid';

// Demo Data
const demoEmployees: Employee[] = [
    { id: 1, name: 'John Doe', workplace_id: 1 },
    // other employees...
];
const demoUsers: User[] = [
    { id: 1, password: 'password1', role: 'admin' },
    // other users...
];
const demoWorkplaces: Workplace[] = [
    { id: 1, name: 'Head Office', location: 'Tokyo' },
    // other workplaces...
];
const demoBentos: Bento[] = [
    { id: 1, name: 'Salmon Bento', price: 500 },
    // other bentos...
];

export default function TestAdminManage() {
    const [employees, setEmployees] = useState<Employee[]>(demoEmployees);
    const [users, setUsers] = useState<User[]>(demoUsers);
    const [workplaces, setWorkplaces] = useState<Workplace[]>(demoWorkplaces);
    const [bentos, setBentos] = useState<Bento[]>(demoBentos);

    // For handling form input
    const [newEntry, setNewEntry] = useState<Partial<Employee & User>>({});

    const handleAddEmployeeUser = (newEntry: Partial<Employee & User>) => {
        const newEmployee: Partial<Employee> = { id: newEntry.id, name: newEntry.name, workplace_id: newEntry.workplace_id };
        const newUser: Partial<User> = { id: newEntry.id, password: newEntry.password, role: newEntry.role };

        setEmployees(prevEmployees => [...prevEmployees, newEmployee as Employee]);
        setUsers(prevUsers => [...prevUsers, newUser as User]);
    }

    const handleDeleteEmployeeUser = (id: number) => {
        setEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== id));
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    }

    // Handle form submission
    const handleAddEmployeeUserSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        handleAddEmployeeUser(newEntry);
        setNewEntry({});
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
                <h1>ユーザ登録ページ</h1>

                {/* Add Employee/User Form */}
                <form onSubmit={handleAddEmployeeUserSubmit}>
                    <Box mb={2}>
                        <TextField fullWidth label="社員番号" value={newEntry.id || ''} onChange={e => setNewEntry({ ...newEntry, id: parseInt(e.target.value) })} />
                    </Box>
                    <Box mb={2}>
                        <TextField fullWidth label="社員名" value={newEntry.name || ''} onChange={e => setNewEntry({ ...newEntry, name: e.target.value })} />
                    </Box>
                    <Box mb={2}>
                        <TextField fullWidth label="Password" value={newEntry.password || ''} onChange={e => setNewEntry({ ...newEntry, password: e.target.value })} />
                    </Box>
                    <Box mb={2}>
                        <TextField fullWidth label="Role" value={newEntry.role || ''} onChange={e => setNewEntry({ ...newEntry, role: e.target.value })} />
                    </Box>
                    <Box mb={2}>
                        <Button type="submit" variant="contained" color="primary">Submit</Button>
                    </Box>
                </form>
            </Grid>

            <Grid item xs={12} md={6}>
                {/* Employees/Users DataGrid */}
                <DataGrid
                    rows={employees.map(e => ({ ...e, role: users.find(u => u.id === e.id)?.role, password: users.find(u => u.id === e.id)?.password }))}
                    columns={[
                        { field: 'id', headerName: '社員番号', width: 90 },
                        { field: 'name', headerName: '社員名', width: 150 },
                        { field: 'role', headerName: 'Role', width: 130 },
                        { field: 'password', headerName: 'Password', width: 160 },
                        {
                            field: 'action',
                            headerName: 'Action',
                            width: 150,
                            renderCell: (params) => (
                                <Button onClick={() => handleDeleteEmployeeUser(params.row.id)}>削除</Button>
                            ),
                        },
                        ]}
                        slots={{
                          toolbar: GridToolbar,
                        }}
                        localeText={jaJP.components.MuiDataGrid.defaultProps.localeText}  
                    />
            </Grid>
        </Grid>
    );
}
