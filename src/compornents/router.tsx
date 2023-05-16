import React, {FC, Dispatch, SetStateAction} from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { Box } from '@mui/material';
import ResponsiveDrawer from './sideMenu'
import Login  from './login'
import { useAuth } from './authContext';
import  AdminSideMenu from './adminSideMenu';
import  UserSideMenu from './userSideMenu';
import ReservationPage from './userReserve';
import ReservationInfoPage from './userReserveInfo';
import EmployeeReservationListPage from './adminReserveList';
import ReservationStatsPage from './adminReserveStats';
import EmployeeManagePage from './adminManage';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

interface setStateProps{
    setStateProp: object;
}

function Placeholder() {
    return <div>Please log in.</div>;
}

function routerCompornent() {
    const { user } = useAuth();
  
    let SideMenu = Placeholder;
    if (user) {
      SideMenu = user.role === 'admin' ? AdminSideMenu : UserSideMenu;
    }
  
    return (
        <BrowserRouter>
            <Routes>
            <Route path="/" element={<Login />} />
            {user && (
                <>
                <Route path="/user/*" element={<SideMenu />}>
                    <Route path="/reservation" element={<ReservationPage />} />
                    <Route path="/info" element={<ReservationInfoPage />} />
                </Route>
                {user.role === 'admin' && (
                    <Route path="/admin/*" element={<SideMenu />}>
                        <Route path="/list" element={<EmployeeReservationListPage />} />
                        <Route path="/stats" element={<ReservationStatsPage />} />
                        <Route path="/manage" element={<EmployeeManagePage />} />
                    </Route>
                )}
                </>
            )}
            </Routes>
        </BrowserRouter>
    );
}
    
export default routerCompornent;  