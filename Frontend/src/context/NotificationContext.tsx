import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getAuthHeaders } from '@/utils/auth';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  readStatus: boolean;
  actionable?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadNotifications: Notification[];
  pastNotifications: Notification[];
  addNotification: (notification: { title: string; message: string; type?: string; }) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Split notifications for UI
  const unreadNotifications = notifications.filter(n => !n.readStatus);
  const pastNotifications = notifications.filter(n => n.readStatus);

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${import.meta.env.REACT_APP_API_URL}/notifications`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (data.notifications) setNotifications(data.notifications);
      } catch (err) {
        // handle error
      }
    };
    fetchNotifications();
  }, []);

  // Add notification (send to backend)
  const addNotification = useCallback(async (notification: { title: string; message: string; type?: string; recipientID: string; recipientModel: string }) => {
    await fetch(`${import.meta.env.REACT_APP_API_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(notification),
    });
    // Optionally refetch
  }, []);

  // Mark as read
  const markAsRead = useCallback(async (id: string) => {
    await fetch(`${import.meta.env.REACT_APP_API_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, readStatus: true } : n));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    await fetch(`${import.meta.env.REACT_APP_API_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
    });
    setNotifications(prev => prev.map(n => ({ ...n, readStatus: true })));
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadNotifications,
      pastNotifications,
      addNotification,
      markAsRead,
      markAllAsRead,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};