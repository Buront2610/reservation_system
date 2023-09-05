import React,{ReactElement, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate} from 'react-router-dom';
import { useAuth } from './authContext';
import { AuthProvider } from './authContext';
import { checkInitialSetup } from './API';
import * as Pages from './pages'

interface PrivateRouteProps {
  element: ReactElement;
  path: string;
}

const ConditionalNavigation = () => {
  const { user,isInitialSetup, updateInitialSetupState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the initial setup state
    checkInitialSetup(updateInitialSetupState);

    // Navigate based on the initial setup state
    if (isInitialSetup === false && !user)  {
      navigate('/setup_admin');
    }
  }, [isInitialSetup]);

  return null;
};

//各ページのルーティング
//管理者かユーザかを判別して、それぞれのページに飛ばす
function RouterComponent() {
  const { user, isInitialSetup} = useAuth(); // Added isInitialSetup, assuming it is provided by UseAuth
  console.log("isInitialSetup: " + isInitialSetup);


  return (
    <Router>
        <ConditionalNavigation/>

        <Routes>
          {!user ? (         
            <>
              <Route path="/login" element={isInitialSetup ? <Navigate to="/setup_admin"/>: <Pages.Login/>} 
              />
              <Route 
                path="/setup_admin" 
                element={isInitialSetup ? <Pages.AdminSetup /> : <Navigate to="/login" />} 
              />
            </> 
            ):(
            user.role === 'admin' ? (
                <Route path="/" element={<Pages.AdminSideMenu />}>
                    <Route path="/adminReservationList" element={<Pages.TestAdminReservationPage />} />
                    <Route path="/adminReservationStats" element={<Pages.TestAdminReservationStatsPage />} />
                    <Route path="/adminUserEdit" element={<Pages.TestAdminManage />} />
                    <Route path="/orderUserSummary" element={<Pages.TestAdminOrderSummaryPage />} />
                    <Route path="/orderWorkplaceSummary" element={<Pages.AdminReserveWorkplacePage/>} />
                    <Route path="/adminReservationEdit" element={<Pages.AdminReservationManage />} />
                    <Route path="/adminBentoAndWorkplaceEdit" element={<Pages.AdminBentoAndWorkplaceManagePage />} />
                    <Route path="/lock" element={<Pages.AdminTimeLock />} />
                    <Route path="/adminCalendarEdit" element={<Pages.AdminExcludeDaysEditPage />} />
                </Route>
            ) : (
                  <Route path="/" element={<Pages.UserSideMenu />}>
                    <Route path="/userReservation" element={<Pages.ReservationPage />} />
                    <Route path="/userReserveHistory" element={<Pages.TestReservationHistoryPage />} />
                </Route>
            ))}
            <Route path="/*" element={<Pages.Login />} />
        </Routes>
    </Router>
  );
}

export default RouterComponent;

