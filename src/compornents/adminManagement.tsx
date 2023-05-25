import React, { useState, useEffect } from 'react';
import { Workplace, Bento, Employee, Reservation, User, Login } from './types';
import { 
    getWorkplaces, getBento, getUser, getUsers, getEmployees, addUser, addEmployee, 
    updateEmployee, deleteUser, deleteEmployee, getReservations, addReservation, 
    updateReservation, deleteReservation
} from './API';
import { UseAuth } from './authContext';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';

export default function AdminManage() {
    const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    useEffect(() => {
        loadInitialData();
    }, []);

    async function loadInitialData() {
        const [workplaces, users, employees, reservations] = await Promise.all([
            getWorkplaces(),
            getUsers(),
            getEmployees(),
            getReservations(),
        ]);

        setWorkplaces(workplaces);
        setUsers(users);
        setEmployees(employees);
        setReservations(reservations);
    }

    async function handleAddUser(newUser: Partial<User>) {
        const addedUser = await addUser(newUser);
        setUsers(prevUsers => [...prevUsers, addedUser]);
    }

    async function handleAddEmployee(newEmployee: Partial<Employee>) {
        const addedEmployee = await addEmployee(newEmployee);
        setEmployees(prevEmployees => [...prevEmployees, addedEmployee]);
    }

    async function handleUpdateEmployee(id: number, updatedEmployee: Partial<Employee>) {
        const updatedEmp = await updateEmployee(id, updatedEmployee);
        setEmployees(prevEmployees => prevEmployees.map(emp => emp.id === id ? updatedEmp : emp));
    }

    async function handleDeleteUser(id: number) {
        await deleteUser(id);
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    }

    async function handleDeleteEmployee(id: number) {
        await deleteEmployee(id);
        setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== id));
    }

    async function handleAddReservation(newReservation: Partial<Reservation>) {
        const addedReservation = await addReservation(newReservation);
        setReservations(prevReservations => [...prevReservations, addedReservation]);
    }

    async function handleUpdateReservation(id: number, updatedReservation: Partial<Reservation>) {
        const updatedRes = await updateReservation(id, updatedReservation);
        setReservations(prevReservations => prevReservations.map(res => res.id === id ? updatedRes : res));
    }

    async function handleDeleteReservation(id: number) {
        await deleteReservation(id);
        setReservations(prevReservations => prevReservations.filter(res => res.id !== id));
    }
    const [newUser, setNewUser] = React.useState<Partial<User>>({});
    const [newEmployee, setNewEmployee] = React.useState<Partial<Employee>>({});
    const [updatedEmployee, setUpdatedEmployee] = React.useState<Partial<Employee>>({});
    const [deleteEmployeeId, setDeleteEmployeeId] = React.useState<number | null>(null);

    // Handle form submission
    const handleAddUserSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        handleAddUser(newUser);
        setNewUser({});
    }

    const handleAddEmployeeSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        handleAddEmployee(newEmployee);
        setNewEmployee({});
    }

    const handleUpdateEmployeeSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (updatedEmployee.id) {
            handleUpdateEmployee(updatedEmployee.id, updatedEmployee);
            setUpdatedEmployee({});
        }
    }

    const handleDeleteEmployeeSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (deleteEmployeeId) {
            handleDeleteEmployee(deleteEmployeeId);
            setDeleteEmployeeId(null);
        }

    return (
        <div>
            <h1>Admin Page</h1>

            {/* Add User Form */}
            <form onSubmit={handleAddUserSubmit}>
                <h2>Add User</h2>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Password"
                        type="password"
                        value={newUser.password || ''}
                        onChange={(event) => setNewUser({ ...newUser, password: event.target.value })}
                    />
                    <TextField
                        label="Role"
                        value={newUser.role || ''}
                        onChange={(event) => setNewUser({ ...newUser, role: event.target.value })}
                    />
                    <Button variant="contained" type="submit">Add User</Button>
                </Box>
            </form>

            {/* Add Employee Form */}
            <form onSubmit={handleAddEmployeeSubmit}>
                <h2>Add Employee</h2>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Name"
                        value={newEmployee.name || ''}
                        onChange={(event) => setNewEmployee({ ...newEmployee, name: event.target.value })}
                    />
                    <TextField
                        label="Workplace ID"
                        type="number"
                        value={newEmployee.workplace_id || ''}
                        onChange={(event) => setNewEmployee({ ...newEmployee, workplace_id: parseInt(event.target.value) })}
                    />
                    <Button variant="contained" type="submit">Add Employee</Button>
                </Box>
            </form>

            {/* Update Employee Form */}
            <form onSubmit={handleUpdateEmployeeSubmit}>
                <h2>Update Employee</h2>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="ID"
                        type="number"
                        value={updatedEmployee.id || ''}
                        onChange={(event) => setUpdatedEmployee({ ...updatedEmployee, id: parseInt(event.target.value) })}
                    />
                    <TextField
                        label="Name"
                        value={updatedEmployee.name || ''}
                        onChange={(event) => setUpdatedEmployee({ ...updatedEmployee, name: event.target.value })}
                    />
                    <TextField
                        label="Workplace ID"
                        type="number"
                        value={updatedEmployee.workplace_id || ''}
                        onChange={(event) => setUpdatedEmployee({ ...updatedEmployee, workplace_id: parseInt(event.target.value) })}
                    />
                    <Button variant="contained" type="submit">Update Employee</Button>
                </Box>
            </form>

            {/* Delete Employee Form */}
            <form onSubmit={handleDeleteEmployeeSubmit}>
                <h2>Delete Employee</h2>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="ID"
                        type="number"
                        value={deleteEmployeeId || ''}
                        onChange={(event) => setDeleteEmployeeId(parseInt(event.target.value))}
                    />
                    <Button variant="contained" type="submit">Delete Employee</Button>
                </Box>
            </form>

            {/* TODO: Implement forms to add, update, delete reservations */}
        </div>
    );
}
}
