import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Workplace, Reservation, Employee, Bento } from './types';

// Dummy data
const workplaceData = [
  { id: 1, name: '1F', location: 'Tokyo' },
  { id: 2, name: '2F', location: 'Kyoto' },
];

const bentoData = [
  { id: 1, name: 'Bento 1', price: 500 },
];

const employeeData = [
  { id: 1, name: 'Employee 1', workplace_id: 1 },
  { id: 2, name: 'Employee 2', workplace_id: 1 },
  { id: 3, name: 'Employee 3', workplace_id: 2 },
];

const reservationData = [
  { id: 1, employee_id: 1, reservation_date: '2023-05-25', bento_id: 1, quantity: 1 },
  { id: 2, employee_id: 2, reservation_date: '2023-05-26', bento_id: 1, quantity: 1 },
  { id: 3, employee_id: 3, reservation_date: '2023-05-25', bento_id: 1, quantity: 1 },
  { id: 3, employee_id: 3, reservation_date: '2023-06-25', bento_id: 1, quantity: 1 },
];

// API function implementations
const getWorkplaces = () => {
  return new Promise<Workplace[]>((resolve) =>
    setTimeout(() => resolve(workplaceData), 1000)
  );
};

const getBento = () => {
  return new Promise<Bento[]>((resolve) =>
    setTimeout(() => resolve(bentoData), 1000)
  );
};

const getEmployees = () => {
  return new Promise<Employee[]>((resolve) =>
    setTimeout(() => resolve(employeeData), 1000)
  );
};

const getReservations = () => {
  return new Promise<Reservation[]>((resolve) =>
    setTimeout(() => resolve(reservationData), 1000)
  );
};

export default function AdminReserveWorkplacePage() {
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [bento, setBento] = useState<Bento[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    (async () => {
      const fetchedWorkplaces = await getWorkplaces();
      setWorkplaces(fetchedWorkplaces);

      const fetchedReservations = await getReservations();
      setReservations(fetchedReservations);

      const fetchedEmployees = await getEmployees();
      setEmployees(fetchedEmployees);

      const fetchedBento = await getBento();
      setBento(fetchedBento);
    })();
  }, []);

  
  //月の選択用関数
  const selectMonth = (month: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + month);
    setCurrentMonth(newMonth);
  };


  const rows = workplaces.map((workplace) => {
    const today = new Date();
    const workplaceEmployees = employees.filter(
      (employee) => employee.workplace_id === workplace.id
    );
    const workplaceReservations = reservations.filter((reservation) =>
      workplaceEmployees.some((employee) => employee.id === reservation.employee_id)
    );
    
    const todayReservations = workplaceReservations.filter(
      (reservation) =>
        new Date(reservation.reservation_date).toDateString() === today.toDateString()
    );
    const monthReservations = workplaceReservations.filter(
      (reservation) =>
        new Date(reservation.reservation_date).getMonth() === currentMonth.getMonth()
    );

    //日と月の合計予約数と合計金額を計算
    const todayTotalOrder = todayReservations.reduce((prev, curr) => prev + curr.quantity, 0);
    const monthTotalOrder = monthReservations.reduce((prev, curr) => prev + curr.quantity, 0);
    const todayTotalAmount = todayReservations.reduce(
      (prev, curr) =>
        prev +
        curr.quantity * (bento.find((b) => b.id === curr.bento_id)?.price || 0),
      0
    );

    const monthTotalAmount = monthReservations.reduce(
      (prev, curr) =>
        prev +
        curr.quantity * (bento.find((b) => b.id === curr.bento_id)?.price || 0),
      0
    );

    return {
      id: workplace.id,
      workplace: workplace.name,
      todayTotalOrder,
      monthTotalOrder,
      todayTotalAmount,
      monthTotalAmount,
    };
  });

  const columns = [
    { field: 'workplace', headerName: '勤務場所', width: 200 },
    { field: 'todayTotalOrder', headerName: '本日の予約数', type: 'number', width: 150 },
    { field: 'monthTotalOrder', headerName: '選択月の予約数', type: 'number', width: 150 },
    { field: 'todayTotalAmount', headerName: '本日合計金額', type: 'number', width: 150 },
    { field: 'monthTotalAmount', headerName: '選択月合計金額', type: 'number', width: 150 },
  ];

  const dateFormat = new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: 'long' });
  const formattedMonth = dateFormat.format(currentMonth);

  return (
    <Box display="flex" flexDirection="column"　justifyContent="center" alignItems="center" height="100vh">
      <Box display="flex" alignItems="center" mb={2}>
        <button onClick={() => selectMonth(-1)}>&lt;</button>
        <h2>{formattedMonth}</h2>
        <button onClick={() => selectMonth(1)}>&gt;</button>
      </Box>
      <div style={{ height: 400 }} >
        <DataGrid rows={rows} columns={columns}  />
      </div>
    </Box>
  );
};
