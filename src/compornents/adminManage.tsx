import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getReservations, getEmployees, getBento } from './API';
import { Reservation, Employee, Bento } from './types';

const UserPage: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [bento, setBento] = useState<Bento[]>([]);

  useEffect(() => {
    (async () => {
      const fetchedReservations = await getReservations();
      setReservations(fetchedReservations);

      const fetchedEmployees = await getEmployees();
      setEmployees(fetchedEmployees);

      const fetchedBento = await getBento();
      setBento(fetchedBento);
    })();
  }, []);

  const columns = [
    { field: 'employee', headerName: 'Employee', width: 150 },
    ...[...Array(12)].map((_, i) => ({
      field: `month-${i + 1}`,
      headerName: `${i + 1} Month`,
      width: 150,
      valueGetter: (params: any) => {
        const employeeReservations = params.row.reservations.filter(
          (r: Reservation) =>
            new Date(r.reservation_date).getMonth() === i
        );
        const totalOrder = employeeReservations.reduce(
          (prev:number, curr:Reservation) => prev + curr.quantity,
          0
        );
        const totalAmount = employeeReservations.reduce(
          (prev:number, curr:Reservation) =>
            prev +
            curr.quantity * (bento.find((b) => b.id === curr.bento_id)?.price || 0),
          0
        );
        return `${totalOrder} orders / ${totalAmount} yen`;
      },
    })),
  ];

  const rows = employees.map((employee) => ({
    id: employee.id,
    employee: employee.name,
    reservations: reservations.filter((r) => r.employee_id === employee.id),
  }));

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns}  />
    </div>
  );
};

export default UserPage;
