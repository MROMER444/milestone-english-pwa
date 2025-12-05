import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { HiTrophy, HiFire, HiSparkles } from 'react-icons/hi2';
import './LeaderboardPage.css';

const LeaderboardPage = () => {
  const { user } = useAuthStore();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [period, setPeriod] = useState('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/gamification/leaderboard', {
        params: { period }
      });
      setLeaderboard(response.data.leaderboard || []);
      setUserRank(response.data.userRank);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <HiTrophy className="rank-icon gold" />;
    if (rank === 2) return <HiTrophy className="rank-icon silver" />;
    if (rank === 3) return <HiTrophy className="rank-icon bronze" />;
    return <span className="rank-number">#{rank}</span>;
  };

  if (loading) {
    return <div className="leaderboard-loading">Loading leaderboard...</div>;
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <h2>Leaderboard</h2>
        <div className="period-selector">
          <button
            className={period === 'daily' ? 'active' : ''}
            onClick={() => setPeriod('daily')}
          >
            Daily
          </button>
          <button
            className={period === 'weekly' ? 'active' : ''}
            onClick={() => setPeriod('weekly')}
          >
            Weekly
          </button>
          <button
            className={period === 'monthly' ? 'active' : ''}
            onClick={() => setPeriod('monthly')}
          >
            Monthly
          </button>
          <button
            className={period === 'all_time' ? 'active' : ''}
            onClick={() => setPeriod('all_time')}
          >
            All Time
          </button>
        </div>
      </div>

      {userRank && (
        <div className="user-rank-card">
          <h3>Your Rank</h3>
          <div className="user-rank-value">
            {getRankIcon(userRank)}
            <span>{userRank}</span>
          </div>
          <div className="user-rank-details">
            <span>
              <HiSparkles className="icon-inline" />
              {user?.total_xp || 0} XP
            </span>
            <span>Level {user?.level_number || 1}</span>
          </div>
        </div>
      )}

      <div className="leaderboard-list">
        {leaderboard.length === 0 ? (
          <div className="empty-leaderboard">No rankings yet. Be the first!</div>
        ) : (
          leaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className={`leaderboard-item ${entry.id === user?.id ? 'current-user' : ''} ${index < 3 ? 'top-three' : ''}`}
            >
              <div className="rank">{getRankIcon(entry.rank)}</div>
              <div className="user-info">
                <div className="username">{entry.username}</div>
                <div className="user-stats">
                  <span>Level {entry.level_number}</span>
                  {entry.current_streak > 0 && (
                    <span className="streak">
                      <HiFire className="icon-inline" />
                      {entry.current_streak}
                    </span>
                  )}
                </div>
              </div>
              <div className="xp-value">{entry.total_xp.toLocaleString()} XP</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
