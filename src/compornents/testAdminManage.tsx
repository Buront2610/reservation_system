import React, { useState } from 'react';
import { Workplace, Bento, Employee, Reservation, User, Login } from './types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';

// Demo Data
const demoUsers: User[] = [
    { id: 1, password: 'password1', role: 'admin' },
    // other users...
];
const demoEmployees: Employee[] = [
    { id: 1, name: 'John Doe', workplace_id: 1 },
    // other employees...
];
const demoReservations: Reservation[] = [
    { id: 1, employee_id: 1, reservation_date: '2023-05-25', bento_id: 1, quantity: 2 },
    // other reservations...
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
    const [users, setUsers] = useState<User[]>(demoUsers);
    const [employees, setEmployees] = useState<Employee[]>(demoEmployees);
    const [reservations, setReservations] = useState<Reservation[]>(demoReservations);

    const handleAddUser = (newUser: Partial<User>) => {
        const addedUser = { id: users.length + 1, ...newUser };
        setUsers(prevUsers => [...prevUsers, addedUser as User]);
    }

    const handleAddEmployee = (newEmployee: Partial<Employee>) => {
        const addedEmployee = { id: employees.length + 1, ...newEmployee };
        setEmployees(prevEmployees => [...prevEmployees, addedEmployee as Employee]);
    }

    const handleUpdateEmployee = (id: number, updatedEmployee: Partial<Employee>) => {
        setEmployees(prevEmployees => prevEmployees.map(emp => emp.id === id ? { ...emp, ...updatedEmployee } : emp));
    }

    const handleDeleteUser = (id: number) => {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    }

    const handleDeleteEmployee = (id: number) => {
        setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== id));
    }

    const handleAddReservation = (newReservation: Partial<Reservation>) => {
        const addedReservation = { id: reservations.length + 1, ...newReservation };
        setReservations(prevReservations => [...prevReservations, addedReservation as Reservation]);
    }

    const handleUpdateReservation = (id: number, updatedReservation: Partial<Reservation>) => {
        setReservations(prevReservations => prevReservations.map(res => res.id === id ? { ...res, ...updatedReservation } : res));
    }

    const handleDeleteReservation = (id: number) => {
        setReservations(prevReservations => prevReservations.filter(res => res.id !== id));
    }

    const [newUser, setNewUser] = useState<Partial<User>>({});
    const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({});
    const [updatedEmployee, setUpdatedEmployee] = useState<Partial<Employee>>({});
    const [deleteEmployeeId, setDeleteEmployeeId] = useState<number | null>(null);
    const [newReservation, setNewReservation] = useState<Partial<Reservation>>({});
    const [updatedReservation, setUpdatedReservation] = useState<Partial<Reservation>>({});
    const [deleteReservationId, setDeleteReservationId] = useState<number | null>(null);
    // Handle form submission
    const handleAddReservationSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        handleAddReservation(newReservation);
        setNewReservation({});
    }

    const handleUpdateReservationSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (updatedReservation.id) {
            handleUpdateReservation(updatedReservation.id, updatedReservation);
            setUpdatedReservation({});
        }
    }

    const handleDeleteReservationSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (deleteReservationId) {
            handleDeleteReservation(deleteReservationId);
            setDeleteReservationId(null);
        }
    }
    
    return (
        <div>
            {/* ... (the rest of your forms) */}
            
            {/* Add Reservation Form */}
            <form onSubmit={handleAddReservationSubmit}>
                <h2>Add Reservation</h2>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Employee ID"
                        type="number"
                        value={newReservation.employee_id || ''}
                        onChange={(event) => setNewReservation({ ...newReservation, employee_id: parseInt(event.target.value) })}
                    />
                    <TextField
                        label="Reservation Date"
                        type="date"
                        value={newReservation.reservation_date || ''}
                        onChange={(event) => setNewReservation({ ...newReservation, reservation_date: event.target.value })}
                    />
                    <TextField
                        label="Bento ID"
                        type="number"
                        value={newReservation.bento_id || ''}
                        onChange={(event) => setNewReservation({ ...newReservation, bento_id: parseInt(event.target.value) })}
                    />
                    <TextField
                        label="Quantity"
                        type="number"
                        value={newReservation.quantity || ''}
                        onChange={(event) => setNewReservation({ ...newReservation, quantity: parseInt(event.target.value) })}
                    />
                    <Button variant="contained" type="submit">Add Reservation</Button>
                </Box>
            </form>

            {/* Update Reservation Form */}
            <form onSubmit={handleUpdateReservationSubmit}>
                <h2>Update Reservation</h2>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="ID"
                        type="number"
                        value={updatedReservation.id || ''}
                        onChange={(event) => setUpdatedReservation({ ...updatedReservation, id: parseInt(event.target.value) })}
                    />
                    <TextField
                        label="Employee ID"
                        type="number"
                        value={updatedReservation.employee_id || ''}
                        onChange={(event) => setUpdatedReservation({ ...updatedReservation, employee_id: parseInt(event.target.value) })}
                    />
                    <TextField
                        label="Reservation Date"
                        type="date"
                        value={updatedReservation.reservation_date || ''}
                        onChange={(event) => setUpdatedReservation({ ...updatedReservation, reservation_date: event.target.value })}
                    />
                    <TextField
                        label="Bento ID"
                        type="number"
                        value={updatedReservation.bento_id || ''}
                        onChange={(event) => setUpdatedReservation({ ...updatedReservation, bento_id: parseInt(event.target.value) })}
                    />
                    <TextField
                        label="Quantity"
                        type="number"
                        value={updatedReservation.quantity || ''}
                        onChange={(event) => setUpdatedReservation({ ...updatedReservation, quantity: parseInt(event.target.value) })}
                    />
                    <Button variant="contained" type="submit">Update Reservation</Button>
                </Box>
            </form>

            {/* Delete Reservation Form */}
            <form onSubmit={handleDeleteReservationSubmit}>
                <h2>Delete Reservation</h2>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="ID"
                        type="number"
                        value={deleteReservationId || ''}
                        onChange={(event) => setDeleteReservationId(parseInt(event.target.value))}
                    />
                    <Button variant="contained" type="submit">Delete Reservation</Button>
                </Box>
            </form>
        </div>
    );
}