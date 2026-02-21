import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Bookmark, RichShortcut } from '../types';

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarkedShortcuts, setBookmarkedShortcuts] = useState<RichShortcut[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookmarks = useCallback(async () => {
    if (!user) {
      setBookmarks([]);
      setBookmarkedShortcuts([]);
      return;
    }

    setLoading(true);
    try {
      // ブックマーク一覧を取得
      const { data: bookmarkData, error: bookmarkError } = await supabase
        .from('user_bookmarks')
        .select('*')
        .eq('user_id', user.id);

      if (bookmarkError) throw bookmarkError;
      setBookmarks(bookmarkData || []);

      if (bookmarkData && bookmarkData.length > 0) {
        // ブックマークされたショートカットの実体を取得
        const shortcutIds = bookmarkData.map(b => b.shortcut_id);
        const { data: shortcutData, error: shortcutError } = await supabase
          .from('shortcuts')
          .select('*')
          .in('id', shortcutIds);

        if (shortcutError) throw shortcutError;
        setBookmarkedShortcuts(shortcutData || []);
      } else {
        setBookmarkedShortcuts([]);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const toggleBookmark = async (shortcutId: number) => {
    if (!user) return;

    const existingBookmark = bookmarks.find(b => b.shortcut_id === shortcutId);

    try {
      if (existingBookmark) {
        // 削除
        const { error } = await supabase
          .from('user_bookmarks')
          .delete()
          .eq('id', existingBookmark.id);

        if (error) throw error;
        setBookmarks(prev => prev.filter(b => b.id !== existingBookmark.id));
        setBookmarkedShortcuts(prev => prev.filter(s => s.id !== shortcutId));
      } else {
        // 追加
        const { data, error } = await supabase
          .from('user_bookmarks')
          .insert([{ user_id: user.id, shortcut_id: shortcutId }])
          .select()
          .single();

        if (error) throw error;
        setBookmarks(prev => [...prev, data]);
        
        // 追加したショートカットの詳細を取得して反映
        const { data: shortcut } = await supabase
          .from('shortcuts')
          .select('*')
          .eq('id', shortcutId)
          .single();
        
        if (shortcut) {
          setBookmarkedShortcuts(prev => [...prev, shortcut]);
        }
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const isBookmarked = (shortcutId: number) => {
    return bookmarks.some(b => b.shortcut_id === shortcutId);
  };

  return {
    bookmarks,
    bookmarkedShortcuts,
    loading,
    toggleBookmark,
    isBookmarked,
    refreshBookmarks: fetchBookmarks
  };
}
