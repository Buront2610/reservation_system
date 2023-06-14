import React, { useState, useEffect } from 'react';
import { Workplace, Bento, Reservation, User, Login } from './types';
import { 
    getWorkplaces, getBento, getUserById, getAllUsers, addReservation, 
    updateReservation, deleteReservation, createUser,getReservations, deleteUser,
} from './API';
import { UseAuth } from './authContext';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';

export default function AdminManage() {
    const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    useEffect(() => {
        loadInitialData();
    }, []);

    async function loadInitialData() {
        const [workplaces, users,reservations] = await Promise.all([
            getWorkplaces(),
            getAllUsers(),
            getReservations(),
        ]);

        setWorkplaces(workplaces);
        setUsers(users);
        setReservations(reservations);
    }

    async function handleAddUser(newUser: Partial<User>) {
        const addedUser = await createUser(newUser);
        setUsers(prevUsers => [...prevUsers, addedUser]);
    }


    async function handleDeleteUser(id: number) {
        await deleteUser(id);
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
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

    // Handle form submission
    const handleAddUserSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        handleAddUser(newUser);
        setNewUser({});
    }

    console.log(users);
    console.log(reservations);
    console.log(workplaces);
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
        </div>
    );
}

