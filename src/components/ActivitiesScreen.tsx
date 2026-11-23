import { useState, useMemo } from 'react';
import type { Activity, ScoutMember, UserProfile, NotificationItem } from '../types';
import {
  formatActivityDateTime,
  getUpcomingActivities,
  getCompletedActivities,
} from '../services/storage';
import ProfileModal from './ProfileModal';
import NotificationsModal from './NotificationsModal';
import MyTroopLogo from './MyTroopLogo';

interface ActivitiesScreenProps {
  activities: Activity[];
  members: ScoutMember[];
  user: UserProfile;
  notifications?: NotificationItem[];
  onViewPlan: (act: Activity) => void;
  onEditActivity: (act: Activity) => void;
  onAddActivity: (act: Activity) => void;
  onDeleteActivity: (id: string) => void;
  onUpdateAttendance: (
    actId: string,
    attendedCount: number,
    totalExpected: number,
    presentMemberIds?: string[],
    absentMemberIds?: string[]
  ) => void;
  onBackToDashboard: () => void;
  onSaveProfile?: (updated: UserProfile) => void;
  onLogout?: () => void;
}

type TabType = 'upcoming' | 'past' | 'all';

/**
 * קומפוננטת "הפעולות שלי" (MyTroop – My Activities Screen)
 * שחזור מדויק של קובץ my activities.html עם תמיכה מלאה בריבוי פעולות,
 * גלילה חופשית, ניהול נוכחות חי בזמן אמת, יצירת פעולה חדשה ומחיקה מאובטחת.
 */
export default function ActivitiesScreen({
  activities,
  members,
  user,
  notifications = [],
  onViewPlan,
  onEditActivity,
  onAddActivity,
  onDeleteActivity,
  onUpdateAttendance,
  onBackToDashboard,
  onSaveProfile,
  onLogout,
}: ActivitiesScreenProps) {
  // לשונית סינון נוכחית: פעולות קרובות / פעולות קודמות / כל הפעולות
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  // מודאלים
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteConfirmAct, setDeleteConfirmAct] = useState<Activity | null>(null);
  const [liveAttendanceAct, setLiveAttendanceAct] = useState<Activity | null>(null);
  const [attendedMap, setAttendedMap] = useState<Record<string, boolean>>({});
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // הודעת טוסט צפה בדיוק כמו בקובץ my activities.html
  const [toastMessage, setToastMessage] = useState<string>('');

  // שדות טופס יצירת פעולה חדשה
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newStartTime, setNewStartTime] = useState('16:30');
  const [newEndTime, setNewEndTime] = useState('18:00');
  const [newLocation, setNewLocation] = useState('רחבת התורן, שבט אופק');
  const [newCategory, setNewCategory] = useState('ערכים ומנהיגות');
  const [newCategoryIcon, setNewCategoryIcon] = useState('flag');
  const [newGoals, setNewGoals] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newEquipment, setNewEquipment] = useState('');
  const [newInstructions, setNewInstructions] = useState('');
  const [formError, setFormError] = useState('');

  // סינון ומיון פעולות באמצעות פונקציות העזר המרכזיות (סנכרון מלא עם מסך הבית)
  const upcomingList = useMemo(() => getUpcomingActivities(activities), [activities]);
  const pastList = useMemo(() => getCompletedActivities(activities), [activities]);

  // כל הפעולות
  const allList = useMemo(() => {
    return [...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activities]);

  // זיהוי הפעולה הבאה בלו״ז (הקרובה ביותר בזמן)
  const nextUpcomingId = upcomingList[0]?.id;

  // הרשימה המוצגת בהתאם ללשונית הנבחרת
  const displayedActivities = useMemo(() => {
    if (activeTab === 'upcoming') return upcomingList;
    if (activeTab === 'past') return pastList;
    return allList;
  }, [activeTab, upcomingList, pastList, allList]);

  // פונקציית עזר להצגת טוסט הצלחה
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  // פתיחת מודאל רישום נוכחות לפעולה
  const handleOpenAttendance = (act: Activity) => {
    setLiveAttendanceAct(act);
    const initialPresence: Record<string, boolean> = {};
    if (act.presentMemberIds && act.presentMemberIds.length > 0) {
      members.forEach((m) => {
        initialPresence[m.id] = act.presentMemberIds!.includes(m.id);
      });
    } else if (act.attendedCount !== undefined) {
      members.forEach((m, idx) => {
        initialPresence[m.id] = idx < act.attendedCount!;
      });
    } else {
      members.forEach((m) => {
        initialPresence[m.id] = (m.attendanceRate ?? 90) >= 80;
      });
    }
    setAttendedMap(initialPresence);
  };

  // סימון כל החניכים כנוכחים (markAllPresent מתוך my activities.html)
  const markAllMembersPresent = () => {
    const allPresent: Record<string, boolean> = {};
    members.forEach((m) => {
      allPresent[m.id] = true;
    });
    setAttendedMap(allPresent);
  };

  // שמירת הנוכחות וסנכרון מלא עם הפעולות, החניכים ודף הבית
  const handleSaveAttendance = () => {
    if (!liveAttendanceAct) return;
    const presentIds = members.filter((m) => attendedMap[m.id]).map((m) => m.id);
    const absentIds = members.filter((m) => !attendedMap[m.id]).map((m) => m.id);
    onUpdateAttendance(liveAttendanceAct.id, presentIds.length, members.length, presentIds, absentIds);
    setLiveAttendanceAct(null);
    triggerToast('הנוכחות נשמרה בהצלחה! נתוני הפעולה הקודמת וממוצע הנוכחות עודכנו ⚜️');
  };

  // שליחת טופס יצירת פעולה חדשה
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newTitle.trim() || newTitle.trim().length < 3) {
      setFormError('יש להזין כותרת פעולה תקינה (לפחות 3 תווים)');
      return;
    }
    if (!newDate) {
      setFormError('יש לבחור תאריך לפעולה');
      return;
    }

    const [hours, minutes] = (newStartTime || '16:30').split(':');
    const d = new Date(newDate);
    d.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    const goalsArray = newGoals
      .split('\n')
      .map((g) => g.trim())
      .filter(Boolean);

    const stepsArray = newInstructions
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((desc, idx) => ({
        title: `שלב ${idx + 1}`,
        duration: '20 דקות',
        description: desc,
      }));

    const created: Activity = {
      id: `act-${Date.now()}`,
      title: newTitle.trim(),
      date: d.toISOString(),
      location: newLocation.trim() || 'שבט אופק',
      category: newCategory,
      categoryIcon: newCategoryIcon,
      equipment: newEquipment.trim() || 'לא נדרש ציוד מיוחד',
      description: newDescription.trim() || newTitle.trim(),
      goals: goalsArray.length > 0 ? goalsArray : ['גיבוש הקבוצה והעברת ערכים'],
      steps:
        stepsArray.length > 0
          ? stepsArray
          : [
              { title: 'מעגל פתיחה', duration: '15 דקות', description: 'סבב פתיחה קבוצתי ומוראל' },
              { title: 'מהלך מרכזי', duration: '45 דקות', description: 'הפעלת הפעולה בצוותים' },
              { title: 'מסדר סיום', duration: '15 דקות', description: 'שיחת משוב ופיזור' },
            ],
      status: 'scheduled',
    };

    onAddActivity(created);
    setIsCreateOpen(false);
    triggerToast(`הפעולה "${created.title}" נוצרה בהצלחה! ⚜️`);

    // איפוס שדות
    setNewTitle('');
    setNewDate('');
    setNewEquipment('');
    setNewDescription('');
    setNewGoals('');
    setNewInstructions('');
  };

  // מחיקת פעולה לאחר אישור
  const handleConfirmDelete = () => {
    if (!deleteConfirmAct) return;
    onDeleteActivity(deleteConfirmAct.id);
    setDeleteConfirmAct(null);
    triggerToast('הפעולה נמחקה מהמערכת.');
  };

  // חישוב מוני נוכחות פעילים במודאל הנוכחות
  const presentCount = Object.values(attendedMap).filter(Boolean).length;
  const totalScouts = members.length || 24;
  const attendancePercentage = Math.round((presentCount / totalScouts) * 100);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-[#F6F3EB] text-[#1c1c17] font-body-md text-body-md flex flex-col min-h-screen">
      {/* 1. Header עליון זהה למסכי MyTroop הקודמים */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#F6F3EB]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(110,103,84,0.08)] pt-safe">
        <div className="h-16 px-gutter flex items-center justify-between max-w-lg mx-auto w-full">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-space-sm cursor-pointer group border-none bg-transparent"
          >
            <div className="relative flex items-center justify-center">
              <MyTroopLogo className="w-8 h-8 rounded-xl shadow-xs transition-transform group-hover:scale-105" />
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
              MyTroop
            </span>
          </button>

          <div className="flex items-center gap-space-xs">
            <button
              onClick={() => setIsNotificationsOpen(true)}
              aria-label="התראות"
              className="relative w-11 h-11 flex items-center justify-center rounded-full text-[#6E6754] hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 left-2 w-2.5 h-2.5 bg-[#8B7355] rounded-full ring-2 ring-[#F6F3EB] animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setIsProfileOpen(true)}
              aria-label="פרופיל"
              className="w-11 h-11 flex items-center justify-center rounded-full cursor-pointer group"
            >
              <img
                alt={user.fullName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#7A6548]/30 group-hover:ring-[#7A6548] transition-all"
                src={
                  user.avatarUrl ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBOocxAeW088iNI7lMsO5LU3rhluu_Gs0z6k35ya3IAux6C7HwjZl7ovwWEkyG--uodsO3OWoyMm7fTsL0a9R0iiTPjE0RMhFiQtpIdvNEh8QegZh1oYvftMCwk5VGrVUvp9Qjq1woKWRXGj43P_2O7xmsLcThaftjJ1FZyLOpkUnRpqqYpVnPEX859CJGnXgUeTGvvnoHgcwFMtGxz3ILclBRgkCqjoKuhVqQgdTlAmIyEVqAfk_Jm'
                }
              />
            </button>
          </div>
        </div>
      </header>

      {/* 2. הודעת טוסט מתוך my activities.html (Toast Notification) */}
      {toastMessage && (
        <div className="fixed top-20 inset-x-gutter z-50 flex items-center justify-between bg-[#31312b] text-[#f3f1e9] px-space-md py-space-sm rounded-xl shadow-xl max-w-lg mx-auto animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-[#dfc29f] text-[22px]">check_circle</span>
            <span className="font-body-sm text-body-sm font-semibold">{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage('')}
            className="p-1 text-[#d1c4b9] hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* 3. Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full px-gutter pt-16 pb-28 bg-[#F6F3EB] max-w-lg mx-auto">
        <div className="flex flex-col w-full pb-6 space-y-space-md" dir="rtl">
          {/* Screen Header & Main Action */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                הפעולות שלי
              </h1>
              <p className="font-body-sm text-body-sm text-secondary">
                {user.gdud || 'גדוד אלון'} • שכבת {user.layerName?.split('-')[0]?.trim() || 'ח׳'} •{' '}
                {user.shevetName}
              </p>
            </div>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-1.5 bg-[#8B7355] text-white font-label-lg text-label-lg px-space-md py-2.5 rounded-full shadow-md active:scale-95 transition-transform hover:bg-[#7A6548] cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>פעולה חדשה</span>
            </button>
          </div>

          {/* Filter Segment Tabs מתוך my activities.html */}
          <div className="flex p-1 bg-[#EBE8E0] rounded-xl gap-1 shadow-xs">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-2 text-center rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                activeTab === 'upcoming'
                  ? 'font-bold bg-white text-on-surface shadow-sm'
                  : 'text-[#6E6754] hover:text-on-surface'
              }`}
              type="button"
            >
              פעולות קרובות ({upcomingList.length})
            </button>

            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-2 text-center rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                activeTab === 'past'
                  ? 'font-bold bg-white text-on-surface shadow-sm'
                  : 'text-[#6E6754] hover:text-on-surface'
              }`}
              type="button"
            >
              פעולות קודמות ({pastList.length})
            </button>

            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 text-center rounded-lg font-label-md text-label-md transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'font-bold bg-white text-on-surface shadow-sm'
                  : 'text-[#6E6754] hover:text-on-surface'
              }`}
              type="button"
            >
              כל הפעולות ({allList.length})
            </button>
          </div>

          {/* רשימת כרטיסי פעולות מרובות בגלילה אנכית - ריווח מעט מוגדל ומאוזן מעל הכרטיס הראשון */}
          <div className="flex flex-col gap-3.5 mt-2.5 sm:mt-3">
            {displayedActivities.length === 0 ? (
              /* מצב ריק (Empty State) עם הודעה ידידותית בעברית */
              <div className="bg-white rounded-2xl p-8 text-center border border-[#E5E2DA]/80 shadow-xs flex flex-col items-center gap-2.5 mt-2">
                <span className="w-12 h-12 rounded-full bg-[#eee1cc] flex items-center justify-center text-[#705b3b]">
                  <span className="material-symbols-outlined text-[26px]">event_busy</span>
                </span>
                <h3 className="font-bold text-base text-on-surface">
                  {activeTab === 'upcoming'
                    ? 'אין פעולות קרובות מתוכננות'
                    : activeTab === 'past'
                    ? 'עדיין אין פעולות קודמות'
                    : 'עדיין לא יצרת פעולות'}
                </h3>
                <p className="text-body-sm text-secondary max-w-xs">
                  {activeTab === 'upcoming'
                    ? 'זה הזמן לתכנן פעולה חדשה לקבוצה שלך או לבחור רעיון מבנק הרעיונות!'
                    : 'פעולות שהסתיימו יוצגו כאן עם תיעוד הנוכחות המלא.'}
                </p>
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="mt-2 py-2 px-5 rounded-full bg-[#8B7355] text-white font-bold text-sm cursor-pointer shadow-xs active:scale-95 transition-all"
                >
                  יצירת פעולה חדשה
                </button>
              </div>
            ) : (
              displayedActivities.map((act) => {
                const isNextUpcoming = act.id === nextUpcomingId && activeTab !== 'past';
                const isCompleted = act.status === 'completed';

                return (
                  <article
                    key={act.id}
                    className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-md border border-[#E5E2DA]/60 hover:border-[#8B7355]/40 transition-all"
                  >
                    {/* Header Card: תגית סטטוס, כותרת ואייקון קטגוריה */}
                    <div className="flex items-start justify-between gap-space-sm">
                      <div className="space-y-1 min-w-0 flex-1">
                        {isNextUpcoming ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEE1CC] text-[#574637] font-label-sm text-label-sm font-semibold">
                            <span className="material-symbols-outlined text-[14px]">event_upcoming</span>
                            <span>הפעולה הבאה בלו״ז</span>
                          </div>
                        ) : isCompleted ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DCE3D3] text-[#304638] font-label-sm text-label-sm font-semibold">
                            <span className="material-symbols-outlined text-[14px]">task_alt</span>
                            <span>פעולה שהסתיימה</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEE1CC]/80 text-[#574637] font-label-sm text-label-sm font-semibold">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            <span>פעולה קרובה</span>
                          </div>
                        )}

                        <h2 className="font-headline-sm text-headline-sm text-on-surface leading-snug">
                          {act.title}
                        </h2>
                      </div>

                      <div className="w-10 h-10 rounded-full bg-[#DCE3D3] flex items-center justify-center shrink-0 text-[#7A6548]">
                        <span className="material-symbols-outlined text-[24px]">
                          {act.categoryIcon || 'flag'}
                        </span>
                      </div>
                    </div>

                    {/* תיבת מידע: תאריך, מיקום וציוד (Metadata Row) */}
                    <div className="space-y-1.5 bg-[#F6F3EB] p-space-sm rounded-lg border border-[#E5E2DA]/50">
                      <div className="flex items-center gap-2 text-secondary font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[18px] text-[#8B7355]">
                          calendar_month
                        </span>
                        <span>{formatActivityDateTime(act.date)}</span>
                      </div>

                      <div className="flex items-center gap-2 text-secondary font-body-sm text-body-sm">
                        <span className="material-symbols-outlined text-[18px] text-[#8B7355]">
                          location_on
                        </span>
                        <span>{act.location}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[#574637] font-label-sm text-label-sm pt-0.5">
                        <span className="material-symbols-outlined text-[16px] text-[#9E825D]">
                          inventory_2
                        </span>
                        <span className="font-semibold truncate">
                          {act.equipment || 'לא נדרש ציוד מיוחד'}
                        </span>
                      </div>

                      {/* הצגת נוכחות אם הפעולה הסתיימה */}
                      {isCompleted && act.attendedCount !== undefined && (
                        <div className="flex items-center justify-between pt-1 border-t border-[#E5E2DA]/40 text-xs">
                          <span className="text-[#304638] font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">done_all</span>
                            <span>
                              התייצבו {act.attendedCount} מתוך {act.totalExpected || totalScouts} חניכים
                            </span>
                          </span>
                          <span className="bg-white px-2 py-0.5 rounded-full font-bold text-[#7A6548] border border-[#E5E2DA]">
                            {Math.round(
                              (act.attendedCount / (act.totalExpected || totalScouts)) * 100
                            )}
                            % נוכחות
                          </span>
                        </div>
                      )}
                    </div>

                    {/* שני כפתורי הפעולה של הכרטיס (Activity Actions) */}
                    <div className="grid grid-cols-2 gap-space-sm pt-1">
                      {/* Button 1: פרטי המערך */}
                      <button
                        onClick={() => onViewPlan(act)}
                        className="py-2.5 px-space-sm bg-[#EEE1CC] text-[#383428] font-label-lg text-label-lg rounded-full active:scale-95 transition-all text-center hover:bg-[#E2DACB] cursor-pointer flex items-center justify-center gap-1 font-semibold"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        <span>פרטי המערך</span>
                      </button>

                      {/* Button 2: התחלת פעולה / המשך פעולה / צפייה בנוכחות */}
                      <button
                        onClick={() => handleOpenAttendance(act)}
                        className="py-2.5 px-space-sm bg-[#8B7355] text-white font-label-lg text-label-lg rounded-full active:scale-95 transition-all text-center font-bold shadow-sm hover:bg-[#7A6548] cursor-pointer flex items-center justify-center gap-1"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                        <span>{isCompleted ? 'צפייה בנוכחות' : 'התחלת פעולה'}</span>
                      </button>
                    </div>

                    {/* כפתורי עריכה ומחיקה לפעולה */}
                    <div className="flex items-center justify-between pt-0.5 border-t border-[#E5E2DA]/40">
                      <button
                        onClick={() => onEditActivity(act)}
                        className="text-xs text-[#7A6548] hover:text-[#574637] font-semibold flex items-center gap-1 cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[15px]">edit</span>
                        <span>עריכת פעולה</span>
                      </button>

                      <button
                        onClick={() => setDeleteConfirmAct(act)}
                        className="text-xs text-red-600 hover:text-red-800 hover:underline flex items-center gap-1 cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                        <span>מחיקת פעולה</span>
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* 4. ממשק ניהול נוכחות חי מתוך my activities.html (Live Attendance Interface) */}
      {liveAttendanceAct && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
          dir="rtl"
        >
          <div className="bg-[#F6F3EB] w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Modal Header */}
            <div className="p-4 bg-white border-b border-[#E5E2DA] flex items-center justify-between">
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {liveAttendanceAct.status === 'completed'
                    ? 'עדכון נוכחות בפעולה'
                    : 'רישום נוכחות - התחלת פעולה'}
                </h2>
                <p className="font-body-sm text-body-sm text-secondary truncate max-w-xs mt-0.5">
                  {liveAttendanceAct.title}
                </p>
              </div>

              <button
                onClick={() => setLiveAttendanceAct(null)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-secondary hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* סרגל התקדמות ומונה נוכחות דינמי מתוך my activities.html */}
            <div className="p-4 bg-[#F1EEE6] border-b border-[#E5E2DA] flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span
                  id="counterPill"
                  className="font-label-md text-label-md font-bold text-[#7A6548] bg-white px-3 py-1 rounded-full shadow-2xs border border-[#E5E2DA]"
                >
                  {presentCount} מתוך {totalScouts} חניכים ({attendancePercentage}%)
                </span>

                <button
                  onClick={markAllMembersPresent}
                  className="text-xs font-bold text-[#8B7355] hover:underline flex items-center gap-1 cursor-pointer bg-white/70 px-2.5 py-1 rounded-full border border-[#8B7355]/20"
                >
                  <span className="material-symbols-outlined text-[15px]">done_all</span>
                  <span>סמן את כולם כנוכחים</span>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-[#E5E2DA]/80">
                <div
                  id="attendanceProgress"
                  className="h-full bg-[#8B7355] transition-all duration-300 rounded-full"
                  style={{ width: `${attendancePercentage}%` }}
                />
              </div>
            </div>

            {/* רשימת שורות החניכים (Roster Rows) */}
            <div className="p-4 overflow-y-auto flex flex-col gap-2.5 max-h-[50vh]">
              {members.map((member) => {
                const isPresent = attendedMap[member.id] ?? false;
                const initials = `${member.firstName.charAt(0)}${member.lastName.charAt(0)}`;

                return (
                  <div
                    key={member.id}
                    className="roster-row bg-white p-3 rounded-xl border border-[#E5E2DA]/70 shadow-2xs flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.firstName}
                          className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#DCE3D3] flex items-center justify-center text-xs font-bold text-[#383428] shrink-0">
                          {initials}
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm text-on-surface truncate">
                          {member.firstName} {member.lastName}
                        </span>
                        <span className="text-[11px] text-secondary">
                          {member.gradeClass || 'כיתה ח׳'}
                        </span>
                      </div>
                    </div>

                    {/* כפתורי נוכח / נעדר בלחיצה מהירה */}
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          setAttendedMap((prev) => ({
                            ...prev,
                            [member.id]: true,
                          }))
                        }
                        className={`btn-present px-3 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1 transition-all cursor-pointer ${
                          isPresent
                            ? 'bg-[#7A6548] text-white font-bold shadow-xs'
                            : 'bg-[#ebe8e0] text-[#6E6754] hover:text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">check</span>
                        <span>נוכח</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setAttendedMap((prev) => ({
                            ...prev,
                            [member.id]: false,
                          }))
                        }
                        className={`btn-absent px-3 py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1 transition-all cursor-pointer ${
                          !isPresent
                            ? 'bg-[#ba1a1a] text-white font-bold shadow-xs'
                            : 'bg-[#ebe8e0] text-[#6E6754] hover:text-on-surface'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">close</span>
                        <span>נעדר</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* כפתור שמירה תחתון */}
            <div className="p-4 bg-white border-t border-[#E5E2DA] flex gap-2 pb-safe">
              <button
                type="button"
                onClick={handleSaveAttendance}
                className="flex-1 py-3 px-4 rounded-xl bg-[#8B7355] hover:bg-[#715b3e] text-white font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                <span>שמירת נוכחות וסיום ({presentCount} נוכחים)</span>
              </button>

              <button
                type="button"
                onClick={() => setLiveAttendanceAct(null)}
                className="py-3 px-5 rounded-xl bg-[#DCE3D3] text-[#304638] font-bold text-sm cursor-pointer"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. מודאל יצירת פעולה חדשה (Create Activity Modal) */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
          dir="rtl"
        >
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-3.5 max-h-[92vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#DCE3D3] flex items-center justify-center text-[#7A6548]">
                  <span className="material-symbols-outlined text-[20px]">add_task</span>
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  יצירת פעולה חדשה
                </h2>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-gray-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-xl bg-red-100 text-red-700 text-xs font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  כותרת הפעולה*
                </label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#F6F3EB] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 border border-[#E5E2DA]"
                  placeholder="לדוגמה: פעולת ערבות הדדית ומנהיגות צעירה"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">תאריך*</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-[#F6F3EB] rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 border border-[#E5E2DA]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">שעת התחלה*</label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full bg-[#F6F3EB] rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 border border-[#E5E2DA]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">שעת סיום</label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full bg-[#F6F3EB] rounded-xl px-2.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 border border-[#E5E2DA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">מיקום</label>
                  <input
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-[#F6F3EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 border border-[#E5E2DA]"
                    placeholder="רחבת התורן, שבט אופק"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-secondary mb-1">קטגוריה</label>
                  <select
                    value={newCategory}
                    onChange={(e) => {
                      setNewCategory(e.target.value);
                      if (e.target.value === 'צופיות מעשית') setNewCategoryIcon('local_fire_department');
                      else if (e.target.value === 'גיבוש ועבודת צוות') setNewCategoryIcon('groups');
                      else if (e.target.value === 'טבע וקיימות') setNewCategoryIcon('nature_people');
                      else setNewCategoryIcon('flag');
                    }}
                    className="w-full bg-[#F6F3EB] rounded-xl px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 border border-[#E5E2DA]"
                  >
                    <option value="ערכים ומנהיגות">ערכים ומנהיגות</option>
                    <option value="צופיות מעשית">צופיות מעשית</option>
                    <option value="גיבוש ועבודת צוות">גיבוש ועבודת צוות</option>
                    <option value="טבע וקיימות">טבע וקיימות</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  ציוד דרוש ומצרכים
                </label>
                <input
                  value={newEquipment}
                  onChange={(e) => setNewEquipment(e.target.value)}
                  className="w-full bg-[#F6F3EB] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 border border-[#E5E2DA]"
                  placeholder="סרטי סימון, חבל ציוד, בדי יוטה..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  מטרות חינוכיות (שורה לכל מטרה)
                </label>
                <textarea
                  rows={2}
                  value={newGoals}
                  onChange={(e) => setNewGoals(e.target.value)}
                  className="w-full bg-[#F6F3EB] rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 border border-[#E5E2DA] resize-none"
                  placeholder="פיתוח ערבות הדדית&#10;התנסות בהובלת צוות"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-secondary mb-1">
                  מהלך המערך צעד אחר צעד (הוראות והפעלות)
                </label>
                <textarea
                  rows={3}
                  value={newInstructions}
                  onChange={(e) => setNewInstructions(e.target.value)}
                  className="w-full bg-[#F6F3EB] rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 border border-[#E5E2DA] resize-none"
                  placeholder="פתיחה: משחק שרשרת אמון&#10;משימת שטח: בניית גשר חבלים&#10;סיכום ומסדר"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#8B7355] text-white font-bold text-sm cursor-pointer shadow-xs active:scale-95 transition-all"
                >
                  שמירת פעולה
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="py-3 px-5 rounded-xl bg-[#DCE3D3] text-[#304638] font-bold text-sm cursor-pointer"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. דיאלוג אישור מחיקת פעולה (Delete Confirmation Dialog) */}
      {deleteConfirmAct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          dir="rtl"
        >
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl flex flex-col gap-3 border border-red-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-red-700">
              <span className="material-symbols-outlined text-[24px]">warning</span>
              <h3 className="font-bold text-base">מחיקת פעולה</h3>
            </div>

            <p className="text-body-sm text-secondary leading-relaxed">
              האם אתה בטוח שברצונך למחוק את הפעולה{' '}
              <strong className="text-on-surface">"{deleteConfirmAct.title}"</strong>?
            </p>

            {deleteConfirmAct.attendedCount !== undefined && (
              <div className="p-2 rounded-lg bg-amber-50 text-amber-800 text-xs font-semibold">
                שים לב: לפעולה זו מקושרים {deleteConfirmAct.attendedCount} רישומי נוכחות קיימים.
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                כן, מחק פעולה
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmAct(null)}
                className="py-2.5 px-4 rounded-xl bg-[#EBE8E0] text-secondary font-bold text-xs cursor-pointer"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      )}

      {/* מודאל פרופיל מדריך */}
      {onSaveProfile && onLogout && (
        <ProfileModal
          user={user}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onSaveProfile={onSaveProfile}
          onLogout={onLogout}
        />
      )}

      {/* מודאל התראות */}
      <NotificationsModal
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onClearAll={() => {}}
        onMarkAsRead={() => {}}
      />
    </div>
  );
}
