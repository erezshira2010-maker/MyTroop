import { useState, useMemo, useEffect } from 'react';
import type { UserProfile, ScoutMember, Activity, NotificationItem } from '../types';
import {
  getTimeBasedGreeting,
  getCurrentMonthNameHebrew,
  getRelativeDateLabel,
  formatActivityDateTime,
  getWeeklyTip,
  getUpcomingActivities,
  getCompletedActivities,
} from '../services/storage';
import ViewPlanModal from './ViewPlanModal';
import EditActivityModal from './EditActivityModal';
import ProfileModal from './ProfileModal';
import NotificationsModal from './NotificationsModal';
import AverageAttendanceModal from './AverageAttendanceModal';
import PreviousActivityModal from './PreviousActivityModal';
import MyTroopLogo from './MyTroopLogo';

interface DashboardProps {
  user: UserProfile;
  members: ScoutMember[];
  activities: Activity[];
  notifications: NotificationItem[];
  onNavigateTab: (tab: 'dashboard' | 'members' | 'activities' | 'ideas') => void;
  onUpdateActivity: (updated: Activity) => void;
  onUpdateAttendance?: (
    actId: string,
    attendedCount: number,
    totalExpected: number,
    presentIds?: string[],
    absentIds?: string[]
  ) => void;
  onSaveProfile: (updated: UserProfile) => void;
  onClearNotifications: () => void;
  onMarkNotificationRead: (id: string) => void;
  onLogout: () => void;
  onOpenCreateActivity?: () => void;
}

/**
 * קומפוננטת מסך הבית ולוח הבקרה (Home Dashboard)
 * שחזור מדויק של קובץ main.html עם חיבור לנתונים אמיתיים ודינמיים:
 * 1. כרטיס נוכחות ממוצעת פותח מודאל עם פילוח חניכים
 * 2. כרטיס הפעולה הקודמת פותח מודאל עם סיכום נוכחים/נעדרים ועריכת נוכחות
 * 3. לוגו MyTroop הרשמי מתוך Google Stitch
 */
export default function Dashboard({
  user,
  members,
  activities,
  notifications,
  onNavigateTab,
  onUpdateActivity,
  onUpdateAttendance,
  onSaveProfile,
  onClearNotifications,
  onMarkNotificationRead,
  onLogout,
}: DashboardProps) {
  // מצבי מודאלים קיימים
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [viewingPlanActivity, setViewingPlanActivity] = useState<Activity | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // מודאלים חדשים לעדכוני דשבורד
  const [isAverageAttendanceOpen, setIsAverageAttendanceOpen] = useState(false);
  const [isPreviousActivityOpen, setIsPreviousActivityOpen] = useState(false);

  // חישוב ברכת השלום האישית לפי שעת היום ושם המשתמש
  const greeting = getTimeBasedGreeting(user.fullName);

  // מעקב זמן רציף: בדיקה תקופתית כך שאם מועד סיום פעולה חלף, היא תעבור אוטומטית ללא צורך ברענון
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // רענון כל 30 שניות
    return () => clearInterval(timer);
  }, []);

  // פילוח מגדרי וספירת חניכים דינמית
  const totalMembers = members.length;
  const boysCount = members.filter((m) => m.gender === 'boy').length;
  const girlsCount = members.filter((m) => m.gender === 'girl').length;

  // שליפת כל הפעולות שהסתיימו או שזמנן עבר (מסונכרן באופן מלא עם מסך הפעולות)
  const completedActivities = useMemo(
    () => getCompletedActivities(activities, currentTime),
    [activities, currentTime]
  );

  // איתור הפעולה הקודמת עבור כרטיס הנוכחות (עדיפות לפעולה שהסתיימה עם רישום נוכחות מתועד)
  const previousActivity = useMemo(() => {
    return (
      completedActivities.find((a) => a.attendedCount !== undefined && a.attendedCount >= 0) ||
      completedActivities[0] ||
      null
    );
  }, [completedActivities]);

  const previousAttendanceCount = previousActivity?.attendedCount ?? 0;
  const previousTotalExpected = previousActivity?.totalExpected ?? totalMembers;
  const previousAttendanceRate =
    previousTotalExpected > 0 && previousAttendanceCount > 0
      ? Math.round((previousAttendanceCount / previousTotalExpected) * 100)
      : 0;

  // חישוב ממוצע נוכחות כולל מכלל הפעולות שהסתיימו עם נוכחות
  const averageAttendanceRate = useMemo(() => {
    const actsWithAttendance = completedActivities.filter(
      (a) => a.attendedCount !== undefined && a.totalExpected !== undefined && a.totalExpected > 0
    );
    if (actsWithAttendance.length > 0) {
      const totalAttended = actsWithAttendance.reduce((acc, cur) => acc + (cur.attendedCount || 0), 0);
      const totalExpected = actsWithAttendance.reduce((acc, cur) => acc + (cur.totalExpected || totalMembers), 0);
      if (totalExpected > 0) {
        return Math.round((totalAttended / totalExpected) * 100);
      }
    }
    // אם טרם נרשמה נוכחות בפעולות, חישוב ממוצע לפי נתוני החניכים הקיימים
    if (members.length > 0) {
      const sumRates = members.reduce((acc, m) => acc + (m.attendanceRate ?? 0), 0);
      return Math.round(sumRates / members.length);
    }
    return 0;
  }, [completedActivities, members, totalMembers]);

  // מציאת הפעולות הקרובות ביותר שטרם התקיימו (מסונכרן עם מסך הפעולות)
  const upcomingActivities = useMemo(
    () => getUpcomingActivities(activities, currentTime),
    [activities, currentTime]
  );

  // הפעולה הקרובה ביותר
  const nextActivity = upcomingActivities[0] || null;
  const nextRelativeDate = nextActivity ? getRelativeDateLabel(nextActivity.date) : '';

  // ספירת פעולות מתוכננות לחודש הנוכחי מתוך הפעולות הקרובות
  const currentMonthIdx = currentTime.getMonth();
  const currentYear = currentTime.getFullYear();
  const currentMonthName = getCurrentMonthNameHebrew();

  const plannedThisMonthCount = upcomingActivities.filter((a) => {
    const d = new Date(a.date);
    return d.getMonth() === currentMonthIdx && d.getFullYear() === currentYear;
  }).length;

  // טיפ שבועי מתחלף
  const weeklyTip = getWeeklyTip();

  // ספירת התראות שלא נקראו
  const unreadCount = notifications.filter((n) => !n.read).length;

  // עדכון נוכחות של הפעולה הקודמת ושמירה
  const handleSavePreviousAttendance = (
    actId: string,
    presentIds: string[],
    absentIds: string[]
  ) => {
    const targetAct = activities.find((a) => a.id === actId);
    if (!targetAct) return;

    const updatedAct: Activity = {
      ...targetAct,
      status: 'completed',
      attendedCount: presentIds.length,
      totalExpected: members.length,
      presentMemberIds: presentIds,
      absentMemberIds: absentIds,
    };

    onUpdateActivity(updatedAct);
    if (onUpdateAttendance) {
      onUpdateAttendance(actId, presentIds.length, members.length, presentIds, absentIds);
    }
  };

  return (
    <div className="bg-[#F6F3EB] text-on-surface font-body-md text-body-md flex flex-col min-h-screen">
      {/* 2. Top Navigation Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#F6F3EB]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(70,55,30,0.05)] pt-safe">
        <div className="h-16 px-gutter flex items-center justify-between max-w-lg mx-auto w-full">
          {/* Logo & Name - New Original MyTroop Logo */}
          <button
            onClick={() => onNavigateTab('dashboard')}
            className="flex items-center gap-space-sm cursor-pointer group text-right border-none bg-transparent"
          >
            <div className="relative flex items-center justify-center">
              <MyTroopLogo className="w-8 h-8 rounded-xl shadow-xs transition-transform group-hover:scale-105" />
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
              MyTroop
            </span>
          </button>

          {/* Action Buttons: Notifications & Profile */}
          <div className="flex items-center gap-space-xs">
            {/* Notification Bell */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              aria-label="התראות ותזכורות"
              className="relative w-11 h-11 flex items-center justify-center rounded-full text-secondary hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 left-2 w-2.5 h-2.5 bg-[#8B7355] rounded-full ring-2 ring-[#F6F3EB] animate-pulse" />
              )}
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => setIsProfileOpen(true)}
              aria-label="פרופיל משתמש"
              className="w-11 h-11 flex items-center justify-center rounded-full cursor-pointer group"
            >
              <img
                alt={user.fullName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-[#8B7355]/30 group-hover:ring-[#8B7355] transition-all"
                src={
                  user.avatarUrl ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBOocxAeW088iNI7lMsO5LU3rhluu_Gs0z6k35ya3IAux6C7HwjZl7ovwWEkyG--uodsO3OWoyMm7fTsL0a9R0iiTPjE0RMhFiQtpIdvNEh8QegZh1oYvftMCwk5VGrVUvp9Qjq1woKWRXGj43P_2O7xmsLcThaftjJ1FZyLOpkUnRpqqYpVnPEX859CJGnXgUeTGvvnoHgcwFMtGxz3ILclBRgkCqjoKuhVqQgdTlAmIyEVqAfk_Jm'
                }
              />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full px-gutter pt-20 pb-28 bg-[#F6F3EB] max-w-lg mx-auto">
        <div className="flex flex-col w-full gap-space-lg select-none pb-4">
          {/* 3. Personalized Welcome Section */}
          <section className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                  {greeting}
                </h1>
                <p className="font-body-md text-body-md text-secondary mt-0.5">
                  מוכנים לפעולת אמצע שבוע? החניכים כבר מחכים.
                </p>
              </div>

              {/* Decorative Nature Emblem */}
              <div className="flex -space-x-2 space-x-reverse overflow-hidden p-1 shrink-0">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#DCE3D3] text-[#715b3e] shadow-sm ring-2 ring-[#F6F3EB]">
                  <span className="material-symbols-outlined text-[20px]">forest</span>
                </span>
              </div>
            </div>

            {/* Troop Hierarchy Pill */}
            <div className="inline-flex self-start items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DCE3D3]/70 text-[#4e4637] mt-1 shadow-sm">
              <span className="material-symbols-outlined text-[16px] text-[#715b3e]">diversity_3</span>
              <span className="font-label-md text-label-md">
                {user.shevetName} • {user.gdud || 'גדוד יונתן'} • {user.patrol} ({user.layerName?.split('-')[0]?.trim() || 'ח׳'})
              </span>
            </div>
          </section>

          {/* 4. Dashboard Statistics Cards (2x2 Grid) */}
          <section className="grid grid-cols-2 gap-space-md">
            {/* Stat Card 1: Total Scout Members */}
            <div
              onClick={() => onNavigateTab('members')}
              role="button"
              tabIndex={0}
              className="flex flex-col justify-between p-space-md rounded-2xl bg-surface-container-lowest shadow-[0_4px_16px_rgba(70,55,30,0.06)] relative overflow-hidden group active:scale-[0.98] transition-transform cursor-pointer border border-[#E2DACB]/30 hover:border-[#8B7355]/40"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-md text-label-md text-secondary">חניכים בקבוצה</span>
                <div className="w-8 h-8 rounded-full bg-[#DCE3D3] flex items-center justify-center text-[#715b3e]">
                  <span className="material-symbols-outlined text-[18px]">group</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display-lg text-display-lg text-on-surface font-extrabold tracking-tight">
                  {totalMembers}
                </span>
                <span className="font-body-sm text-body-sm text-secondary mt-0.5">
                  {boysCount} בנים, {girlsCount} בנות
                </span>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-[#8B7355]/30"></div>
            </div>

            {/* Stat Card 2: Previous Activity Attendance - פותח מודאל נוכחות מפורט */}
            <div
              onClick={() => setIsPreviousActivityOpen(true)}
              role="button"
              tabIndex={0}
              className="flex flex-col justify-between p-space-md rounded-2xl bg-surface-container-lowest shadow-[0_4px_16px_rgba(70,55,30,0.06)] relative overflow-hidden group active:scale-[0.98] transition-transform cursor-pointer border border-[#E2DACB]/30 hover:border-[#8B7355]/40"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-md text-label-md text-secondary">בפעולה הקודמת</span>
                <div className="w-8 h-8 rounded-full bg-[#DCE3D3] flex items-center justify-center text-[#715b3e]">
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="font-display-lg text-display-lg text-on-surface font-extrabold tracking-tight">
                    {previousActivity ? previousAttendanceCount : '—'}
                  </span>
                  {previousActivity && (
                    <span className="font-body-sm text-body-sm text-secondary">חניכים</span>
                  )}
                </div>
                <span className="font-label-sm text-label-sm text-[#715b3e] flex items-center gap-0.5 mt-0.5 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">done_all</span>
                  {previousActivity ? `${previousAttendanceRate}% התייצבות` : 'טרם תועדה פעולה'}
                </span>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-[#8B7355]/50"></div>
            </div>

            {/* Stat Card 3: Average Attendance - פותח פופאפ/מודאל באותו עמוד */}
            <div
              onClick={() => setIsAverageAttendanceOpen(true)}
              role="button"
              tabIndex={0}
              className="flex flex-col justify-between p-space-md rounded-2xl bg-surface-container-lowest shadow-[0_4px_16px_rgba(70,55,30,0.06)] relative overflow-hidden group active:scale-[0.98] transition-transform cursor-pointer border border-[#E2DACB]/30 hover:border-[#8B7355]/40"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-md text-label-md text-secondary">נוכחות ממוצעת</span>
                <div className="w-8 h-8 rounded-full bg-[#DCE3D3] flex items-center justify-center text-[#715b3e]">
                  <span className="material-symbols-outlined text-[18px]">query_stats</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display-lg text-display-lg text-on-surface font-extrabold tracking-tight">
                  {averageAttendanceRate}%
                </span>
                <span className="inline-flex items-center gap-0.5 font-label-sm text-label-sm text-[#715b3e] bg-[#DCE3D3] px-1.5 py-0.5 rounded-full self-start mt-0.5 font-semibold">
                  <span className="material-symbols-outlined text-[12px]">trending_up</span>
                  נתון חי מחושב
                </span>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-[#8B7355]"></div>
            </div>

            {/* Stat Card 4: Planned Activities */}
            <div
              onClick={() => onNavigateTab('activities')}
              role="button"
              tabIndex={0}
              className="flex flex-col justify-between p-space-md rounded-2xl bg-surface-container-lowest shadow-[0_4px_16px_rgba(70,55,30,0.06)] relative overflow-hidden group active:scale-[0.98] transition-transform cursor-pointer border border-[#E2DACB]/30 hover:border-[#8B7355]/40"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-md text-label-md text-secondary">פעולות מתוכננות</span>
                <div className="w-8 h-8 rounded-full bg-[#eee1cc] flex items-center justify-center text-[#705b3b]">
                  <span className="material-symbols-outlined text-[18px]">event_note</span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="font-display-lg text-display-lg text-on-surface font-extrabold tracking-tight">
                    {plannedThisMonthCount}
                  </span>
                  <span className="font-body-sm text-body-sm text-secondary">פעולות</span>
                </div>
                <span className="font-body-sm text-body-sm text-secondary mt-0.5">
                  לחודש {currentMonthName}
                </span>
              </div>
              <div className="absolute bottom-0 inset-x-0 h-1 bg-[#9E825D]/40"></div>
            </div>
          </section>

          {/* 5. Featured Card: Upcoming Activity */}
          <section className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-[#715b3e]">campaign</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">הפעולה הקרובה</h2>
              </div>
              {nextActivity && (
                <span className="font-label-sm text-label-sm text-[#8B7355] font-bold">
                  {nextRelativeDate}
                </span>
              )}
            </div>

            {nextActivity ? (
              <div className="rounded-2xl bg-surface-container-lowest p-space-md shadow-[0_6px_20px_rgba(70,55,30,0.07)] flex flex-col gap-3 relative overflow-hidden border border-[#E2DACB]/40">
                {/* Decorative warm brown accent strip on right (RTL start) */}
                <div className="absolute top-0 right-0 bottom-0 w-1.5 bg-[#8B7355]"></div>

                {/* Header: Time Badge & Tag */}
                <div className="flex items-center justify-between pr-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#eee1cc] text-[#4e4637] font-label-md text-label-md">
                    <span className="material-symbols-outlined text-[16px] text-[#715b3e]">schedule</span>
                    <span>{formatActivityDateTime(nextActivity.date)}</span>
                  </span>

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#DCE3D3] font-label-sm text-label-sm text-[#4d453c]">
                    <span className="material-symbols-outlined text-[14px]">
                      {nextActivity.categoryIcon || 'local_fire_department'}
                    </span>
                    <span>{nextActivity.category}</span>
                  </span>
                </div>

                {/* Activity Title & Location */}
                <div className="flex flex-col pr-2">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                    {nextActivity.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-secondary font-body-sm text-body-sm mt-1">
                    <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                    <span>{nextActivity.location}</span>
                  </div>
                  {nextActivity.description && (
                    <p className="font-body-sm text-body-sm text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                      {nextActivity.description}
                    </p>
                  )}
                </div>

                {/* Equipment Box */}
                {nextActivity.equipment && (
                  <div className="mr-2 p-3 rounded-xl bg-[#DCE3D3]/40 flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 text-[#4d453c] font-label-sm text-label-sm font-semibold">
                      <span className="material-symbols-outlined text-[15px] text-[#715b3e]">handyman</span>
                      <span>ציוד דרוש ומצרכים:</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-[#4d453c] leading-relaxed">
                      {nextActivity.equipment}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-space-sm pt-1 pr-2">
                  <button
                    onClick={() => setViewingPlanActivity(nextActivity)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#8B7355] hover:bg-[#715b3e] text-white font-label-lg text-label-lg shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                    <span>צפייה במערך</span>
                  </button>

                  <button
                    onClick={() => setEditingActivity(nextActivity)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#DCE3D3] hover:bg-[#d0dbca] text-on-surface font-label-lg text-label-lg active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary">edit</span>
                    <span>עריכה</span>
                  </button>
                </div>
              </div>
            ) : (
              /* מצב שבו אין פעולות קרובות מתוכננות */
              <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-xs border border-[#E2DACB]/60 text-center flex flex-col items-center gap-2.5">
                <span className="w-12 h-12 rounded-full bg-[#eee1cc] flex items-center justify-center text-[#705b3b]">
                  <span className="material-symbols-outlined text-[24px]">event_busy</span>
                </span>
                <p className="font-bold text-on-surface text-base">אין פעולות קרובות מתוכננות</p>
                <p className="text-body-sm text-secondary max-w-xs">
                  זה הזמן לתכנן פעולה חדשה לקבוצה או לבחור רעיון מבנק הרעיונות!
                </p>
                <button
                  onClick={() => onNavigateTab('activities')}
                  className="mt-2 py-2.5 px-5 rounded-xl bg-[#8B7355] text-white font-bold text-sm shadow-xs cursor-pointer active:scale-95 transition-all"
                >
                  יצירת פעולה חדשה
                </button>
              </div>
            )}
          </section>

          {/* 6. Weekly Scout Tip Section */}
          <div className="p-3.5 rounded-2xl bg-[#eee1cc] flex items-center gap-3 border border-[#E2DACB]/60">
            <div className="w-10 h-10 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-center text-[#8B7355] shrink-0">
              <span className="material-symbols-outlined text-[22px]">lightbulb</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-[#4e4637] font-bold">טיפ צופי שבועי</span>
              <p className="font-body-sm text-body-sm text-secondary truncate">
                {weeklyTip}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 1. מודאל נוכחות ממוצעת (Average Attendance Modal) */}
      <AverageAttendanceModal
        isOpen={isAverageAttendanceOpen}
        onClose={() => setIsAverageAttendanceOpen(false)}
        members={members}
        averageAttendanceRate={averageAttendanceRate}
      />

      {/* 2. מודאל הפעולה הקודמת (Previous Activity Modal) עם סיכום נוכחים/נעדרים ועריכת נוכחות */}
      <PreviousActivityModal
        activity={previousActivity}
        isOpen={isPreviousActivityOpen}
        onClose={() => setIsPreviousActivityOpen(false)}
        members={members}
        onSaveAttendance={handleSavePreviousAttendance}
        onViewPlan={(act) => setViewingPlanActivity(act)}
      />

      {/* מודאל צפייה במערך הפעולה */}
      <ViewPlanModal
        activity={viewingPlanActivity}
        onClose={() => setViewingPlanActivity(null)}
        onEdit={(act) => setEditingActivity(act)}
      />

      {/* מודאל עריכת פעולה */}
      <EditActivityModal
        activity={editingActivity}
        isOpen={Boolean(editingActivity)}
        onClose={() => setEditingActivity(null)}
        onSave={(updated) => onUpdateActivity(updated)}
      />

      {/* מודאל פרופיל מדריך */}
      <ProfileModal
        user={user}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSaveProfile={onSaveProfile}
        onLogout={onLogout}
      />

      {/* מודאל התראות ותזכורות */}
      <NotificationsModal
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onClearAll={onClearNotifications}
        onMarkAsRead={onMarkNotificationRead}
      />
    </div>
  );
}
