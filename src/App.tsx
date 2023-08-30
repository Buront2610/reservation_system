import React, { useEffect, useContext } from 'react'; // Added useContext
import { AuthProvider, useAuth } from './compornents/authContext'; // Fixed typo in folder name and imported UseAuth
import RouterComponent from './compornents/router'; // Fixed typo in folder name
import axios from 'axios';



const App: React.FC = () => {

  return (
    <AuthProvider>
      <RouterComponent />
    </AuthProvider>
  );
}

export default App;
