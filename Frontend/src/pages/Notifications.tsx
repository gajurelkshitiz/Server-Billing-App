import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PAGE_SIZE = 5;

const NotificationsPage: React.FC = () => {
  const { notifications, unreadNotifications, markAsRead, markAllAsRead } = useNotifications();
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const [displayed, setDisplayed] = useState<any[]>([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loader = useRef<HTMLDivElement>(null);

  // for debug purpose: 
  console.log('All notification from Notification Context API : ', notifications);
  console.log("Unread notifications from the Context API : ", unreadNotifications);

  // Infinite scroll fetch
  const fetchMore = useCallback(() => {
    let source = tab === 'all' ? notifications : unreadNotifications;
    const next = source.slice(skip, skip + PAGE_SIZE);
    
    if (next.length > 0) {
      setDisplayed(prev => [...prev, ...next]);
      setSkip(prev => prev + PAGE_SIZE);
    }
    
    setHasMore(skip + PAGE_SIZE < source.length);
  }, [tab, notifications, unreadNotifications, skip]);

  // Reset displayed items when tab changes
  useEffect(() => {
    console.log('Tab changed to:', tab);
    setDisplayed([]);
    setSkip(0);
    setHasMore(true);
  }, [tab]);

  // Initial fetch when tab changes or data updates
  useEffect(() => {
    console.log('Fetching initial data for tab:', tab);
    const source = tab === 'all' ? notifications : unreadNotifications;
    
    if (source.length > 0) {
      const initial = source.slice(0, PAGE_SIZE);
      setDisplayed(initial);
      setSkip(PAGE_SIZE);
      setHasMore(PAGE_SIZE < source.length);
    } else {
      setDisplayed([]);
      setSkip(0);
      setHasMore(false);
    }
  }, [tab, notifications, unreadNotifications]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!hasMore || displayed.length === 0) return;
    
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        console.log('Loading more...');
        fetchMore();
      }
    });
    
    if (loader.current) observer.observe(loader.current);
    
    return () => {
      if (loader.current) observer.unobserve(loader.current);
    };
  }, [fetchMore, hasMore, displayed.length]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex gap-4 mb-4">
        <Button variant={tab === 'all' ? 'default' : 'outline'} onClick={() => setTab('all')}>
          All <Badge className="ml-2">{notifications.length}</Badge>
        </Button>
        <Button variant={tab === 'unread' ? 'default' : 'outline'} onClick={() => setTab('unread')}>
          Unread <Badge className="ml-2">{unreadNotifications.length}</Badge>
        </Button>
        {tab === 'unread' && unreadNotifications.length > 0 && (
          <Button variant="ghost" onClick={markAllAsRead} className="ml-auto text-blue-600">
            Mark all as read
          </Button>
        )}
      </div>
      
      <div>
        {displayed.length > 0 ? (
          displayed.map(n => (
            <div
              key={n._id}
              className={`p-4 mb-2 rounded border ${n.readStatus ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}
              onClick={() => !n.readStatus && markAsRead(n._id)}
              style={{ cursor: !n.readStatus ? 'pointer' : 'default' }}
            >
              <div className="flex justify-between items-center">
                <div className="font-semibold">{n.title}</div>
                <span className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
              <div className="text-sm text-gray-700">{n.message}</div>
              {!n.readStatus && <span className="inline-block mt-1 w-2 h-2 bg-blue-500 rounded-full" />}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 mt-8">
            {tab === 'unread' ? 'No unread notifications.' : 'No notifications.'}
          </div>
        )}
        
        {hasMore && displayed.length > 0 && (
          <div ref={loader} className="h-8 flex items-center justify-center text-gray-400">
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;