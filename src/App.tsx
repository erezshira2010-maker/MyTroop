import { useState, useEffect } from 'react';
import type { UserProfile, ScoutMember, Activity, NotificationItem } from './types';
import {
  getUserProfile,
  saveUserProfile,
  clearUserSession,
  getMembers,
  saveMembers,
  getActivities,
  saveActivities,
  getNotifications,
  saveNotifications,
} from './services/storage';

import Register from './Register';
import Dashboard from './components/Dashboard';
import ScoutDirectory from './components/ScoutDirectory';
import ActivitiesScreen from './components/ActivitiesScreen';
import IdeasBankScreen from './components/IdeasBankScreen';
import BottomNav, { type NavTab } from './components/BottomNav';
import ViewPlanModal from './components/ViewPlanModal';
import EditActivityModal from './components/EditActivityModal';

/**
 * קומפוננטת האפליקציה הראשית - MyTroop
 * מנהלת את מצב המשתמש המחובר, הניווט בין ארבעת המסכים וסנכרון נתונים
 */
export default function App() {
  // משתמש מחובר (ברירת מחדל: טעינת מדריך שמור או התחברות)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return getUserProfile();
  });

  // לשונית ניווט נוכחית: בית / חניכים / פעולות / רעיונות
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // מצב התחברות / הרשמה (בעת התנתקות מועבר ישירות למצב התחברות ב-register.html)
  const [authMode, setAuthMode] = useState<'register' | 'login'>('login');

  // נתוני חניכים, פעולות והתראות
  const [members, setMembers] = useState<ScoutMember[]>(() => getMembers());
  const [activities, setActivities] = useState<Activity[]>(() => getActivities());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => getNotifications());

  // מודאלים גלובליים לצפייה ועריכת פעולות
  const [viewingPlanActivity, setViewingPlanActivity] = useState<Activity | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // סנכרון חניכים ל-localStorage
  useEffect(() => {
    saveMembers(members);
  }, [members]);

  // סנכרון פעולות ל-localStorage
  useEffect(() => {
    saveActivities(activities);
  }, [activities]);

  // סנכרון התראות ל-localStorage
  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  // התחברות או הרשמה מוצלחת
  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    saveUserProfile(user);
    setCurrentTab('dashboard');
  };

  // התנתקות מאובטחת מהמערכת - ניקוי נתוני סשן והעברה אוטומטית למסך התחברות (register.html)
  const handleLogout = () => {
    clearUserSession();
    setCurrentUser(null);
    setAuthMode('login');
    setCurrentTab('dashboard');
  };

  // עדכון פרופיל מדריך
  const handleSaveProfile = (updated: UserProfile) => {
    setCurrentUser(updated);
    saveUserProfile(updated);
  };

  // עדכון פעולה קיימת
  const handleUpdateActivity = (updated: Activity) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === updated.id ? updated : act))
    );
  };

  // יצירת פעולה חדשה
  const handleAddActivity = (newAct: Activity) => {
    setActivities((prev) => [newAct, ...prev]);
  };

  // מחיקת פעולה
  const handleDeleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((act) => act.id !== id));
  };

  // עדכון נוכחות בפעולה
  const handleUpdateAttendance = (
    actId: string,
    attendedCount: number,
    totalExpected: number,
    presentMemberIds?: string[],
    absentMemberIds?: string[]
  ) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === actId) {
          return {
            ...act,
            status: 'completed',
            attendedCount,
            totalExpected,
            presentMemberIds: presentMemberIds ?? act.presentMemberIds,
            absentMemberIds: absentMemberIds ?? act.absentMemberIds,
          };
        }
        return act;
      })
    );

    // עדכון נוכחות אישית של חניכים
    if (presentMemberIds && absentMemberIds) {
      setMembers((prevMembers) =>
        prevMembers.map((m) => {
          const isPresent = presentMemberIds.includes(m.id);
          const isAbsent = absentMemberIds.includes(m.id);
          if (!isPresent && !isAbsent) return m;

          const totalActs = m.totalActivities ?? 20;
          let attendedActs =
            m.attendedActivities ?? Math.round(((m.attendanceRate ?? 90) / 100) * totalActs);

          if (isPresent && (m.attendanceRate ?? 90) < 100) {
            attendedActs = Math.min(totalActs, attendedActs + 1);
          } else if (isAbsent && attendedActs > 0) {
            attendedActs = Math.max(0, attendedActs - 1);
          }

          const newRate = Math.round((attendedActs / totalActs) * 100);
          return {
            ...m,
            attendedActivities: attendedActs,
            attendanceRate: newRate,
            needsFollowUp: newRate < 85,
            followUpReason: isAbsent && newRate < 85 ? 'נעדר/ה בפעולה האחרונה' : m.followUpReason,
          };
        })
      );
    }
  };

  // הוספת חניך חדש לקבוצה
  const handleAddMember = (newMember: ScoutMember) => {
    setMembers((prev) => [...prev, newMember]);
  };

  // מחיקת חניך מהקבוצה
  const handleDeleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  // ניקוי כל ההתראות
  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // סימון התראה כנקראה
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  // אם המשתמש מנותק - מציגים את מסך ההרשמה וההתחברות (מכוון ללשונית התחברות לאחר התנתקות)
  if (!currentUser) {
    return <Register onAuthSuccess={handleAuthSuccess} initialMode={authMode} />;
  }

  return (
    <div className="min-h-screen bg-[#F6F3EB] flex flex-col font-sans" dir="rtl">
      {/* הצגת המסך בהתאם ללשונית הנבחרת */}
      {currentTab === 'dashboard' && (
        <Dashboard
          user={currentUser}
          members={members}
          activities={activities}
          notifications={notifications}
          onNavigateTab={setCurrentTab}
          onUpdateActivity={handleUpdateActivity}
          onUpdateAttendance={handleUpdateAttendance}
          onSaveProfile={handleSaveProfile}
          onClearNotifications={handleClearNotifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onLogout={handleLogout}
        />
      )}

      {currentTab === 'members' && (
        <ScoutDirectory
          members={members}
          user={currentUser}
          notifications={notifications}
          onAddMember={handleAddMember}
          onUpdateMember={(updated) => {
            setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
          }}
          onDeleteMember={handleDeleteMember}
          onBackToDashboard={() => setCurrentTab('dashboard')}
          onSaveProfile={handleSaveProfile}
          onLogout={handleLogout}
        />
      )}

      {currentTab === 'activities' && (
        <ActivitiesScreen
          activities={activities}
          members={members}
          user={currentUser}
          notifications={notifications}
          onViewPlan={(act) => setViewingPlanActivity(act)}
          onEditActivity={(act) => setEditingActivity(act)}
          onAddActivity={handleAddActivity}
          onDeleteActivity={handleDeleteActivity}
          onUpdateAttendance={handleUpdateAttendance}
          onBackToDashboard={() => setCurrentTab('dashboard')}
          onSaveProfile={handleSaveProfile}
          onLogout={handleLogout}
        />
      )}

      {currentTab === 'ideas' && (
        <IdeasBankScreen
          user={currentUser}
          notifications={notifications}
          onBackToDashboard={() => setCurrentTab('dashboard')}
          onNavigateTab={setCurrentTab}
          onAddActivity={handleAddActivity}
          onSaveProfile={handleSaveProfile}
          onLogout={handleLogout}
        />
      )}

      {/* סרגל ניווט תחתון קבוע ורספונסיבי בכל ארבעת המסכים */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* מודאל צפייה במערך פעולה (גלובלי) */}
      <ViewPlanModal
        activity={viewingPlanActivity}
        onClose={() => setViewingPlanActivity(null)}
        onEdit={(act) => setEditingActivity(act)}
      />

      {/* מודאל עריכת פעולה (גלובלי) */}
      <EditActivityModal
        activity={editingActivity}
        isOpen={Boolean(editingActivity)}
        onClose={() => setEditingActivity(null)}
        onSave={handleUpdateActivity}
      />
    </div>
  );
}
