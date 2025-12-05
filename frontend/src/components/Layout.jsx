import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  HiHome, 
  HiBookOpen, 
  HiTrophy, 
  HiUser,
  HiSparkles,
  HiFire,
  HiArrowRightOnRectangle
} from 'react-icons/hi2';
import './Layout.css';

const Layout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HiHome },
    { path: '/practice', label: 'Practice', icon: HiBookOpen },
    { path: '/leaderboard', label: 'Leaderboard', icon: HiTrophy },
    { path: '/profile', label: 'Profile', icon: HiUser }
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <div className="logo-container-header">
            <img 
              src="/MilestoneLogo.jpeg" 
              alt="Milestone Logo" 
              className="header-logo"
            />
            <h1 className="logo">Milestone English</h1>
          </div>
          <div className="header-right">
            {user && (
              <>
                <span className="user-info">
                  <span className="xp-badge">
                    <HiSparkles className="icon-small" />
                    {user.total_xp || 0} XP
                  </span>
                  <span className="level-badge">Level {user.level_number || 1}</span>
                  {user.current_streak > 0 && (
                    <span className="streak-badge">
                      <HiFire className="icon-small" />
                      {user.current_streak}
                    </span>
                  )}
                </span>
                <button onClick={logout} className="btn-logout">
                  <HiArrowRightOnRectangle className="icon-small" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <IconComponent className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
