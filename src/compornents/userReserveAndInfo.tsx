import { useState, FC } from 'react';
import { Reservation,User} from './types';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Button } from '@mui/material';
import  CalenderHeader  from './calendarHeader';
import CalendarBody from './calendarBody';
import { getReservationByID } from './API';
import { get } from 'http';
// Define dummy data
const dummyReservations: Reservation[] = [
    { id: 1, user_id: 1, reservation_date: '2023-05-15', bento_id: 1, quantity: 1,remarks:""}, 
    { id: 1, user_id: 1, reservation_date: '2023-05-14', bento_id: 1, quantity: 1, remarks:"" },

    { id: 1, user_id: 1, reservation_date: '2023-05-16', bento_id: 1, quantity: 1, remarks:"" },

    { id: 1, user_id: 1, reservation_date: '2023-05-17', bento_id: 1, quantity: 1, remarks:"" },

    { id: 1, user_id: 1, reservation_date: '2023-05-18', bento_id: 1, quantity: 1, remarks:"" },

    { id: 1, user_id: 1, reservation_date: '2023-05-19', bento_id: 1, quantity: 1, remarks:"" },

    { id: 2, user_id: 1, reservation_date: '2023-05-20', bento_id: 2, quantity: 2, remarks:"" },
    { id: 3, user_id: 1, reservation_date: '2023-05-30', bento_id: 1, quantity: 1,  remarks:""},
];

const dummyEmployees: User[] = [
    { id: 1, name: 'John Doe', password:"aaaa",role:'user', workplace_id: 1,email_address: 'test@test.co.jp',  hide_flag: false, telephone: '8888'},
];

const userReservations = getReservationByID(1);

console.log(userReservations);


const DAYS_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"];

const useCalendar = (initialReservations: Reservation[], initialUsers: User[]) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(today);
  
  const changeMonth = (amount: number) => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + amount));
  };

  const isReservationExists = (reservations: Reservation[], date: string, employeeId: number) => {
    return reservations.find(
      reservation => reservation.user_id === employeeId && reservation.reservation_date === date
    );
  };

  const getReservationStatus = (date: string, employeeId: number) => {
    return isReservationExists(initialReservations, date, employeeId) ? "予約済" : "";
  };

  return { currentDate, initialUsers, changeMonth, getReservationStatus };
}

const Calendar: FC = () => {
  const { currentDate, initialUsers, changeMonth, getReservationStatus } = useCalendar(dummyReservations, dummyEmployees);

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
              employeeList={initialUsers}
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
  console.log(userReservations);

  return <Calendar />;
}
