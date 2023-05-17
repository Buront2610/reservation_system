

import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';

interface ReservationPageProps {
  date: string;
  isReserved: boolean;
}

const ReservationPage: React.FC<ReservationPageProps> = ({ date, isReserved }) => {
  const [reserved, setReserved] = useState(isReserved);

  const handleReservation = () => {
    setReserved(true);
    // TODO: Add reservation logic here
  };

  const handleCancelReservation = () => {
    setReserved(false);
    // TODO: Add cancel reservation logic here
  };

  return (
    <div>
      <Typography variant="h4">Reservation for {date}</Typography>
      <Typography variant="h6">{reserved ? 'Reserved' : 'Not reserved'}</Typography>
      {reserved ? (
        <Button variant="contained" color="error" onClick={handleCancelReservation}>
          Cancel Reservation
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={handleReservation}>
          Reserve
        </Button>
      )}
    </div>
  );
};

export default ReservationPage;