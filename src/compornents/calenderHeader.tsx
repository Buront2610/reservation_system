// CalendarHeader.tsx
import React, { FC } from 'react';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

type CalendarHeaderProps = {
  changeMonth: (amount: number) => void;
  currentDate: Date;
};

const CalenderHeader: FC<CalendarHeaderProps> = ({ changeMonth, currentDate }) => {
  return (
    <Box>
      <IconButton onClick={() => changeMonth(-1)}>
        <ChevronLeft />
      </IconButton>
      <h2>{`${currentDate.getFullYear()}年 ${currentDate.getMonth() + 1}月`}</h2>
      <IconButton onClick={() => changeMonth(1)}>
        <ChevronRight />
      </IconButton>
    </Box>
  );
}

export default CalenderHeader;
