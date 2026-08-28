import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markNotificationRead } from '../features/notifications/notificationSlice';

function NotificationBell() {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.notifications);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications());
    const interval = setInterval(() => {
      dispatch(fetchNotifications());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const unreadCount = list.filter((n) => !n.read).length;

  const handleClick = (notification) => {
    if (!notification.read) {
      dispatch(markNotificationRead(notification._id));
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-10 max-h-96 overflow-y-auto">
          <div className="p-3 border-b font-semibold">Notifications</div>
          {list.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">No notifications yet.</p>
          ) : (
            list.map((n) => (
              <div
                key={n._id}
                onClick={() => handleClick(n)}
                className={`p-3 border-b text-sm cursor-pointer hover:bg-gray-50 ${
                  n.read ? 'text-gray-500' : 'font-medium'
                }`}
              >
                {n.message}
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;