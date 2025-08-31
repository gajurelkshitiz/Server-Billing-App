import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  BellRing, 
  Check, 
  Settings, 
  User, 
  Calendar, 
  AlertCircle, 
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (_id: string) => void;
  onMarkAllAsRead: () => void;
  showPast?: boolean;
  onShowPast?: () => void;
  onHidePast?: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  showPast,
  onShowPast,
  onHidePast
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;
  const navigate = useNavigate();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'warning':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'error':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onMarkAsRead(notification._id);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative transition-all duration-200 hover:bg-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="relative">
            {unreadCount > 0 ? (
              <BellRing size={18} className="text-blue-600" />
            ) : (
              <Bell size={18} className="text-gray-600" />
            )}
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs animate-pulse"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 p-0 bg-white border border-gray-200 shadow-lg rounded-lg"
        sideOffset={5}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <BellRing size={18} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell size={38} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-500 font-medium">No notifications</p>
              <p className="text-xs text-gray-400">You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div key={notification._id}>
                <DropdownMenuItem 
                  className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${
                    !notification.read 
                      ? 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className={`text-sm font-medium ${
                        !notification.read ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-1 ml-2">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <p className={`text-xs mt-1 ${
                      !notification.read ? 'text-gray-600' : 'text-gray-500'
                    }`}>
                      {notification.message}
                    </p>
                    
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </DropdownMenuItem>
                
                {index < notifications.length - 1 && (
                  <DropdownMenuSeparator className="my-0" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer: Show/Hide Past Notifications */}
        {notifications.length > 0 && (
          <div className="border-t border-gray-100 p-3 flex flex-col gap-2">
            {typeof showPast !== 'undefined' && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-center text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                onClick={() => {
                  if (showPast && onHidePast) onHidePast();
                  else if (!showPast && onShowPast) onShowPast();
                }}
              >
                {showPast ? 'Hide Past Notifications' : 'Show Past Notifications'}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-center text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              onClick={() => {
                setIsOpen(false);
                navigate('/notifications');
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;