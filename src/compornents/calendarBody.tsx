// CalendarBody.tsx
import React, { FC } from 'react';
import { User } from './types';
import CalendarRow from './calendarRow';
import { on } from 'events';
import { StringMappingType } from 'typescript';

type CalendarBodyProps = {
  currentDate: Date;
  employeeList: User[];
  getReservationStatus: (date: string, employeeId: string) => string;
  onSelect: (date: string, reservationStatus: string) => void;
  onHighlight: (date: string) => void;
};


const CalendarBody: FC<CalendarBodyProps> = ({ currentDate, employeeList, getReservationStatus , onSelect, onHighlight}) => {
  return (
    <>
      {employeeList.map((employee, index) => (
        <CalendarRow
          key={index}
          employee={employee}
          currentDate={currentDate}
          getReservationStatus={getReservationStatus}
          onSelect={onSelect}
          onHighlight={onHighlight}
        />
      ))}
    </>
  )
}

export default CalendarBody;