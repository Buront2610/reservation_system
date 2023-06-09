import { useState, FC } from 'react';
import { Reservation, User} from './types';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Button } from '@mui/material';
import  CalenderHeader  from './calendarHeader';
import CalendarBody from './calendarBody';
import { getReservationByID, getUserById, getAllUsers } from './API';
// Define dummy data
const dummyReservations: Reservation[] = [
    { id: 1, user_id: 1, reservation_date: '2023-05-15', bento_id: 1, quantity: 1, remarks:""},
    { id: 1, user_id: 1, reservation_date: '2023-05-17', bento_id: 1, quantity: 1, remarks:""},

    { id: 1, user_id: 1, reservation_date: '2023-05-19', bento_id: 1, quantity: 1, remarks:""},

    { id: 1, user_id: 1, reservation_date: '2023-05-20', bento_id: 1, quantity: 1, remarks:""},

    { id: 1, user_id: 1, reservation_date: '2023-05-21', bento_id: 1, quantity: 1, remarks:""},

    { id: 1, user_id: 1, reservation_date: '2023-05-22', bento_id: 1, quantity: 1, remarks:""},

    { id: 1, user_id: 1, reservation_date: '2023-05-24', bento_id: 1, quantity: 1, remarks:""},
    { id: 1, user_id: 1, reservation_date: '2023-05-25', bento_id: 1, quantity: 1, remarks:""},
];

const dummyEmployees: User[] = [
    { id: 1, name: 'John Doe', workplace_id: 1, email_address: 'test@test.co.jp',  hide_flag: false, telephone: '8888',password:"test",role:"user"},
];


const fetchUserData = async () => {
  console.log("fetchUserData");
  const userReservations = await getReservationByID(1);
  const allUser = await getAllUsers();

  console.log("userReservations:", userReservations);
  console.log("allUser:", allUser);
  return userReservations;
}




const DAYS_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"];

// カレンダーの初期状態を設定するためのフック
// initialReservations: 予約情報の初期状態
// initialEmployees: 従業員情報の初期状態
// currentDate: 現在の日付
// changeMonth: 月を変更する関数
// getReservationStatus: 指定された日付と従業員IDに対する予約状況を返す関数
const useCalendar = (initialReservations: Reservation[], initialEmployees: User[]) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(today);
  
  //月変更用
  const changeMonth = (amount: number) => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + amount));
  };

  //指定された日付と従業員IDに予約が存在するかどうかを判定する
  const isReservationExists = (reservations: Reservation[], date: string, employeeId: number) => {
    return reservations.find(
      reservation => reservation.user_id === employeeId && reservation.reservation_date === date
    );
  };

  //指定された日付と従業員IDに予約状況を取得する
  // date: 日付
  // employeeId: 従業員ID
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
  fetchUserData();
  console.log(fetchUserData)

  return <Calendar />;
}
