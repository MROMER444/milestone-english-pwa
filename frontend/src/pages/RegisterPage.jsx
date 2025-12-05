import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  HiEnvelope, 
  HiLockClosed, 
  HiUser, 
  HiArrowRight,
  HiIdentification,
  HiEye,
  HiEyeSlash
} from 'react-icons/hi2';
import './Auth.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    full_name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData.email, formData.password, formData.username, formData.full_name);
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
            <h1 className="branding-title">Join Milestone!</h1>
            <p className="branding-subtitle">Start your English learning journey today</p>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="auth-form-section">
          <div className="auth-card">
            <div className="auth-header">
              <h2 className="auth-title">Create Account</h2>
              <p className="auth-subtitle">Fill in your details to get started</p>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  <HiUser className="input-icon" />
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength={3}
                  placeholder="johndoe"
                  className="form-input"
                />
                <small className="form-hint">At least 3 characters</small>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <HiEnvelope className="input-icon" />
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="full_name" className="form-label">
                  <HiIdentification className="input-icon" />
                  Full Name <span className="optional">(Optional)</span>
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
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
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    placeholder="Create a strong password"
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
                <small className="form-hint">Must be at least 8 characters</small>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                <span>{loading ? 'Creating account...' : 'Sign Up'}</span>
                {!loading && <HiArrowRight className="btn-icon" />}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
