

import { useState,useEffect, FC, useMemo } from 'react';
import { Reservation, User, TimeFlag} from './types';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,Button } from '@mui/material';
import  CalenderHeader  from './calendarHeader';
import CalendarBody from './calendarBody';
import { getReservationByID, getUserById, getAllUsers ,addReservation, deleteReservation, getStatistics , getTimeFlagByID} from './API';
import { hi } from 'date-fns/locale';
import { getExcludes, addExclude, deleteExclude } from './API';
import { Exclude } from './types';
// Define dummy data


const dummyEmployees: User[] = [
    { id: 1, employee_number:'0001', name: 'John Doe', workplace_id: 1, email_address: 'test@test.co.jp',  hide_flag: false, telephone: '8888',password:"test",role:"user"},
];


const DAYS_OF_WEEK = ["日", "月", "火", "水", "木", "金", "土"];


function useFetchExcludes() {
    const [excludes, setExcludes] = useState<Exclude[] | null>(null);
    
    useEffect(() => {
      const fetchExcludes = async () => {
        try {
          const excludeRes = await getExcludes();
          setExcludes(excludeRes);
        } catch (error) {
          console.error(error);
        }
      };
      
      fetchExcludes();
    }, []);
  
    return excludes;
}



// カレンダーの初期状態を設定するためのフック
// initialReservations: 予約情報の初期状態
// initialEmployees: 従業員情報の初期状態
// currentDate: 現在の日付
// changeMonth: 月を変更する関数
// getReservationStatus: 指定された日付と従業員IDに対する予約状況を返す関数


const useCalendar = (initialExcludes: Exclude[]) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(today);
  
  // 月を変更する関数
  const changeMonth = (amount: number) => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + amount));
  };

  // 指定された日付が除外日であるかを判定する
  const isExcludeExists = (excludes: Exclude[], date: string,) => {
    return excludes.some(exclude => exclude.date === date);
  };

  // 指定された日付の除外状況を取得する
  // getExcludeStatus関数をメモ化します
  const getExcludeStatus = useMemo(() => {
    return (date: string) => {
      return isExcludeExists(initialExcludes, date) ? "除外済" : "";
    };
  }, [initialExcludes]);

  return { currentDate, initialExcludes,changeMonth, getExcludeStatus };
}


const Calendar: FC<{ excludedDates: Exclude[];  reloadExcludes: () => void }> = ({excludedDates, reloadExcludes}) => {
  const { currentDate, initialExcludes, changeMonth, getExcludeStatus } = useCalendar(excludedDates);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedExcludeIds, setSelectedExcludeIds] = useState<number[] | null>(null);
  // Calendar.tsx
  const [highlightedDates, setHighlightedDates] = useState<string[]>([]);


  const handleHighlight = (date: string) => {
    setHighlightedDates(prevDates =>
      prevDates.includes(date) ? prevDates.filter(d => d !== date) : [...prevDates, date]
    );

    const excludeStatus = getExcludeStatus(date);

    if (excludeStatus === "除外済") {
      const exclude = initialExcludes.find(ex => ex.date === date);
      if (exclude) {
        setSelectedExcludeIds(prevIds => prevIds ? [...prevIds, exclude.id] : [exclude.id]);
      }
    } else {
      setSelectedExcludeIds(prevIds => prevIds ? prevIds.filter(id => {
        const exclude = initialExcludes.find(ex => ex.id === id);
        return exclude && exclude.date !== date;
      }) : []);
    }
  };

  const handleUnHighlightAll = () => {
    setHighlightedDates([]); // unhighlight all
  };
  
  
  
  
  const handleAddExclude = async () => {
    setIsProcessing(true);
  
    if (!isProcessing) {
      try {
        for (let date of highlightedDates) {
          const newExclude = { date };
          await addExclude(newExclude);
          alert(`Date ${date} successfully excluded.`);
        }
        // Refresh excludes data
        await reloadExcludes();
        setHighlightedDates([]); // Clear highlighted dates after adding
      } catch (error) {
        console.error(error);
      }
    }
  
    setIsProcessing(false);
  };
  
  const handleDeleteExclude = async () => {
    setIsProcessing(true);
  
    if (!isProcessing && selectedExcludeIds && highlightedDates) {
      try {
        for (let date of highlightedDates) {
          await deleteExclude(id);
          alert(`Date ${date} successfully removed from exclude list.`);
        }
        // Refresh excludes data
        await reloadExcludes();
        setHighlightedDates([]); // Clear highlighted dates after deleting
      } catch (error) {
        console.error(error);
      }
    }
  
    setIsProcessing(false);
  };
  
  const handleSelect = (date: string, excludedStatus: string) => {
    setSelectedDate(date);
    // 予約ステータスが"予約済"の場合は、予約IDをセットします。
    // これは予約IDをどのように取得するかに依存します。ここではサンプルとして予約ステータスを使います。
    if (excludedStatus === '除外済') {
      const exclude = excludedDates.find(res => res.date === date);
      if (exclude) {
      }
    } else {
      setSelectedExcludeIds(null);
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
              employeeList={dummyEmployees}
              getAttributeStatus={getExcludeStatus}
              onSelect={handleSelect}
              onHighlight={handleHighlight}
              highlightedDates={highlightedDates}
              unHighlightAll={handleUnHighlightAll}
            />
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" marginTop={2}><Button variant="contained" color="primary" onClick={handleAddExclude} disabled={isProcessing}>
          予約
        </Button>
        <Button variant="contained" color="secondary" onClick={handleDeleteExclude} disabled={isProcessing}>
          予約キャンセル
        </Button>
      </Box>
    </Box>
  );
}
export default function AdminExcludeDaysEditPage() {
    const [excludedDates, setExcludedDates] = useState<Exclude[] | null>(null);
  
    const fetchExcludeData = async () => {
      try {
        const excludes = await getExcludes();
        setExcludedDates(excludes);
      } catch (error) {
        console.error(error);
      }
    };
  
    const reloadExcludes = async () => {
      await fetchExcludeData();
    }
  
    useEffect(() => {
      reloadExcludes();
    }, []);
  
    return excludedDates ? <Calendar excludedDates={excludedDates} reloadExcludes={reloadExcludes} /> : <div>Loading...</div>;
  }
  