import React, { useEffect, useContext } from 'react'; // Added useContext
import { AuthProvider, UseAuth } from './compornents/authContext'; // Fixed typo in folder name and imported UseAuth
import RouterComponent from './compornents/router'; // Fixed typo in folder name
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5555/api';


const App: React.FC = () => {
  const { updateInitialSetupState } = UseAuth(); // Get the updateInitialSetupState function from the AuthContext

  useEffect(() => {
    const checkInitialSetup = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/check_initial_setup`);
        
        // Update the initial setup state based on API response
        if (response.data.initialSetupRequired) {
          updateInitialSetupState(true); // Use the function from the AuthContext
          // Optionally, you can redirect to the admin setup page here.
        } else {
          updateInitialSetupState(false); // Use the function from the AuthContext
        }
      } catch (error) {
        console.error('Failed to check initial setup:', error);
      }
    };
    
    checkInitialSetup();
  }, [updateInitialSetupState]); // Added updateInitialSetupState to dependency array
  
  return (
    <AuthProvider>
      <RouterComponent />
    </AuthProvider>
  );
}

export default App;
