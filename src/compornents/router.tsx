import React, {FC, Dispatch, SetStateAction} from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { Box } from '@mui/material';
import Login  from './login'
import { UseAuth } from './authContext';
import  AdminSideMenu from './adminSideMenu';
import  UserSideMenu from './userSideMenu';
import ReservationPage from './userReserve';
import ReservationInfoPage from './userReserveInfo';
import EmployeeReservationListPage from './adminReserveList';
import ReservationStatsPage from './adminReserveStats';
import EmployeeManagePage from './adminManage';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import TestReservationPage from './testUserReserve';
import TestReservationHistoryPage from './testUserReserveInfo';
import TestAdminReservationPage from './testAdminReserveList';
import TestAdminReservationStatsPage from './testAdminReserveStats';
import TestUserSideMenu from './testSideMenu';
import TestAdminManage from './testAdminManage';

interface setStateProps{
    setStateProp: object;
}

function Placeholder() {
    return <div>Please log in.</div>;
}

function routerCompornent() {
    const { user } = UseAuth();
  
    let SideMenu = Placeholder;
    if (user) {
        SideMenu = user.role === 'admin' ? AdminSideMenu : UserSideMenu;
    }
  
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<TestUserSideMenu />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/test" element={<ReservationPage />} />
                    <Route path="/test2" element={<ReservationInfoPage />} />
                    <Route path="/test3" element={<TestReservationPage />} />
                    <Route path="/test4" element={<TestReservationHistoryPage />} />
                    <Route path="/test5" element={<TestAdminReservationPage />} />
                    <Route path="/test6" element={<TestAdminReservationStatsPage />} />
                    <Route path="/test7" element={<TestAdminManage />} />
                </Route>
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