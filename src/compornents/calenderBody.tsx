// CalendarBody.tsx
import React, { FC } from 'react';
import { Employee } from './types';
import CalendarRow from './calenderRow';

type CalendarBodyProps = {
  currentDate: Date;
  employeeList: Employee[];
  getReservationStatus: (date: string, employeeId: number) => string;
};

const CalendarBody: FC<CalendarBodyProps> = ({ currentDate, employeeList, getReservationStatus }) => {
  return (
    <>
      {employeeList.map((employee, index) => (
        <CalendarRow
          key={index}
          employee={employee}
          currentDate={currentDate}
          getReservationStatus={getReservationStatus}
        />
      ))}
    </>
  )
}

export default CalendarBody;