import React, { useState } from 'react';
import { styled } from '@mui/system';
import { Box, Button, Card } from '@mui/material';
import ClockDisplay from './clockDisplay';

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
  const [isReservationStopped, setIsReservationStopped] = useState<boolean>(false);

  const handleToggleReservation = () => {
    setIsReservationStopped((prevState) => !prevState);
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
            isReservationStopped={isReservationStopped}
          />
        </Card>
      </StyledCard>
    </RootDiv>
  );
};

interface ReservationButtonProps {
  onClick: () => void;
  isReservationStopped: boolean;
}

const ReservationButton: React.FC<ReservationButtonProps> = ({ onClick, isReservationStopped }) => {
  return (
    <Button 
      variant="contained" 
      color="primary" 
      onClick={onClick} 
      sx={{ padding: 2, fontSize: 18 }}
    >
      {isReservationStopped ? '予約機能再開' : '予約機能停止'}
    </Button>
  );
};

export default AdminTimeLock;
