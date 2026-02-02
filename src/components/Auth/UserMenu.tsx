import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom'; // Import Link
import './UserMenu.css';

const UserMenu: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'ユーザー';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    console.log('🔴 Logout button clicked');
    try {
      console.log('🔴 Calling signOut()...');
      await signOut();
      console.log('🔴 signOut() completed successfully');
      setIsOpen(false);

      // Wait a bit for the auth state change to propagate, then reload
      console.log('🔴 Waiting before reload...');
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('🔴 Reloading page...');
      window.location.reload();
    } catch (error) {
      console.error('🔴 Error signing out:', error);
      alert('ログアウトに失敗しました。もう一度お試しください。');
    }
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="user-avatar" />
        ) : (
          <div className="user-avatar-placeholder">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <div className="user-menu-name">{displayName}</div>
            <div className="user-menu-email">{user?.email}</div>
          </div>

          <div className="user-menu-divider"></div>

          <Link to="/mypage" className="user-menu-item" onClick={() => setIsOpen(false)}>
            <svg
              className="user-menu-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            マイページ
          </Link>

          <button className="user-menu-item" onClick={handleSignOut}>
            <svg
              className="user-menu-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
