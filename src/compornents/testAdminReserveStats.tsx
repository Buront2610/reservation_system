import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { User, Workplace, Statistics, Reservation, Bento } from './types';
import { getWorkplaces, getReservations, getAllUsers, getBento } from './API'; // Add API import here
import { Box } from '@mui/system';

interface WorkplaceSummary {
    id: number;
    workplace: string;
    todayTotalOrder: number;
    monthTotalOrder: number;
    todayTotalAmount: number;
    monthTotalAmount: number;
}

export default function AdminReserveWorkplacePage() {
    const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [users, setUsers] = useState<User[]>([]); // Replaced Employee with User
    const [bento, setBento] = useState<Bento[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        (async () => {
            const fetchedWorkplaces = await getWorkplaces();
            setWorkplaces(fetchedWorkplaces);

            const fetchedReservations = await getReservations();
            setReservations(fetchedReservations);

            const fetchedUsers = await getAllUsers(); // Replaced getEmployees with getAllUsers
            setUsers(fetchedUsers);

            const fetchedBento = await getBento();
            setBento(fetchedBento);
        })();
    }, []);

    const selectMonth = (month: number) => {
        const newMonth = new Date(currentMonth);
        newMonth.setMonth(currentMonth.getMonth() + month);
        setCurrentMonth(newMonth);
    };

    const rows: WorkplaceSummary[] = workplaces.map((workplace) => {
        const today = new Date();
        const workplaceUsers = users.filter(
            (user) => user.workplace_id === workplace.id
        );
        const workplaceReservations = reservations.filter((reservation) =>
            workplaceUsers.some((user) => user.employee_number === reservation.user_id)
        );

        const todayReservations = workplaceReservations.filter(
            (reservation) =>
                new Date(reservation.reservation_date).toDateString() === today.toDateString()
        );
        const monthReservations = workplaceReservations.filter(
            (reservation) =>
                new Date(reservation.reservation_date).getMonth() === currentMonth.getMonth()
        );

        const todayTotalOrder = todayReservations.reduce((prev, curr) => prev + curr.quantity, 0);
        const monthTotalOrder = monthReservations.reduce((prev, curr) => prev + curr.quantity, 0);
        const todayTotalAmount = todayReservations.reduce(
            (prev, curr) =>
                prev +
                curr.quantity * (bento.find((b) => b.id === curr.bento_id)?.price || 0),
            0
        );

        const monthTotalAmount = monthReservations.reduce(
            (prev, curr) =>
                prev +
                curr.quantity * (bento.find((b) => b.id === curr.bento_id)?.price || 0),
            0
        );

        return {
            id: workplace.id,
            workplace: workplace.name,
            todayTotalOrder,
            monthTotalOrder,
            todayTotalAmount,
            monthTotalAmount,
        };
    });

    const columns = [
        { field: 'workplace', headerName: '勤務場所', width: 200 },
        { field: 'todayTotalOrder', headerName: '本日の予約数', type: 'number', width: 150 },
        { field: 'monthTotalOrder', headerName: '選択月の予約数', type: 'number', width: 150 },
        { field: 'todayTotalAmount', headerName: '本日合計金額', type: 'number', width: 150 },
        { field: 'monthTotalAmount', headerName: '選択月合計金額', type: 'number', width: 150 },
    ];

    const dateFormat = new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'long' });
    const formattedMonth = dateFormat.format(currentMonth);

    return (
        <Box display="flex" flexDirection="column"　justifyContent="center" alignItems="center" height="100vh">
            <Box display="flex" alignItems="center" mb={2}>
                <button onClick={() => selectMonth(-1)}>&lt;</button>
                <h2>{formattedMonth}</h2>
                <button onClick={() => selectMonth(1)}>&gt;</button>
            </Box>
            <div style={{ height: 400 }} >
                <DataGrid rows={rows} columns={columns}  />
            </div>
        </Box>
    );
};

