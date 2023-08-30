import React,{ReactElement} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import { useAuth } from './authContext';
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
import { checkInitialSetup } from './API';
import AdminSetup from './adminSetup';


interface PrivateRouteProps {
  element: ReactElement;
  path: string;
}

function PrivateRoute({ element, ...rest }: PrivateRouteProps) {
  const { isInitialSetup } = useAuth();
  return (
    <Route
      {...rest}
      element={isInitialSetup ? element : <Navigate to="/setup_admin" />}
    />
  );
}


function RouterComponent() {
  checkInitialSetup()

  const { user, isInitialSetup } = useAuth(); // Added isInitialSetup, assuming it is provided by UseAuth

  console.log("isInitialSetup: " + isInitialSetup);


  return (
    <Router>
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <PrivateRoute path="/setup_admin" element={<AdminSetup />} />
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

