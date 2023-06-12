import { useState,useEffect, FC } from 'react';
import { Reservation, User} from './types';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Button } from '@mui/material';
import  CalenderHeader  from './calendarHeader';
import CalendarBody from './calendarBody';
import { getReservationByID, getUserById, getAllUsers ,addReservation, deleteReservation } from './API';
// Define dummy data


const dummyEmployees: User[] = [
    { id: 1,employee_number:1, name: 'John Doe', workplace_id: 1, email_address: 'test@test.co.jp',  hide_flag: false, telephone: '8888',password:"test",role:"user"},
];


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
  return reservations.some(reservation => reservation.user_id === employeeId && reservation.reservation_date === date);
};

//指定された日付と従業員IDに予約状況を取得する
const getReservationStatus = (date: string, employeeId: number) => {
  return isReservationExists(initialReservations, date, employeeId) ? "予約済" : "";
};

  return { currentDate, initialEmployees, changeMonth, getReservationStatus };
}
const Calendar: FC<{ userReservations: Reservation[] }> = ({userReservations}) => {
  const { currentDate, initialEmployees, changeMonth, getReservationStatus } = useCalendar(userReservations, dummyEmployees);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);

  const handleAddReservation = async () => {
    if (selectedDate && selectedUserId) {
      if (new Date(selectedDate) < new Date()) {
        alert('過去の日付に予約を追加することはできません');
        return;
      }
  
      const newReservation: Partial<Reservation> = {
        user_id: selectedUserId,
        reservation_date: selectedDate,
        bento_id:1,
        quantity:1,
        remarks:"通常予約"

      };
  
      try {
        await addReservation(newReservation);
        // データをリフレッシュするなどの処理が必要な場合はここに記述
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleDeleteReservation = async () => {
    if (selectedReservationId) {
      if (selectedDate && new Date(selectedDate) < new Date()) {
        alert('過去の予約はキャンセルできません');
        return;
      }
  
      try {
        await deleteReservation(selectedReservationId);
        // データをリフレッシュするなどの処理が必要な場合はここに記述
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSelect = (date: string, reservationStatus: string) => {
    setSelectedDate(date);
    // 予約ステータスが"予約済"の場合は、予約IDをセットします。
    // これは予約IDをどのように取得するかに依存します。ここではサンプルとして予約ステータスを使います。
    if (reservationStatus === '予約済') {
      const reservation = userReservations.find(res => res.reservation_date === date);
      if (reservation) {
        setSelectedReservationId(reservation.id);
      }
    } else {
      setSelectedReservationId(null);
    }
  };
  
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
              onSelect={handleSelect}
            />
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" marginTop={2}>
        <Button variant="contained" color="primary" onClick={handleAddReservation}>
          予約
        </Button>
        <Button variant="contained" color="secondary" onClick={handleDeleteReservation}>
          予約キャンセル
        </Button>
      </Box>
    </Box>
  );
}

export default function TestReservationHistoryPage() {
  const [userReservation, setUserReservation] = useState<Reservation[] | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await getReservationByID(1);  // ユーザーIDを適切に変更
        setUserReservation(userRes);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);
  console.log(userReservation);

  // userReservationがnullでない場合のみCalendarをレンダリング
  return userReservation ? <Calendar userReservations={userReservation} /> : <div>Loading...</div>;
}
