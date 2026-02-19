import React, { useState, useEffect, useMemo } from 'react';
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

    // Optimize with useMemo and Map indexing to avoid O(n²) complexity
    const rows: WorkplaceSummary[] = useMemo(() => {
        const today = new Date();
        const todayStr = today.toDateString();
        
        // Create indexed maps for O(1) lookups instead of O(n) searches
        const bentoMap = new Map(bento.map(b => [b.id, b.price]));
        const usersByWorkplace = new Map<number, Set<string>>();
        
        // Group users by workplace
        users.forEach(user => {
            if (!usersByWorkplace.has(user.workplace_id)) {
                usersByWorkplace.set(user.workplace_id, new Set());
            }
            usersByWorkplace.get(user.workplace_id)!.add(user.employee_number);
        });

        return workplaces.map((workplace) => {
            const workplaceUserIds = usersByWorkplace.get(workplace.id) || new Set();
            
            // Filter reservations once and categorize
            let todayTotalOrder = 0;
            let monthTotalOrder = 0;
            let todayTotalAmount = 0;
            let monthTotalAmount = 0;

            reservations.forEach(reservation => {
                if (!workplaceUserIds.has(reservation.user_id)) return;
                
                const reservationDate = new Date(reservation.reservation_date);
                const bentoPrice = bentoMap.get(reservation.bento_id) || 0;
                const orderAmount = reservation.quantity * bentoPrice;
                
                // Check if today
                if (reservationDate.toDateString() === todayStr) {
                    todayTotalOrder += reservation.quantity;
                    todayTotalAmount += orderAmount;
                }
                
                // Check if current month
                if (reservationDate.getFullYear() === currentMonth.getFullYear() &&
                    reservationDate.getMonth() === currentMonth.getMonth()) {
                    monthTotalOrder += reservation.quantity;
                    monthTotalAmount += orderAmount;
                }
            });

            return {
                id: workplace.id,
                workplace: workplace.name,
                todayTotalOrder,
                monthTotalOrder,
                todayTotalAmount,
                monthTotalAmount,
            };
        });
    }, [workplaces, users, reservations, bento, currentMonth]);

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
                <DataGrid 
                    rows={rows} 
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 10, page: 0 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                />
            </div>
        </Box>
    );
};

