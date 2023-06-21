import React, { FC } from 'react';
import { User } from './types';
import { TableRow, TableCell } from '@mui/material';
import { getFirstDayOfMonth, getDaysInMonth, formatDate } from './functions';
import ExcludedCell from './excludeCalendarCell';

type CalendarRowProps = {
  employee: User;
  currentDate: Date;
  getExcludeStatus: (date: string) => string;
  onHighlight: (date: string) => void;
  onSelect: (date: string, excludedStatus: string) => void;
  highlightedDates: string[];
  unhighlightAll: () => void;
};

const AdminCalendarRow: FC<CalendarRowProps> = ({ 
  employee, 
  currentDate, 
  getExcludeStatus,
  onHighlight, 
  onSelect,
  highlightedDates, 
  unhighlightAll
}) => {
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
      const excludedStatus = getExcludeStatus(date);
      cells.push(
        <ExcludedCell 
          key={`day-${employee.id}-${day}`} 
          date = {date}
          day={day} 
          excludedStatus={excludedStatus} 
          onSelect={onSelect}
          onHighlight={onHighlight} 
          highlightedDates={highlightedDates} 
          unHighlightAll={unhighlightAll} 
        />
      );
    }
  }
  
  if (cells.length > 0) {
    rows.push(<TableRow key={`row-${employee.id}-${rows.length}`}>{cells}</TableRow>);
  }
  
  return <>{rows}</>;
}

export default AdminCalendarRow;
