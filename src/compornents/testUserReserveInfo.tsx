import { useState,useEffect, FC, useMemo } from 'react';
import { Reservation, User, TimeFlag} from './types';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Button } from '@mui/material';
import  CalenderHeader  from './calendarHeader';
import CalendarBody from './calendarBody';
import { getReservationByID, getUserById, getAllUsers ,addReservation, deleteReservation, getStatistics , getTimeFlagByID} from './API';
import { hi } from 'date-fns/locale';
// Define dummy data


const dummyEmployees: User[] = [
    { id: 1, employee_number:'0001', name: 'John Doe', workplace_id: 1, email_address: 'test@test.co.jp',  hide_flag: false, telephone: '8888',password:"test",role:"user"},
];


const DAYS_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"];


function useFetchUserData(id: string) {
  const [userReservation, setUserReservation] = useState<Reservation[] | null>(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await getReservationByID(id);
        setUserReservation(userRes);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchUserData();
  }, [id]);

  return userReservation;
}



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
const isReservationExists = (reservations: Reservation[], date: string, employeeId: string) => {
  return reservations.some(reservation => reservation.user_id === employeeId && reservation.reservation_date === date);
};

//指定された日付と従業員IDに予約状況を取得する
// getReservationStatus関数をメモ化します
const getReservationStatus = useMemo(() => {
  return (date: string, employeeId: string) => {
    return isReservationExists(initialReservations, date, employeeId) ? "予約済" : "";
  };
}, [initialReservations]);


  return { currentDate, initialEmployees, changeMonth, getReservationStatus };
}


const Calendar: FC<{ userReservations: Reservation[]; reloadReservations: () => void }> = ({userReservations, reloadReservations}) => {
  const { currentDate, initialEmployees, changeMonth, getReservationStatus } = useCalendar(userReservations, dummyEmployees);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedReservationId, setSelectedReservationId] = useState<number[] | null>(null);
  // Calendar.tsx
  const [highlightedDates, setHighlightedDates] = useState<string[]>([]);

  const handleHighlight = (date: string) => {
    setHighlightedDates(prevDates =>
      prevDates.includes(date) ? prevDates.filter(d => d !== date) : [...prevDates, date]
    );
  
    // Check reservation for the date
    const reservationStatus = getReservationStatus(date, dummyEmployees[0].employee_number);  //適切なemployeeIdに置き換えてください
  
    if (reservationStatus === '予約済') {
      const reservation = userReservations.find(res => res.reservation_date === date);
      if (reservation) {
        setSelectedReservationId(prevIds => prevIds ? [...prevIds, reservation.id] : [reservation.id]);
      }
    } else {
      setSelectedReservationId(prevIds => prevIds ? prevIds.filter(id => {
        const reservation = userReservations.find(res => res.id === id);
        return reservation && reservation.reservation_date !== date;
      }) : null);
    }
  };
  const handleUnHighlightAll = () => {
    setHighlightedDates([]); // unhighlight all
  };
  
  
  
  
  const handleAddReservation = async () => {
    setIsProcessing(true);
    const successfulDates: string[] = [];

    if (highlightedDates && dummyEmployees[0].employee_number) {
      for (let date of highlightedDates) {
        let now = new Date();
        let selectedDate = new Date(date);
        
        // Create new date objects without time information
          let nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
          let selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
  
        if (selectedDateOnly < nowDateOnly) {
          console.log(selectedDateOnly);
          console.log(nowDateOnly);
          alert('過去の日付に予約を追加することはできません');
          return;
        }
  
        // Check if TimeFlag is true, then abort the process
        const timeFlag: TimeFlag = await getTimeFlagByID(1);
        if (selectedDateOnly.getTime() === nowDateOnly.getTime() && timeFlag.time_flag) {
          alert('本日分のお弁当の予約時間を過ぎました');
          return;
        }
  
        const reservationExists = getReservationStatus(date, dummyEmployees[0].employee_number);
  
        if (reservationExists === "") {
          const newReservation: Partial<Reservation> = {
            user_id: dummyEmployees[0].employee_number,
            reservation_date: date,
            bento_id:1,
            quantity:1,
            remarks:"通常予約"
          };
      
          try {
            await addReservation(newReservation);
            // Refresh data after reservation
            successfulDates.push(date);
  
          } catch (error) {
            console.error(error);
          }
        } else {
          console.log(`Date ${date} is already reserved.`);
        }
      }
      if (successfulDates.length > 0) {
        alert(`${successfulDates.join(', ')}の予約が成功しました`);
        await reloadReservations();
        setHighlightedDates([]); // ハイライト解除

      }
    }
    setIsProcessing(false);
  };
  
  const handleDeleteReservation = async () => {
    window.confirm('予約をキャンセルしますか？');

    setIsProcessing(true); //処理中のフラグを立てる
    const successfulDates: string[] = [];
    if (selectedReservationId && highlightedDates) {
      for (let date of highlightedDates) {
        let now = new Date();
        let selectedDate = new Date(date);
        
        // Create new date objects without time information
        let nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
        let selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());

        if (selectedDateOnly < nowDateOnly) {
          console.log(selectedDateOnly);
          console.log(nowDateOnly);
          alert('過去の予約はキャンセルできません');
          return;
        }
        const timeFlag: TimeFlag = await getTimeFlagByID(1);
        if (selectedDateOnly.getTime() === nowDateOnly.getTime() && timeFlag.time_flag) {
          alert('本日の予約時間を過ぎました');
          setIsProcessing(false); //処理中のフラグを下げる
          return;
        }
        
        const reservationExists = getReservationStatus(date, dummyEmployees[0].employee_number);

        if (reservationExists === "予約済") {
          const reservationId = selectedReservationId.find(id => {
            const reservation = userReservations.find(res => res.id === id);
            return reservation && reservation.reservation_date === date;
          });
          if (reservationId) {
            try {
              await deleteReservation(reservationId);
              successfulDates.push(date);
            } catch (error) {
              console.error(error);
            }
          }
        } else {
          console.log(`No reservation exists for date ${date}.`);
        }
      }
      if (successfulDates.length > 0) {
        alert(`${successfulDates.join(', ')}の予約をキャンセルしました`);
        await reloadReservations();
        setHighlightedDates([]); // ハイライト解除
      }
    }
    setIsProcessing(false); //処理中のフラグを下げる
  };
  
  const handleSelect = (date: string, reservationStatus: string) => {
    setSelectedDate(date);
    // 予約ステータスが"予約済"の場合は、予約IDをセットします。
    // これは予約IDをどのように取得するかに依存します。ここではサンプルとして予約ステータスを使います。
    if (reservationStatus === '予約済') {
      const reservation = userReservations.find(res => res.reservation_date === date);
      if (reservation) {
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
              onHighlight={handleHighlight}
              highlightedDates={highlightedDates}
              unHighlightAll={handleUnHighlightAll}
            />
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" marginTop={2}><Button variant="contained" color="primary" onClick={handleAddReservation} disabled={isProcessing}>
          予約
        </Button>
        <Button variant="contained" color="secondary" onClick={handleDeleteReservation} disabled={isProcessing}>
          予約キャンセル
        </Button>
      </Box>
    </Box>
  );
}

export default function TestReservationHistoryPage() {    
  const [userReservation, setUserReservation] = useState<Reservation[] | null>(null);
  
  const fetchUserData = async () => {
    try {
      const userRes = await getReservationByID(dummyEmployees[0].employee_number);
      setUserReservation(userRes);
    } catch (error) {
      console.error(error);
    }
  };

  const reloadReservations = async () => {
    await fetchUserData();
  }

  useEffect(() => {
    reloadReservations();
  }, []);

  return userReservation ? <Calendar userReservations={userReservation} reloadReservations={reloadReservations} /> : <div>Loading...</div>;
}
