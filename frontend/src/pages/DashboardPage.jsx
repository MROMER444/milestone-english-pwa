import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../utils/api';
import { 
  HiSparkles, 
  HiChartBar, 
  HiFire, 
  HiGift,
  HiBookOpen,
  HiTrophy,
  HiArrowRight
} from 'react-icons/hi2';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [progressRes, gamificationRes] = await Promise.all([
        api.get('/progress/stats'),
        api.get('/gamification/stats')
      ]);
      setStats({
        progress: progressRes.data,
        gamification: gamificationRes.data
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  const gamification = stats?.gamification || {};

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome back, {user?.username || 'Learner'}!</h2>
        <p className="dashboard-subtitle">Continue your English learning journey</p>
      </div>

      {/* Gamification Stats */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <HiSparkles />
          </div>
          <div className="stat-content">
            <div className="stat-value">{gamification.totalXP || 0}</div>
            <div className="stat-label">Total XP</div>
          </div>
        </div>

        <div className="stat-card accent">
          <div className="stat-icon">
            <HiChartBar />
          </div>
          <div className="stat-content">
            <div className="stat-value">Level {gamification.level || 1}</div>
            <div className="stat-label">Current Level</div>
            {gamification.xpForNextLevel && (
              <div className="stat-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(gamification.levelProgress || 0) * 100}%` }}
                  />
                </div>
                <small>{gamification.xpInLevel || 0} / {gamification.xpForNextLevel} XP</small>
              </div>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <HiFire />
          </div>
          <div className="stat-content">
            <div className="stat-value">{gamification.currentStreak || 0}</div>
            <div className="stat-label">Day Streak</div>
            {gamification.longestStreak > 0 && (
              <small>Best: {gamification.longestStreak} days</small>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <HiGift />
          </div>
          <div className="stat-content">
            <div className="stat-value">{user?.gems || 0}</div>
            <div className="stat-label">Gems</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <button
            className="action-card primary-action"
            onClick={() => navigate('/practice')}
          >
            <HiBookOpen className="action-icon" />
            <span className="action-label">Start Practice</span>
            <HiArrowRight className="action-arrow" />
          </button>

          <button
            className="action-card"
            onClick={() => navigate('/leaderboard')}
          >
            <HiTrophy className="action-icon" />
            <span className="action-label">Leaderboard</span>
            <HiArrowRight className="action-arrow" />
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      {stats?.progress && (
        <div className="progress-section">
          <h3>Your Progress</h3>
          <div className="progress-cards">
            {stats.progress.byLevel && stats.progress.byLevel.length > 0 && (
              <div className="progress-card">
                <h4>By Level</h4>
                <div className="progress-list">
                  {stats.progress.byLevel.map((item) => (
                    <div key={item.level} className="progress-item">
                      <span className="progress-level">{item.level}</span>
                      <div className="progress-details">
                        <span>{item.correct || 0} / {item.answered || 0} correct</span>
                        <div className="progress-bar-small">
                          <div
                            className="progress-fill-small"
                            style={{
                              width: `${item.answered > 0 ? ((item.correct / item.answered) * 100) : 0}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stats.progress.byTopic && stats.progress.byTopic.length > 0 && (
              <div className="progress-card">
                <h4>By Topic</h4>
                <div className="progress-list">
                  {stats.progress.byTopic.map((item) => (
                    <div key={item.topic} className="progress-item">
                      <span className="progress-topic">{item.topic}</span>
                      <div className="progress-details">
                        <span>{item.correct || 0} / {item.answered || 0} correct</span>
                        <div className="progress-bar-small">
                          <div
                            className="progress-fill-small"
                            style={{
                              width: `${item.answered > 0 ? ((item.correct / item.answered) * 100) : 0}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
