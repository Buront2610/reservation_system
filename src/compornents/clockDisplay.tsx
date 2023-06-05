import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Typography } from '@mui/material';

const TimeDisplay = styled(Typography)(({ theme }) => ({
    fontSize: '3rem', 
    marginBottom: theme.spacing(2), 
    padding: theme.spacing(1), 
    backgroundColor: '#222', 
    color: '#fff', 
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    minWidth: '70%',
    minHeight: '70',
}));

const ClockDisplay: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}<br/>${hours}:${minutes}:${seconds}`;
  };

  return (
    <TimeDisplay dangerouslySetInnerHTML={{ __html: formatDate(currentTime) }} />
  );
};

export default ClockDisplay;
