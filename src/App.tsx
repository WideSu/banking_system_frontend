import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Transactions from './pages/Transactions';
import History from './pages/History';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';

function App() {
  // Checks if the app is running in development mode
  // Note: import.meta.env.DEV is read-only and automatically set by Vite (true in dev, false in prod)
  // We use VITE_BYPASS_AUTH from .env to control this behavior manually if needed
  const isBypassAuth = import.meta.env.VITE_BYPASS_AUTH === 'true'; 
  const authStatus = useAuthStore((state) => state.isAuthenticated);
  
  // Automatically bypass if enabled in env, otherwise use real auth state
  const isAuthenticated = isBypassAuth ? true : authStatus;

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        
        {/* If ProtectedRoute also checks the store, you may need to pass the bypass flag to it */}
        <Route element={<ProtectedRoute bypass={isBypassAuth} />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
