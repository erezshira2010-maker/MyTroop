import type { NotificationItem } from '../types';

interface NotificationsModalProps {
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onClearAll: () => void;
  onMarkAsRead: (id: string) => void;
}

/**
 * פאנל התראות (Notification Panel)
 * מציג התראות אמיתיות על פעולות קרובות, תזכורות ועדכוני מערכת
 */
export default function NotificationsModal({
  notifications,
  isOpen,
  onClose,
  onClearAll,
  onMarkAsRead,
}: NotificationsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/40 backdrop-blur-xs p-3 sm:p-4"
      dir="rtl"
    >
      <div className="bg-[#F6F3EB] w-full max-w-md mt-14 sm:mt-0 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        {/* כותרת החלון וכפתור סגירה */}
        <div className="p-4 bg-white border-b border-[#E2DACB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-full bg-[#eee1cc] flex items-center justify-center text-[#705b3b]">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </span>
            <div>
              <h2 className="text-headline-sm font-bold text-on-surface">התראות ותזכורות</h2>
              <span className="text-[11px] text-secondary">
                {notifications.length > 0 ? `${notifications.length} התראות במערכת` : 'מעודכן'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-[12px] text-secondary hover:text-red-700 font-semibold px-2 py-1 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                נקה הכל
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="סגירה"
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-high text-secondary cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* רשימת ההתראות */}
        <div className="p-4 overflow-y-auto max-h-[60vh] flex flex-col gap-2.5">
          {notifications.length === 0 ? (
            /* מצב ריק לפי דרישות האפיון המדויקות */
            <div className="py-12 flex flex-col items-center justify-center text-center text-secondary gap-2">
              <span className="w-14 h-14 rounded-full bg-[#DCE3D3]/60 flex items-center justify-center text-[#715b3e]">
                <span className="material-symbols-outlined text-[28px]">notifications_off</span>
              </span>
              <p className="text-base font-bold text-on-surface mt-1">אין התראות חדשות</p>
              <p className="text-body-sm text-secondary max-w-xs">
                כל המשימות והפעולות בקבוצה מעודכנות. תזכורות חדשות יופיעו כאן.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onMarkAsRead(notif.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                  notif.read
                    ? 'bg-white/70 border-[#E2DACB]/50 opacity-80'
                    : 'bg-white border-[#8B7355]/30 shadow-xs ring-1 ring-[#8B7355]/10'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.type === 'activity'
                      ? 'bg-[#eee1cc] text-[#8B7355]'
                      : notif.type === 'reminder'
                      ? 'bg-[#DCE3D3] text-[#715b3e]'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {notif.type === 'activity'
                      ? 'campaign'
                      : notif.type === 'reminder'
                      ? 'event_available'
                      : 'info'}
                  </span>
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-body-md font-bold text-on-surface truncate">{notif.title}</h4>
                    <span className="text-[11px] text-secondary shrink-0">{notif.date}</span>
                  </div>
                  <p className="text-body-sm text-secondary mt-0.5 leading-relaxed">{notif.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
