// CalendarRow.tsx
import React, { FC } from 'react';
import { Employee } from './types';
import { TableRow, TableCell } from '@mui/material';
import { getFirstDayOfMonth, getDaysInMonth, formatDate } from './functions';
import CalendarCell from './calendarCell';

type CalendarRowProps = {
  employee: Employee;
  currentDate: Date;
  getReservationStatus: (date: string, employeeId: number) => string;
};

const CalendarRow: FC<CalendarRowProps> = ({ employee, currentDate, getReservationStatus }) => {
  let rows = [];
  let cells = [];
  let dayOffset = getFirstDayOfMonth(currentDate);
  let count = 0;

  for (let day = 0 - dayOffset; day <= getDaysInMonth(currentDate); day++) {
    if(day==-6 && cells.length==0){
      day = 1;
    }

    if ((day + dayOffset) % 7 === 0) {
      rows.push(<TableRow key={`row-${employee.id}-${rows.length}`}>{cells}</TableRow>);
      cells = [];
    }

    if (day <= 0) {
      cells.push(<TableCell key={`empty-${employee.id}-${day}`}></TableCell>);
    } else {
      const date = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
      const reservationStatus = getReservationStatus(date, employee.id);
      cells.push(
        <CalendarCell key={`day-${employee.id}-${day}`} day={day} reservationStatus={reservationStatus} date={date} />
      );
    }
  }
  if (cells.length > 0) {
    rows.push(<TableRow key={`row-${employee.id}-${rows.length}`}>{cells}</TableRow>);
  }
  return <>{rows}</>;
}

export default CalendarRow;
