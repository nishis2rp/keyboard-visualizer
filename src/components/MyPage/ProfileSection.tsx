import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

interface ProfileSectionProps {
  displayName: string;
  setDisplayName: (name: string) => void;
  avatarFile: File | null;
  handleAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAvatarUpload: () => Promise<void>;
  handleDisplayNameUpdate: (e: React.FormEvent) => Promise<void>;
  uploading: boolean;
  profileUpdateLoading: boolean;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  displayName,
  setDisplayName,
  avatarFile,
  handleAvatarChange,
  handleAvatarUpload,
  handleDisplayNameUpdate,
  uploading,
  profileUpdateLoading,
}) => {
  const { t } = useLanguage();
  const { user, profile, updateProfile } = useAuth();
  
  const [bio, setBio] = useState('');
  const [goal, setGoal] = useState('');
  const [isEditingExtra, setIsEditingExtra] = useState(false);
  const [extraUpdateLoading, setExtraUpdateLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setGoal(profile.goal || '');
    }
  }, [profile]);

  const handleExtraUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setExtraUpdateLoading(true);
    await updateProfile({ bio, goal });
    setExtraUpdateLoading(false);
    setIsEditingExtra(false);
  };

  if (!user) return null;

  const hasChanges = bio !== (profile?.bio || '') || goal !== (profile?.goal || '');

  return (
    <section className="bg-white rounded-apple-xl p-8 shadow-apple-md border border-gray-100 transition-all hover:shadow-apple-lg">
      <h2 className="text-lg font-bold text-sf-primary mb-6 flex items-center gap-2 tracking-tight border-b border-gray-100 pb-2">
        {t.myPage.profileTitle}
      </h2>
      
      {/* Avatar & Display Name */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-20 h-20 shrink-0">
          <img
            src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || user.email || '')}&background=667eea&color=fff&size=80`}
            alt={t.myPage.avatarAlt}
            className="w-20 h-20 rounded-full object-cover border-2 border-sf-blue-ultralight"
          />
          <div className="absolute bottom-0 right-0 bg-sf-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] cursor-pointer border-2 border-white shadow-sm">
            <label htmlFor="avatarInput" className="cursor-pointer">{t.myPage.edit}</label>
            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <form onSubmit={handleDisplayNameUpdate} className="flex items-center gap-1">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="apple-input py-1.5"
              placeholder={t.myPage.displayNamePlaceholder}
            />
            {displayName !== profile?.display_name && (
              <button 
                type="submit" 
                disabled={profileUpdateLoading} 
                className="w-6 h-6 bg-sf-green text-white rounded flex items-center justify-center shrink-0 disabled:opacity-50"
              >
                {profileUpdateLoading ? '...' : '✓'}
              </button>
            )}
          </form>
          <p className="text-[11px] text-sf-gray m-0 mt-1 truncate font-medium">{user.email}</p>
        </div>
      </div>
      
      {avatarFile && (
        <div className="bg-sf-blue-ultralight p-3 rounded-apple-md text-center mb-6">
          <p className="text-[10px] text-sf-blue font-bold truncate mb-2">{avatarFile.name}</p>
          <button
            onClick={handleAvatarUpload}
            disabled={uploading}
            className="w-full py-1.5 bg-sf-blue text-white rounded-apple-sm text-xs font-bold disabled:opacity-50"
          >
            {uploading ? t.myPage.uploading : t.myPage.uploadConfirm}
          </button>
        </div>
      )}

      {/* Bio & Goal */}
      <form onSubmit={handleExtraUpdate} className="space-y-4 pt-4 border-t border-gray-50">
        <div>
          <label className="apple-label">{t.myPage.bioLabel}</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="apple-input min-h-[80px] py-2 resize-none"
            placeholder={t.myPage.bioPlaceholder}
          />
        </div>
        <div>
          <label className="apple-label">{t.myPage.goalLabel}</label>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="apple-input py-2"
            placeholder={t.myPage.goalPlaceholder}
          />
        </div>
        
        {hasChanges && (
          <button
            type="submit"
            disabled={extraUpdateLoading}
            className="w-full py-2 bg-sf-primary text-white rounded-apple-md text-sm font-bold transition-all hover:bg-black disabled:opacity-50 active:scale-95"
          >
            {extraUpdateLoading ? '...' : t.common.save}
          </button>
        )}
      </form>
    </section>
  );
};

export default ProfileSection;
