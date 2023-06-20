// CalendarBody.tsx
import React, { FC } from 'react';
import { User ,Exclude } from './types';
import CalendarRow from './calendarRow';
import { on } from 'events';
import { StringMappingType } from 'typescript';

type CalendarBodyProps = {
  currentDate: Date;
  employeeList: User[];
  getReservationStatus: (date: string, employeeId: string) => string;
  onSelect: (date: string, reservationStatus: string) => void;
  onHighlight: (date: string) => void;
  highlightedDates: string[];
  unHighlightAll: () => void;
};


const CalendarBody: FC<CalendarBodyProps> = ({ currentDate, employeeList, getReservationStatus , onSelect, onHighlight, highlightedDates,unHighlightAll}) => {
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
          highlightedDates={highlightedDates}
          unHighlightAll={unHighlightAll}
        />
      ))}
    </>
  )
}

export default CalendarBody;