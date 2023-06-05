import { useState, FC } from 'react';
import { Reservation, Employee } from './types';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Button } from '@mui/material';
import  CalenderHeader  from './calendarHeader';
import CalendarBody from './calendarBody';
// Define dummy data
const dummyReservations: Reservation[] = [
    { id: 1, employee_id: 1, reservation_date: '2023-05-15', bento_id: 1, quantity: 1, },
    { id: 1, employee_id: 1, reservation_date: '2023-05-14', bento_id: 1, quantity: 1, },

    { id: 1, employee_id: 1, reservation_date: '2023-05-16', bento_id: 1, quantity: 1, },

    { id: 1, employee_id: 1, reservation_date: '2023-05-17', bento_id: 1, quantity: 1, },

    { id: 1, employee_id: 1, reservation_date: '2023-05-18', bento_id: 1, quantity: 1, },

    { id: 1, employee_id: 1, reservation_date: '2023-05-19', bento_id: 1, quantity: 1, },

    { id: 2, employee_id: 1, reservation_date: '2023-05-20', bento_id: 2, quantity: 2, },
    { id: 3, employee_id: 1, reservation_date: '2023-05-30', bento_id: 1, quantity: 1, },
];

const dummyEmployees: Employee[] = [
    { id: 1, name: 'John Doe', workplace_id: 1, mailaddress: 'test@test.co.jp',  hide_flag: false, telephone: '8888'},
];


const DAYS_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"];

const useCalendar = (initialReservations: Reservation[], initialEmployees: Employee[]) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(today);
  
  const changeMonth = (amount: number) => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + amount));
  };

  const isReservationExists = (reservations: Reservation[], date: string, employeeId: number) => {
    return reservations.find(
      reservation => reservation.employee_id === employeeId && reservation.reservation_date === date
    );
  };

  const getReservationStatus = (date: string, employeeId: number) => {
    return isReservationExists(initialReservations, date, employeeId) ? "予約済" : "";
  };

  return { currentDate, initialEmployees, changeMonth, getReservationStatus };
}

const Calendar: FC = () => {
  const { currentDate, initialEmployees, changeMonth, getReservationStatus } = useCalendar(dummyReservations, dummyEmployees);

  return (
    <Box>
      <CalenderHeader changeMonth={changeMonth} currentDate={currentDate} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {DAYS_OF_WEEK.map((day, index) => (
                <TableCell key={index}>{day}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <CalendarBody 
              currentDate={currentDate}
              employeeList={initialEmployees}
              getReservationStatus={getReservationStatus}
            />
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" marginTop={2}>
        <Button variant="contained" color="primary" >
          予約
        </Button>
        <Button variant="contained" color="secondary">
          予約キャンセル
        </Button>
      </Box>
    </Box>
  );
}

export default function TestReservationHistoryPage() {
  return <Calendar />;
}
