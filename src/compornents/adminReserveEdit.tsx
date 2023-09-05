import React, { useState , useEffect} from 'react';
import { User, Reservation, Bento } from './types';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box, Grid, Tab, Tabs } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { getReservations, addReservation, updateReservation, deleteReservation, getBento, getBentoByChooseFlag } from './API';
import { getAllUsers } from './API'; // User情報を取得するAPI
import { get } from 'http';
import { DateField } from '@mui/x-date-pickers/DateField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { jaJP } from '@mui/x-data-grid';
import ja from 'date-fns/locale/ja';
import 'dayjs/locale/ja';
import { useUserAuthenticationLogoutNavigate } from './useUserAuthLogoutNavigate';


export default function AdminReservationManage() {
    useUserAuthenticationLogoutNavigate();


    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [newEntry, setNewEntry] = useState<Partial<Reservation>>({});
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [users, setUsers] = useState<User[]>([]);
    const [bento, setBento] = useState<Partial<Bento|null>>({});
    const [newReservation, setNewReservation] = useState<Partial<Reservation>>({});


    useEffect(() => {
        loadInitialData();
    }, []);

    async function loadInitialData() {
        const reservations = await getReservations();
        setReservations(reservations);
        const users = await getAllUsers();
        setUsers(users);
        const bento = await getBentoByChooseFlag();
        setBento(bento);
    }

    const handleAddReservation = async (event: React.FormEvent<HTMLFormElement>) => {
        if(bento != null){
            event.preventDefault();
            newEntry.bento_id = bento.id;
            console.log('newEntry:',newEntry);
            console.log('bento:',bento);
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

// Function to handle auto-filling reservation form
// Function to handle auto-filling reservation form
const handleAutoFillReservation = () => {
    // Find the first guest user ID
    const guestUser = users.find(user => user.role === 'guest');

    if (!guestUser) {
        console.log('No guest user found');
        return;
    }

    const today = new Date().toISOString().split('T')[0];
    console.log(guestUser);

    // Set the newEntry state
    setNewEntry({
        user_id: guestUser.employee_number.toString(), // Assuming guestUser.id is a number
        reservation_date: today,
    });
}
    
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
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ja'}>
                            <DatePicker
                                label="予約日"
                                value={dayjs(newEntry.reservation_date)}
                                onChange={(newValue) => {
                                    // newValueがundefinedまたはnullでないことを確認します
                                    if (newValue) {
                                        const year = newValue.year();
                                        const month = (newValue.month() + 1).toString().padStart(2, '0'); // Months are 0-indexed in dayjs
                                        const day = newValue.date().toString().padStart(2, '0');
                                        const formattedDate = `${year}-${month}-${day}`;
                                        console.log(formattedDate);
                                        setNewEntry({ ...newEntry, reservation_date: formattedDate });
                                    }
                                }}
                                
                                slotProps={{
                                    textField: {
                                        helperText: '日付を選択してください',
                                    },
                                }}
                                format='YYYY-MM-DD'
                            />
                            </LocalizationProvider>
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
                    <div><Button variant="contained" onClick={handleAutoFillReservation}>来客用予約</Button></div>
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

                    />
                </Grid>
            )}
        </Grid>
    );
}
