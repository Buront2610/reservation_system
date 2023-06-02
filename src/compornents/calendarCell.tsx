// CalendarCell.tsx
import React, { FC, useState } from 'react';
import { TableCell, Tooltip, Button } from '@mui/material';
import { HdrAuto } from '@mui/icons-material';


type CalendarCellProps = {
  day: number;
  reservationStatus: string;
  date: string;
};

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

const CalendarCell: FC<CalendarCellProps> = ({ day, reservationStatus, date }) => {
  const [highlighted, setHighlighted] = useState(false);

  const handleClick = () => {
    setHighlighted(!highlighted);
  };



  return (
    <TableCell style={getButtonStyle(highlighted, reservationStatus, day, date)}>
      <Tooltip title={`Date: ${date}`}>
        <Button  onClick={handleClick}>
          <span>{day}</span>
          <span>{reservationStatus}</span>
        </Button>
      </Tooltip>
    </TableCell>
  );
};

export default CalendarCell;
