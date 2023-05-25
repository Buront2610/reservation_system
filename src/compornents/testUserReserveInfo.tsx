import React, { useState, useEffect } from 'react';
import { Reservation, Bento, Employee } from './types';
import { getReservations, getBento, getEmployees } from './API';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { UseAuth } from './authContext';
import { CheckCircleOutline as CheckCircleOutlineIcon, HighlightOff as HighlightOffIcon, ChevronLeft, ChevronRight } from '@mui/icons-material';


// Define dummy data
const dummyReservations: Reservation[] = [
    { id: 1, employee_id: 1, reservation_date: '2023-05-15', bento_id: 1, quantity: 1, },
    { id: 2, employee_id: 1, reservation_date: '2023-05-20', bento_id: 2, quantity: 2, },
    { id: 3, employee_id: 1, reservation_date: '2023-05-30', bento_id: 1, quantity: 1, },
];

const dummyEmployees: Employee[] = [
    { id: 1, name: 'John Doe', workplace_id: 1 },
];

export default function TestReservationHistoryPage() {
    // const { user } = UseAuth();

    // if(!user) {
    //     throw new Error('User is not logged in.');
    // }

    const today = new Date();
    const [month, setMonth] = useState(today.getMonth());
    const [year, setYear] = useState(today.getFullYear());
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [employeeList, setEmployeeList] = useState<Employee[]>([]);

    useEffect(() => {
        setReservations(dummyReservations);
        setEmployeeList(dummyEmployees);
    }, []);

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (month: number, year: number) => {
        return new Date(year, month, 1).getDay();
    };

    const getReservationStatus = (date: string, employeeId: number) => {
        const reservation = reservations.find(
            reservation => reservation.employee_id === employeeId && reservation.reservation_date === date
        );
        return reservation ? "予約済" : "";
    };

    const decreaseMonth = () => {
        setMonth(month - 1);
        if (month - 1 < 0) {
            setMonth(11);
            setYear(year - 1);
        }
    };

    const increaseMonth = () => {
        setMonth(month + 1);
        if (month + 1 > 11) {
            setMonth(0);
            setYear(year + 1);
        }
    };

    return (
        <Box>
            <IconButton onClick={decreaseMonth}>
                <ChevronLeft />
            </IconButton>
            <IconButton onClick={increaseMonth}>
                <ChevronRight />
            </IconButton>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Employee / Date</TableCell>
                            {["日", "月", "火", "水", "木", "金", "土"].map(day => (
                                <TableCell>{day}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employeeList.map(employee => {
                            let rows = [];
                            let cells = [];
                            cells.push(<TableCell>{employee.name}</TableCell>);
                            for (let i = 0; i < getFirstDayOfMonth(month, year); i++) {
                                cells.push(<TableCell></TableCell>);
                            }
                            for (let day = 1; day <= getDaysInMonth(month, year); day++) {
                                const date = `${year}-${month + 1}-${day}`;
                                const reservationStatus = getReservationStatus(date, employee.id);
                                cells.push(<TableCell style={reservationStatus ? {backgroundColor: "yellow"} : {}}>{reservationStatus}</TableCell>);
                                if (cells.length % 7 === 0) {
                                    rows.push(<TableRow>{cells}</TableRow>);
                                    cells = [];
                                }
                            }
                            if (cells.length > 0) {
                                while (cells.length < 7) {
                                    cells.push(<TableCell></TableCell>);
                                }
                                rows.push(<TableRow>{cells}</TableRow>);
                            }
                            return rows;
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}