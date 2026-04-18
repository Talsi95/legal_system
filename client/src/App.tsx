import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import LawyerDashboard from './pages/LawyerDashboard';
import ClientDashboard from './pages/ClientDashboard';
import CaseDetails from './pages/CaseDetails';

const PrivateRoute = ({ children, role }: { children: React.ReactNode, role?: string }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>טוען...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-right" dir="rtl">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/lawyer" element={
              <PrivateRoute role="lawyer"><LawyerDashboard /></PrivateRoute>
            } />

            <Route path="/lawyer/case/:id" element={
              <PrivateRoute role="lawyer"><CaseDetails /></PrivateRoute>
            } />

            <Route path="/client" element={
              <PrivateRoute role="client"><ClientDashboard /></PrivateRoute>
            } />

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;