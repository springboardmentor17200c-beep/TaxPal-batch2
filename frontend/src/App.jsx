// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import TaxCalculator from "./pages/TaxCalculator";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/tax" 
          element={
            <ProtectedRoute>
              <TaxCalculator />
            </ProtectedRoute>
          } 
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;