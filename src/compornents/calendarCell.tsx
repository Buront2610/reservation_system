// CalendarCell.tsx
import React, { FC, useState, useEffect} from 'react';
import { TableCell, Tooltip, Button } from '@mui/material';
import { HdrAuto } from '@mui/icons-material';
import { createTheme } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
import { getExcludes } from './API';
import { Exclude } from './types';


interface CalendarCellProps {
  day: number;
  reservationStatus: string;
  date: string;
  onSelect: (date: string, reservationStatus: string) => void;
  onHighlight: (date: string) => void;
  highlightedDates: string[];
  unHighlightAll: () => void;
}


const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: purple[500],
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#11cb5f',
    },
  },
});


const getButtonStyle = (highlighted:boolean, reservationStatus:string, day:number, date:string) => {
  const currentDate = new Date();
  const buttonDate = new Date(date);
  if (highlighted && reservationStatus==="予約済") {
    return { backgroundColor: "#FFCC33" };
  }
  if(highlighted){
    return { backgroundColor: "#CCFFFF" };
  }
  if (reservationStatus==="予約済") {
    return { backgroundColor: "#99FF99" };
  }
  if (buttonDate < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) {
    // return { backgroundColor: "black", color: "white" };
  }
  return { color: "black"};
};

const CalendarCell: FC<CalendarCellProps> = ({ day, reservationStatus, date, onSelect, onHighlight,highlightedDates, unHighlightAll }) => {
  const isHighlighted = highlightedDates.includes(date)
  const [excludedDates, setExcludedDates] = useState<string[]>([]); // 除外日付を格納する状態を作成

  useEffect(() => {
    // APIから除外日を取得
    getExcludes().then((excludes: Exclude[]) => {
      setExcludedDates(excludes.map(exclude => exclude.exclude_date)); // 除外日を状態にセット
    });
  }, []);


  const handleClick = () => {
    onSelect(date, reservationStatus);
    if (!isHighlighted) {
      onHighlight(date);
    } else {
      onHighlight(date); // ハイライトを個別に解除するように修正
    }
  };
  
  
  const isDisabled = (date: string) => {
    const currentDate = new Date();
    const buttonDate = new Date(date);
    return buttonDate < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) || excludedDates.includes(date); // 除外日かどうかもチェック
  };

  
  const buttonDisabled = isDisabled(date);

  return (
    <TableCell style={getButtonStyle(isHighlighted, reservationStatus, day, date)}>
      <Tooltip title={`Date: ${date}`}>
        <Button color="secondary" onClick={handleClick} style={{fontSize: 16}} disabled={buttonDisabled}>
          <span>{day}</span>
          <span>{reservationStatus}</span>
        </Button>
      </Tooltip>
    </TableCell>
  );
};

export default CalendarCell;
