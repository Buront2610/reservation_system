import {DataGrid, GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { UseAuth } from "./authContext";
import { Reservation, Employee, Bento, Workplace } from "./types";

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function TestAdminReservationPage() {
//   const { user } = UseAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [bento, setBento] = useState<Bento[]>([]);
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);

  useEffect(() => {
    // Dummy data
    const dummyReservations: Reservation[] = [
      { id: 1, employee_id: 1, reservation_date: '2023-05-25', bento_id: 1, quantity: 2,  },
      { id: 2, employee_id: 2, reservation_date: '2023-05-26', bento_id: 1, quantity: 3,  },
      { id: 3, employee_id: 3, reservation_date: '2023-05-27', bento_id: 1, quantity: 1, },
      // more dummy data...
    ];
    const dummyEmployees: Employee[] = [
      { id: 1, name: 'John Doe', workplace_id: 1 },
      { id: 2, name: 'Jane Doe', workplace_id: 2 },
      { id: 3, name: 'Jim Doe', workplace_id: 3 },
      // more dummy data...
    ];
    const dummyBento: Bento[] = [
      { id: 1, name: 'Bento A', price: 500 },
    ];
    const dummyWorkplaces: Workplace[] = [
      { id: 1, name: 'Office A', location: 'Tokyo' },
      { id: 2, name: 'Office B', location: 'Osaka' },
      { id: 3, name: 'Office C', location: 'Fukuoka' },
      // more dummy data...
    ];

    setReservations(dummyReservations);
    setEmployees(dummyEmployees);
    setBento(dummyBento);
    setWorkplaces(dummyWorkplaces);
  }, []);

//   if (!user || user.role !== "admin") {
//     return <div>Unauthorized</div>;
//   }

  // DataGrid用のカラム定義
  const columns = [
    { field: "date", headerName: "日付", width: 130 },
    { field: "user", headerName: "ユーザー", width: 130 },
    { field: "location", headerName: "場所", width: 130 },
    { field: "bentoName", headerName: "弁当名", width: 130 },
    { field: "quantity", headerName: "注文数", width: 130 },
  ];

  // DataGrid用のデータ整形
  const rows = reservations.map((reservation, index) => {
    const employee = employees.find(emp => emp.id === reservation.employee_id);
    const workplace = workplaces.find(w => w.id === employee?.workplace_id);
    const bentoItem = bento.find(b => b.id === reservation.bento_id);

    return {
      id: index,
      date: reservation.reservation_date,
      user: employee?.name,
      location: workplace?.location,
      bentoName: bentoItem?.name,
      quantity: reservation.quantity
    };
  });

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{
          toolbar: CustomToolbar,
        }}
      />
    </div>
  );
}
