import React, { FC } from 'react';
import { User } from './types';
import AdminCalendarRow from './adminCalendarRow';

type CalendarBodyProps = {
  currentDate: Date;
  employeeList: User[];
  getExcludeStatus: (date: string) => string;
  onHighlight: (date: string) => void;
  onSelect: (date: string, excludedStatus: string) => void;
  highlightedDates: string[];
  unHighlightAll: () => void;
};

const AdminCalendarBody: FC<CalendarBodyProps> = ({ 
  currentDate, 
  employeeList, 
  getExcludeStatus, 
  onHighlight: onToggleDateHighlight, 
  onSelect,
  highlightedDates,
  unHighlightAll: onUnhighlightAllDates
}) => {
  return (
    <>
      {employeeList.map((employee, index) => (
        <AdminCalendarRow
          key={index}
          employee={employee}
          currentDate={currentDate}
          getExcludeStatus={getExcludeStatus}
          onHighlight={onToggleDateHighlight}
          onSelect={onSelect}
          highlightedDates={highlightedDates}
          unhighlightAll={onUnhighlightAllDates}
        />
      ))}
    </>
  );
}

export default AdminCalendarBody;
