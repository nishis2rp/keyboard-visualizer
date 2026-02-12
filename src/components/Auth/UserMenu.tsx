import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom'; // Import Link

const UserMenu: React.FC = () => {
  const { t } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = profile?.display_name || user?.email?.split('@')[0] || t.auth.defaultUserName;
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
      alert(t.auth.signOutError);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center justify-center p-0.5 border-2 border-transparent hover:border-sf-blue rounded-full transition-all bg-white shadow-sm overflow-hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName} className="w-8 h-8 object-cover rounded-full" />
        ) : (
          <div className="w-8 h-8 bg-sf-blue text-white flex items-center justify-center text-sm font-black rounded-full">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="apple-dropdown">
          <div className="px-4 py-2 border-b border-gray-50 mb-1">
            <div className="text-sm font-black text-sf-primary truncate">{displayName}</div>
            <div className="text-[10px] text-sf-gray font-bold truncate">{user?.email}</div>
          </div>

          <Link to="/mypage" className="apple-dropdown-item" onClick={() => setIsOpen(false)}>
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            {t.auth.myPage}
          </Link>

          <button className="apple-dropdown-item w-full" onClick={handleSignOut}>
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {t.auth.signOut}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
