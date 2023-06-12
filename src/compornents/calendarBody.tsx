// CalendarBody.tsx
import React, { FC } from 'react';
import { User } from './types';
import CalendarRow from './calendarRow';
import { on } from 'events';

type CalendarBodyProps = {
  currentDate: Date;
  employeeList: User[];
  getReservationStatus: (date: string, employeeId: number) => string;
  onSelect: (date: string, reservationStatus: string) => void;
};


const CalendarBody: FC<CalendarBodyProps> = ({ currentDate, employeeList, getReservationStatus , onSelect}) => {
  return (
    <>
      {employeeList.map((employee, index) => (
        <CalendarRow
          key={index}
          employee={employee}
          currentDate={currentDate}
          getReservationStatus={getReservationStatus}
          onSelect={onSelect}
        />
      ))}
    </>
  )
}

export default CalendarBody;