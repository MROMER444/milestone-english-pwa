import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ children }) => {
  const { user, initialize } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        await initialize();
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        if (mounted) {
          setIsInitialized(true);
        }
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array - only run once

  if (!isInitialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: '#F8F4E2'
      }}>
        <div style={{ color: '#6B645A' }}>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
