import React from 'react';
import { AuthProvider } from './compornents/authContext';
import RouterComponent from './compornents/router';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <RouterComponent />
    </AuthProvider>
  );
}

export default App;