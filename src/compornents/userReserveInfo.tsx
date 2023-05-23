import React, { useState, useEffect } from 'react';
import { Reservation, Bento, Employee } from './types';
import { getReservations, getBento, getEmployees } from './API';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useAuth } from './authContext';

//予約情報の表示
//場合によっては消すかも
function ReservationHistoryPage() {
    const { user } = useAuth(); // ログインユーザーの情報を取得

    if(!user) {
        throw new Error('User is not logged in.');
    }

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [employeeList, setEmployeeList] = useState<Employee[]>([]);
    const [dateList, setDateList] = useState<string[]>([]);

    useEffect(() => {
        getReservations().then(reservation => {
            setReservations(reservation);
            setDateList([...new Set(reservation.map(r => r.reservation_date))]);
        });
        getEmployees().then(employee => setEmployeeList(employee));
    }, []);

    const getReservationStatus = (date: string, employeeId: number) => {
        const reservation = reservations.find(
            reservation => reservation.employee_id === employeeId && reservation.reservation_date === date
        );
        return reservation ? '予約済' : '';
    };

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Employee / Date</TableCell>
                            {dateList.map(date => (
                                <TableCell>{date}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employeeList.map(employee => (
                            <TableRow>
                                <TableCell>{employee.name}</TableCell>
                                {dateList.map(date => (
                                    <TableCell>{getReservationStatus(date, employee.id)}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default ReservationHistoryPage;
