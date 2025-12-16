import React, { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Clock, FileText, Trash2, Check } from 'lucide-react';

export function Notifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Claim Approved',
      message: 'Your claim #CLM-2024-8543 has been approved. Payment will be processed within 24-48 hours.',
      claimId: 'CLM-2024-8543',
      time: '2 hours ago',
      read: false,
    },
    {
      id: 2,
      type: 'info',
      title: 'Document Uploaded',
      message: 'Your document for claim #CLM-2024-8721 has been successfully uploaded and is being reviewed.',
      claimId: 'CLM-2024-8721',
      time: '5 hours ago',
      read: false,
    },
    {
      id: 3,
      type: 'warning',
      title: 'Additional Information Required',
      message: 'Please provide additional documentation for claim #CLM-2024-8650 to continue processing.',
      claimId: 'CLM-2024-8650',
      time: '1 day ago',
      read: true,
    },
    {
      id: 4,
      type: 'info',
      title: 'Claim Status Update',
      message: 'Your claim #CLM-2024-8721 is now under review by our claims specialist team.',
      claimId: 'CLM-2024-8721',
      time: '2 days ago',
      read: true,
    },
    {
      id: 5,
      type: 'success',
      title: 'Payment Processed',
      message: 'Payment of $8,400 for claim #CLM-2024-8543 has been processed and will arrive in 2-3 business days.',
      claimId: 'CLM-2024-8543',
      time: '3 days ago',
      read: true,
    },
    {
      id: 6,
      type: 'info',
      title: 'Claim Submitted',
      message: 'Your claim #CLM-2024-8721 has been successfully submitted and assigned to a reviewer.',
      claimId: 'CLM-2024-8721',
      time: '5 days ago',
      read: true,
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-success" />;
      case 'warning':
        return <AlertCircle size={20} className="text-warning" />;
      case 'info':
        return <FileText size={20} className="text-primary" />;
      default:
        return <Bell size={20} className="text-muted-foreground" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-success/10 border-success/20';
      case 'warning':
        return 'bg-warning/10 border-warning/20';
      case 'info':
        return 'bg-primary/10 border-primary/20';
      default:
        return 'bg-muted/10 border-border';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
              {unreadCount} new
            </span>
          )}
        </div>
        <p className="text-muted-foreground">Stay updated on your claims and account activity</p>
      </div>

      {/* Actions Bar */}
      <div className="bg-card border border-border rounded-xl p-4 mb-6 shadow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'unread'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <Check size={18} />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-card border rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all ${
              !notification.read ? getBgColor(notification.type) : 'border-border'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="shrink-0 mt-1">{getIcon(notification.type)}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className={`text-foreground ${!notification.read ? 'font-semibold' : ''}`}>
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2"></div>
                  )}
                </div>

                <p className="text-muted-foreground mb-3">{notification.message}</p>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={14} />
                      {notification.time}
                    </div>
                    {notification.claimId && (
                      <button className="text-sm text-primary hover:underline">
                        View Claim {notification.claimId}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Check size={18} className="text-muted-foreground" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 size={18} className="text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="bg-card border border-border rounded-xl p-12 text-center shadow-card">
            <div className="bg-muted/50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Bell size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-foreground mb-2">No Notifications</h3>
            <p className="text-muted-foreground">
              {filter === 'unread'
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."}
            </p>
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="bg-card border border-border rounded-xl p-6 mt-8 shadow-card">
        <h3 className="text-foreground mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground mb-1">Claim Status Updates</p>
              <p className="text-sm text-muted-foreground">Get notified when your claim status changes</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground mb-1">Payment Notifications</p>
              <p className="text-sm text-muted-foreground">Get notified about payment processing</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-foreground mb-1">Document Requests</p>
              <p className="text-sm text-muted-foreground">Get notified when additional documents are needed</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
