import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Reservation, Employee } from './types';

// Dummy Data
const dummyReservations: Reservation[] = [
    { id: 1, employee_id: 1, reservation_date: '2023-05-15', bento_id: 1, quantity: 1, is_delivered: true },
    { id: 2, employee_id: 1, reservation_date: '2023-05-20', bento_id: 2, quantity: 2, is_delivered: false },
    { id: 3, employee_id: 1, reservation_date: '2023-05-30', bento_id: 1, quantity: 1, is_delivered: true },
];

const dummyEmployees: Employee[] = [
    { id: 1, name: 'John Doe', workplace_id: 1 },
];

// Mocked API Functions
const getReservations = () => Promise.resolve(dummyReservations);
const getEmployees = () => Promise.resolve(dummyEmployees);

function TestReservationHistoryPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);

    useEffect(() => {
        getReservations().then(setReservations);
    }, []);

    const reservedDates = reservations.map(reservation => new Date(reservation.reservation_date));

    type View = 'month' | 'year' | 'decade' | 'century';
    type TileContentProps = { date: Date; view: View };

    const tileContent = ({ date, view }: TileContentProps) => {
        if (view === 'month' && reservedDates.some(d => d.getTime() === date.getTime())) {
            return <p>予約済</p>;
        }
        return null;
    };

    return (
        <div>
            <h3>予約一覧</h3>
            <Calendar
                tileContent={tileContent}
            />
        </div>
    );
};

export default TestReservationHistoryPage;