import React, {FC, Dispatch, SetStateAction} from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { Box } from '@mui/material';
import Login  from './login'
import { UseAuth } from './authContext';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import TestReservationPage from './testUserReserve';
import TestReservationHistoryPage from './testUserReserveInfo';
import TestAdminReservationPage from './testAdminReserveList';
import TestAdminReservationStatsPage from './testAdminReserveStats';
import TestUserSideMenu from './testSideMenu';
import TestAdminManage from './testAdminManage';
import TestAdminOrderSummaryPage from './testAdminReserveStatus';
import AdminTimeLock from './adminTimeLock';
import AdminReserveEdit from './adminReserveEdit';
import AdminBentoAndWorkplaceManagePage from './adminBentoAndWorkplaceEdit';
import AdminExcludeDaysEditPage from './adminCalenderEdit';
import ReservationPage from './userReservationPage';

interface setStateProps{
    setStateProp: object;
}

function Placeholder() {
    return <div>Please log in.</div>;
}

function routerCompornent() {
    const { user } = UseAuth();
  
    let SideMenu = Placeholder;
    // if (user) {
    //     SideMenu = user.role === 'admin' ? AdminSideMenu : UserSideMenu;
    // }
  
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<TestUserSideMenu />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/reservation" element={<TestReservationHistoryPage />} />
                    <Route path="/orderWorkPlaceSummary" element={<TestAdminReservationStatsPage />} />
                    <Route path="/adminUserEdit" element={<TestAdminManage />} />
                    <Route path='/orderUserSummary' element={<TestAdminOrderSummaryPage />}/>
                    <Route path='/adminReservationEdit' element={<AdminReserveEdit />} />
                    <Route path='/adminBentoAndWorkplaceEdit' element={<AdminBentoAndWorkplaceManagePage />} />
                    <Route path='/lock' element={<AdminTimeLock />} />
                    <Route path='/adminCalendarEdit' element={<AdminExcludeDaysEditPage />} />
                    <Route path='/userReservation' element={<ReservationPage />} />
                </Route>
                {/* {user && (
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
            )} */}
            </Routes>
        </BrowserRouter>
    );
}
    
export default routerCompornent;  