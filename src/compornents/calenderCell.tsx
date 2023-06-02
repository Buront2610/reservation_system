// CalendarCell.tsx
import React, { FC } from 'react';
import { TableCell, Tooltip } from '@mui/material';

type CalendarCellProps = {
  day: number;
  reservationStatus: string;
  date: string;
};

const CalendarCell: FC<CalendarCellProps> = ({ day, reservationStatus, date }) => {
  return (
    <TableCell style={reservationStatus ? {backgroundColor: "yellow"} : {}}>
      <Tooltip title={`Date: ${date}`}>
        <span>{day}</span>
      </Tooltip>
      <span>{reservationStatus}</span>
    </TableCell>
  );
}

export default CalendarCell;
