import React, { useState , useEffect} from 'react';
import { User, Reservation, Bento } from './types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { getReservations, addReservation, updateReservation, deleteReservation, getBento } from './API';
import { getAllUsers } from './API'; // User情報を取得するAPI

export default function AdminReservationManage() {

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [newEntry, setNewEntry] = useState<Partial<Reservation>>({});
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [users, setUsers] = useState<User[]>([]);
    const [bento, setBento] = useState<Bento[]>([]);

    useEffect(() => {
        loadInitialData();
    }, []);

    async function loadInitialData() {
        const reservations = await getReservations();
        setReservations(reservations);
        const users = await getAllUsers();
        setUsers(users);
        const bento = await getBento();
        setBento(bento);
    }

    const handleAddReservation = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const chosenBento = bento.find(b => b.choose_flag);
        if(chosenBento) {
            newEntry.bento_id = chosenBento.id;
            const createdReservation = await addReservation(newEntry);
            setReservations([...reservations, createdReservation]);
            setNewEntry({});
        }
    }

    const handleUpdateReservation = async (id: number, updatedData: Partial<Reservation>) => {
        const updatedReservation = await updateReservation(id, updatedData);
        setReservations(reservations.map(reservation => reservation.id === id ? updatedReservation : reservation));
    }

    const handleDeleteReservation = async (id: number) => {
        await deleteReservation(id);
        setReservations(reservations.filter(reservation => reservation.id !== id));
    }

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setSelectedTab(newValue);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Tabs value={selectedTab} onChange={handleChange}>
                    <Tab label="予約登録" />
                    <Tab label="予約一覧" />
                </Tabs>
            </Grid>
            {selectedTab === 0 && (
                <Grid item xs={12}>
                    <h1>予約登録ページ</h1>
                    <form onSubmit={handleAddReservation}>
                        <Box mb={2}>
                            <TextField fullWidth label="ユーザーID" value={newEntry.user_id || ''} onChange={e => setNewEntry({ ...newEntry, user_id: e.target.value })} />
                        </Box>
                        <Box mb={2}>
                            <TextField fullWidth label="弁当ID" value={newEntry.bento_id || ''} onChange={e => setNewEntry({ ...newEntry, bento_id: parseInt(e.target.value) })} />
                        </Box>
                        <Box mb={2}>
                            <TextField fullWidth label="予約日" value={newEntry.reservation_date || ''} onChange={e => setNewEntry({ ...newEntry, reservation_date: e.target.value })} />
                        </Box>
                        <Box mb={2}>
                            <TextField fullWidth label="数量" value={newEntry.quantity || ''} onChange={e => setNewEntry({ ...newEntry, quantity: parseInt(e.target.value) })} />
                        </Box>
                        <Box mb={2}>
                            <TextField fullWidth label="備考" value={newEntry.remarks || ''} onChange={e => setNewEntry({ ...newEntry, remarks: e.target.value })} />
                        </Box>
                        <Box mb={2}>
                            <Button type="submit" variant="contained" color="primary">登録</Button>
                        </Box>
                    </form>
                </Grid>
            )}
            {selectedTab === 1 && (
                <Grid item xs={12}>
                    <h1>予約一覧ページ</h1>
                    <DataGrid
                        rows={reservations}
                        columns={[
                            { field: 'user_id', headerName: 'ユーザーID', width: 120, editable: true },
                            { field: 'bento_id', headerName: '弁当ID', width: 120, editable: true },
                            { field: 'reservation_date', headerName: '予約日', width: 200, editable: true },
                            { field: 'quantity', headerName: '数量', width: 120, editable: true },
                            { field: 'remarks', headerName: '備考', width: 300, editable: true },
                            {
                                field: 'action',
                                headerName: '操作',
                                width: 150,
                                renderCell: (params) => (
                                    <Button onClick={() => handleDeleteReservation(params.row.id)}>削除</Button>
                                ),
                            },
                        ]}
                        // onCellEditCommit={(params, event) => {
                        //     handleUpdateReservation(params.id as number, {[params.field]: params.value});
                        // }}
                        // components={{
                        //     Toolbar: GridToolbarContainer,
                        // }}
                        // componentsProps={{
                        //     toolbar: {
                        //         children: [<GridToolbarExport />],
                        //     },
                        // }}
                    />
                </Grid>
            )}
        </Grid>
    );
}
