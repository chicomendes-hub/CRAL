import { useState } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Polls from '@/pages/Polls';
import Events from '@/pages/Events';
import Bookings from '@/pages/Bookings';
import Members from '@/pages/Members';
import Fees from '@/pages/Fees';
import Notifications from '@/pages/Notifications';
import Groups from '@/pages/Groups';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userTelegramId, setUserTelegramId] = useState(null);

  const handleLogin = (telegramId) => {
    setUserTelegramId(telegramId);
    setIsAuthenticated(true);
  };

  return (
    <div className="App">
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/" /> : 
              <Login onLogin={handleLogin} />
            } 
          />
          <Route
            path="/"
            element={
              isAuthenticated ? 
              <Dashboard userTelegramId={userTelegramId} /> : 
              <Navigate to="/login" />
            }
          />
          <Route
            path="/polls"
            element={
              isAuthenticated ? 
              <Polls userTelegramId={userTelegramId} /> : 
              <Navigate to="/login" />
            }
          />
          <Route
            path="/events"
            element={
              isAuthenticated ? 
              <Events userTelegramId={userTelegramId} /> : 
              <Navigate to="/login" />
            }
          />
          <Route
            path="/bookings"
            element={
              isAuthenticated ? 
              <Bookings userTelegramId={userTelegramId} /> : 
              <Navigate to="/login" />
            }
          />
          <Route
            path="/members"
            element={
              isAuthenticated ? 
              <Members userTelegramId={userTelegramId} /> : 
              <Navigate to="/login" />
            }
          />
          <Route
            path="/fees"
            element={
              isAuthenticated ? 
              <Fees userTelegramId={userTelegramId} /> : 
              <Navigate to="/login" />
            }
          />
          <Route
            path="/notifications"
            element={
              isAuthenticated ? 
              <Notifications userTelegramId={userTelegramId} /> : 
              <Navigate to="/login" />
            }
          />
          <Route
            path="/groups"
            element={
              isAuthenticated ? 
              <Groups userTelegramId={userTelegramId} /> : 
              <Navigate to="/login" />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
