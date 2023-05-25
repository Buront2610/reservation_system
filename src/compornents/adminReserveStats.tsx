import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getWorkplaces, getReservations, getEmployees, getBento } from './API';
import { Workplace, Reservation, Employee, Bento } from './types';

export default function AdminReserveWorkplacePage(){
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [bento, setBento] = useState<Bento[]>([]);

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

  const rows = workplaces.map((workplace) => {
    const workplaceEmployees = employees.filter(
      (employee) => employee.workplace_id === workplace.id
    );
    const workplaceReservations = reservations.filter((reservation) =>
      workplaceEmployees.some((employee) => employee.id === reservation.employee_id)
    );

    const totalOrder = workplaceReservations.reduce(
      (prev, curr) => prev + curr.quantity,
      0
    );
    const totalAmount = workplaceReservations.reduce(
      (prev, curr) =>
        prev +
        curr.quantity * (bento.find((b) => b.id === curr.bento_id)?.price || 0),
      0
    );

    return {
      id: workplace.id,
      workplace: workplace.name,
      totalOrder,
      totalAmount,
    };
  });

  const columns = [
    { field: 'workplace', headerName: 'Workplace', width: 200 },
    { field: 'totalOrder', headerName: 'Total Order', type: 'number', width: 150 },
    { field: 'totalAmount', headerName: 'Total Amount', type: 'number', width: 150 },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns}  />
    </div>
  );
};
