import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import { UseAuth } from './authContext';
import TestReservationPage from './testUserReserve';
import TestReservationHistoryPage from './testUserReserveInfo';
import TestAdminReservationPage from './testAdminReserveList';
import TestAdminReservationStatsPage from './testAdminReserveStats';
import TestAdminManage from './testAdminManage';
import TestAdminOrderSummaryPage from './testAdminReserveStatus';
import AdminTimeLock from './adminTimeLock';
import AdminReserveEdit from './adminReserveEdit';
import AdminReserveWorkplacePage from './testAdminReserveStats';
import AdminBentoAndWorkplaceManagePage from './adminBentoAndWorkplaceEdit';
import AdminExcludeDaysEditPage from './adminCalenderEdit';
import ReservationPage from './userReservationPage';
import UserSideMenu from './userSideMenu';
import AdminSideMenu from './adminSideMenu';
import Login from './login';
import { AuthProvider } from './authContext';
import AdminReservationManage from './adminReserveEdit';

function RouterComponent() {
  const { user, isInitialSetup } = UseAuth(); // Added isInitialSetup, assuming it is provided by UseAuth

  // Redirect to admin setup page if initial setup is required
  if (isInitialSetup) {
    return <Navigate to="/setup_admin" />;
  }


  return (
    <Router>
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                {user ? (
                user.role === 'admin' ? (
                    <Route path="/" element={<AdminSideMenu />}>
                        <Route path="/adminReservationList" element={<TestAdminReservationPage />} />
                        <Route path="/adminReservationStats" element={<TestAdminReservationStatsPage />} />
                        <Route path="/adminUserEdit" element={<TestAdminManage />} />
                        <Route path="/orderUserSummary" element={<TestAdminOrderSummaryPage />} />
                        <Route path="/orderWorkplaceSummary" element={<AdminReserveWorkplacePage/>} />
                        <Route path="/adminReservationEdit" element={<AdminReservationManage />} />
                        <Route path="/adminBentoAndWorkplaceEdit" element={<AdminBentoAndWorkplaceManagePage />} />
                        <Route path="/lock" element={<AdminTimeLock />} />
                        <Route path="/adminCalendarEdit" element={<AdminExcludeDaysEditPage />} />
                    </Route>
                ) : (
                        <Route path="/" element={<UserSideMenu />}>
                        <Route path="/userReservation" element={<ReservationPage />} />
                        <Route path="/userReserveHistory" element={<TestReservationHistoryPage />} />
                    </Route>
                )
                ) : (
                <Route path="/*" element={<Login />} />
                )}
            </Routes>
        </AuthProvider>
    </Router>
  );
}

export default RouterComponent;

