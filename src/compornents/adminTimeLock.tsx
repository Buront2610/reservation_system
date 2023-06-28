import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Box, Button, Card, Snackbar, Alert } from '@mui/material';
import ClockDisplay from './clockDisplay';
import { getTimeFlagByID, updateTimeFlag } from './API';
import { TimeFlag } from './types';
import { useUserAuthenticationLogoutNavigate } from './useUserAuthLogoutNavigate';

const RootDiv = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  size: 'large'
});

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  padding: theme.spacing(2),
  minWidth: '50%',
}));

const AdminTimeLock: React.FC = () => {
  const [timeFlag, setTimeFlag] = useState<TimeFlag | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useUserAuthenticationLogoutNavigate();

  useEffect(() => {
    const fetchTimeFlag = async () => {
      try {
        const initialFlag = await getTimeFlagByID(1);
        setTimeFlag(initialFlag);
      } catch (error) {
        setError('時間帯フラグの取得に失敗しました。');
        setOpen(true);
      }
    };

    fetchTimeFlag();
  }, []);

  const handleToggleReservation = async () => {
    if (timeFlag) {
      try {
        const newFlag: TimeFlag = { id: timeFlag.id, time_flag: !timeFlag.time_flag };
        const updatedFlag = await updateTimeFlag(newFlag);
        setTimeFlag(updatedFlag); // Change this line
      } catch (error) {
        setError('時間帯フラグの更新に失敗しました。');
        setOpen(true);
      }
    }
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setError(null);
  };
  
  const handleAlertClose = (event: React.SyntheticEvent<Element, Event>) => {
    setError(null);
  };

  return (
    <RootDiv>
      <StyledCard>
        <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, width: '80%', height: '30vh' ,color:'black'}}>
          <ClockDisplay />
        </Card>
        <Card sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '80%', height: '10vh' }}>
          <ReservationButton
            onClick={handleToggleReservation}
            isReservationStopped={timeFlag ? timeFlag.time_flag : false}
            disabled={!timeFlag}
          />
        </Card>
      </StyledCard>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleAlertClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </RootDiv>
  );
};

interface ReservationButtonProps {
  onClick: () => void;
  isReservationStopped: boolean; // Change this line
  disabled: boolean;
}

const ReservationButton: React.FC<ReservationButtonProps> = ({ onClick, isReservationStopped, disabled }) => {
  return (
    <Button 
      variant="contained" 
      color="primary" 
      onClick={onClick} 
      disabled={disabled}
      sx={{ padding: 2, fontSize: 18 }}
    >
      {isReservationStopped ? '予約機能再開' : '予約機能停止'}
    </Button>
  );
};

export default AdminTimeLock;
