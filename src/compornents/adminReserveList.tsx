import {DataGrid, GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { UseAuth } from "./authContext";
import { getReservations, getEmployees, getBento, getWorkplaces } from "./API";
import { Reservation, Employee, Bento, Workplace } from "./types";

function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

export default function AdminReservationPage() {
  const { user } = UseAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [bento, setBento] = useState<Bento[]>([]);
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);

  useEffect(() => {
    async function fetchData() {
      // Reservation, Employee, Bento, Workplaceデータの取得
      const fetchedReservations = await getReservations();
      const fetchedEmployees = await getEmployees();
      const fetchedBento = await getBento();
      const fetchedWorkplaces = await getWorkplaces();

      setReservations(fetchedReservations);
      setEmployees(fetchedEmployees);
      setBento(fetchedBento);
      setWorkplaces(fetchedWorkplaces);
    }
    
    fetchData();
  }, []);

  if (!user || user.role !== "admin") {
    return <div>Unauthorized</div>;
  }

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
            //pageSize={5}
            slots={{
            toolbar: CustomToolbar,
            }}
        />
    </div>
  );
}
