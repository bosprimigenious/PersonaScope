import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './UserAvatar.css';

export default function UserAvatar() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const defaultAvatar = '👤';
  const userAvatar = user?.avatar || user?.name?.charAt(0) || defaultAvatar;

  const handleAvatarClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="user-avatar-container">
      <div 
        className={`avatar-wrapper ${isLoggedIn ? 'logged-in' : ''}`}
        onClick={handleAvatarClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAvatarClick();
          }
        }}
      >
        <div className="avatar-circle">
          {isLoggedIn ? (
            userAvatar.length === 1 && !user?.avatar?.startsWith('http') ? (
              <span className="avatar-text">{userAvatar}</span>
            ) : (
              <img src={userAvatar} alt={user?.name || '用户'} className="avatar-image" />
            )
          ) : (
            <span className="avatar-text default">{defaultAvatar}</span>
          )}
        </div>
      </div>
      {isLoggedIn && (
        <div className="user-info">
          <span className="user-name">{user?.name || '用户'}</span>
        </div>
      )}
    </div>
  );
}
