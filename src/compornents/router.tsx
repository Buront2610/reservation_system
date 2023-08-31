import React,{ReactElement, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate} from 'react-router-dom';
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

const ConditionalNavigation = () => {
  const { isInitialSetup, updateInitialSetupState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the initial setup state
    checkInitialSetup(updateInitialSetupState);

    // Navigate based on the initial setup state
    if (isInitialSetup === false) {
      navigate('/setup_admin');
    }
  }, [isInitialSetup]);

  return null;
};

function RouterComponent() {
  const { user, isInitialSetup} = useAuth(); // Added isInitialSetup, assuming it is provided by UseAuth



  console.log("isInitialSetup: " + isInitialSetup);


  return (
    <Router>
        <ConditionalNavigation/>

        <Routes>
          <Route path="/login" element={isInitialSetup ? <Navigate to="/setup_admin"/>: <Login/>} 
          />
          <Route 
            path="/setup_admin" 
            element={isInitialSetup ? <AdminSetup /> : <Navigate to="/login" />} 
          />

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
    </Router>
  );
}

export default RouterComponent;

