import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { HiEnvelope, HiLockClosed, HiArrowRight, HiEye, HiEyeSlash } from 'react-icons/hi2';
import './Auth.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Error handled by store
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left side - Branding */}
        <div className="auth-branding">
          <div className="branding-content">
            <div className="logo-wrapper-auth">
              <img 
                src="/MilestoneLogo.jpeg" 
                alt="Milestone Logo" 
                className="auth-logo"
              />
            </div>
            <h1 className="branding-title">Welcome Back!</h1>
            <p className="branding-subtitle">Continue your English learning journey</p>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="auth-form-section">
          <div className="auth-card">
            <div className="auth-header">
              <h2 className="auth-title">Sign In</h2>
              <p className="auth-subtitle">Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <HiEnvelope className="input-icon" />
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <HiLockClosed className="input-icon" />
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <HiEyeSlash className="eye-icon" />
                    ) : (
                      <HiEye className="eye-icon" />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                {!loading && <HiArrowRight className="btn-icon" />}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
