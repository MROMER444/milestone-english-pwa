import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './SplashScreen.css';

function SplashScreen() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="splash-screen">
      {/* Animated background circles */}
      <div className="bg-circle circle-1"></div>
      <div className="bg-circle circle-2"></div>
      <div className="bg-circle circle-3"></div>
      
      <div className="splash-content">
        {/* Logo section */}
        <div className="logo-section">
          <div className="logo-container">
            <div className="logo-glow"></div>
            <img 
              src="/MilestoneLogo.jpeg" 
              alt="Milestone Logo" 
              className="splash-logo"
            />
          </div>
        </div>
        
        {/* Text section */}
        <div className="text-section">
          <h1 className="main-title">
            Let's start the journey of learning English
          </h1>
        </div>

        {/* CTA Button */}
        <button 
          className="btn-primary"
          onClick={handleGetStarted}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default SplashScreen;
