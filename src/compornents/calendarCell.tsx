// CalendarCell.tsx
import React, { FC, useState } from 'react';
import { TableCell, Tooltip, Button } from '@mui/material';
import { HdrAuto } from '@mui/icons-material';
import { createTheme } from '@mui/material/styles';
import { purple } from '@mui/material/colors';


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
    return { backgroundColor: "red" };
  }
  if(highlighted){
    return { backgroundColor: "yellow" };
  }
  if (reservationStatus==="予約済") {
    return { backgroundColor: "blue" };
  }
  if (buttonDate < new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())) {
    return { backgroundColor: "black", color: "white" };
  }
  return { color: "black"};
};

const CalendarCell: FC<CalendarCellProps> = ({ day, reservationStatus, date, onSelect, onHighlight,highlightedDates, unHighlightAll }) => {
  const [highlighted, setHighlighted] = useState(false);
  const isHighlighted = highlightedDates.includes(date)

  const handleClick = () => {
    setHighlighted(!highlighted);
    onSelect(date, reservationStatus);
    if (!highlighted) {
      onHighlight(date);
    } else {
      unHighlightAll();
    }
  };
  



  return (
    <TableCell style={getButtonStyle(isHighlighted, reservationStatus, day, date)}>
      <Tooltip title={`Date: ${date}`}>
        <Button color="secondary" onClick={handleClick}>
          <span>{day}</span>
          <span>{reservationStatus}</span>
        </Button>
      </Tooltip>
    </TableCell>
  );
};

export default CalendarCell;
