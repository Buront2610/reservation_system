import React, { useState, useEffect } from 'react';
import { Workplace, Bento, Reservation, User, Login } from './types';
import { 
    getWorkplaces, getBento, getAllUsers, addReservation, 
    updateReservation, deleteReservation
} from './API';
import { UseAuth } from './authContext';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box , Grid} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = [
  { field: 'id', headerName: '社員番号', width: 150 },
  { field: 'name', headerName: '社員名', width: 150 },
  { field: 'password', headerName: 'Password', width: 150 },
];

export default function AdminManage() {
    const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const { auth } = UseAuth();
    const [newEntry, setNewEntry] = useState<User>({ id: undefined, name: '', password: '' });

    useEffect(() => {
        loadInitialData();
    }, []);

    async function loadInitialData() {
        const [workplaces, users, reservations] = await Promise.all([
            getWorkplaces(),
            getAllUsers(),
            getReservations()
        ]);
        setWorkplaces(workplaces);
        setUsers(users);
        setReservations(reservations);
    }

    async function handleAddEmployeeUserSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await addEmployeeUser(newEntry);
        setNewEntry({ id: undefined, name: '', password: '' });
        await loadInitialData();
    }

    async function addEmployeeUser(user: User) {
        await fetch('/api/addEmployeeUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth?.token}`
            },
            body: JSON.stringify(user)
        });
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
                    <Button variant="contained" color="primary" type="submit">追加</Button>
                </form>
            </Grid>
            <Grid item xs={12} md={6}>
                <h1>ユーザ一覧</h1>

                {/* User List */}
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid rows={users} columns={columns} pageSize={5} />
                </div>
            </Grid>
        </Grid>
    );
}