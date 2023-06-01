import React, { useState, useEffect } from 'react';
import { Reservation, Employee } from './types';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,Tooltip } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';


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
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(today);

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [employeeList, setEmployeeList] = useState<Employee[]>([]);

    useEffect(() => {
        setReservations(dummyReservations);
        setEmployeeList(dummyEmployees);
    }, []);

    
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return (new Date(date.getFullYear(), date.getMonth(), 1).getDay() + 6) % 7;
    };

    const getReservationStatus = (date: string, employeeId: number) => {
        const reservation = reservations.find(
            reservation => reservation.employee_id === employeeId && reservation.reservation_date === date
        );
        return reservation ? "予約済" : "";
    };

    const decreaseMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1));
    };

    const increaseMonth = () => {
        setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1));
    };

    const formatDate = (date: Date) => {
        const y = date.getFullYear();
        const m = ("00" + (date.getMonth() + 1)).slice(-2);
        const d = ("00" + date.getDate()).slice(-2);
        return `${y}-${m}-${d}`;
    };

     return (
        <Box>
            <IconButton onClick={decreaseMonth}>
                <ChevronLeft />
            </IconButton>
            <h2>{`${currentDate.getFullYear()}年 ${currentDate.getMonth() + 1}月`}</h2>
            <IconButton onClick={increaseMonth}>
                <ChevronRight />
            </IconButton>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {["日", "月", "火", "水", "木", "金", "土"].map((day, index) => (
                                <TableCell key={index}>{day}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody> 
                        {employeeList.map((employee, employeeIndex) => {
                            let rows = [];
                            let cells = [];
                            let dayOffset = getFirstDayOfMonth(currentDate);
                            
                            
                            for (let day = 0 - dayOffset; day <= getDaysInMonth(currentDate); day++) {
                                if ((day + dayOffset) % 7 === 0) {
                                    rows.push(<TableRow key={`row-${employeeIndex}-${rows.length}`}>{cells}</TableRow>);
                                    cells = [];
                                }
                                if (day <= 0) {
                                    cells.push(<TableCell key={`empty-${employeeIndex+1}-${day}`}></TableCell>);
                                } else {
                                    const date = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                                    const reservationStatus = getReservationStatus(date, employee.id);
                                    cells.push(
                                        <TableCell key={`day-${employeeIndex}-${day}`} style={reservationStatus ? {backgroundColor: "yellow"} : {}}>
                                            <Tooltip title={`Date: ${date}`}>
                                                <span>{day}</span>
                                            </Tooltip>
                                            {reservationStatus}
                                        </TableCell>
                                    );
                                }

                            }
                            if (cells.length > 0) {
                                rows.push(<TableRow key={`row-${employeeIndex}-${rows.length}`}>{cells}</TableRow>);
                            }
                            return rows;
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

        </Box>
    );
}