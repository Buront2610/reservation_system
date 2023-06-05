import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Box, Button, Card } from '@mui/material';

const RootDiv = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  size: 'large'
});

interface TimeFlag {
  id: number;
  timeFlag: boolean;
}

export default function AdminTimeLock() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isReservationStopped, setIsReservationStopped] = useState<boolean>(false);

  //時計用useEffect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleReservation = () => {
    setIsReservationStopped((prevState) => !prevState);
  };

  return (
    <RootDiv>
      <Card sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
          <div style={{ fontSize: '1.5em', marginBottom: '2em', padding: '1em', backgroundColor: '#222', color: '#fff', textAlign: 'center' }}>
            {`${currentTime.getFullYear()}-${String(currentTime.getMonth() + 1).padStart(2, '0')}-${String(currentTime.getDate()).padStart(2, '0')}`}<br/>
            {`${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}:${String(currentTime.getSeconds()).padStart(2, '0')}`}
          </div>
          <ReservationButton
            onClick={handleToggleReservation}
            disabled={isReservationStopped}
            label="予約機能停止"
          />
          <ReservationButton
            onClick={handleToggleReservation}
            disabled={!isReservationStopped}
            label="予約機能再開"
          />
        </Box>
      </Card>
    </RootDiv>
  );
}

interface ReservationButtonProps {
  onClick: () => void;
  disabled: boolean;
  label: string;
}

const ReservationButton: React.FC<ReservationButtonProps> = ({ onClick, disabled, label }) => {
  return (
    <Button variant="contained" color={disabled ? 'secondary' : 'primary'} onClick={onClick} disabled={disabled} sx={{ padding: 2, fontSize: 18 }}>
      {label}
    </Button>
  );
};
