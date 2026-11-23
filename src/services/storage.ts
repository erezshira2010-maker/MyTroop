import type { UserProfile, ScoutMember, Activity, NotificationItem } from '../types';
import {
  defaultUserProfile,
  initialMembers,
  initialActivities,
  initialNotifications,
  weeklyScoutTips,
} from '../data/mockData';

const STORAGE_KEYS = {
  USER: 'mytroop_current_user',
  MEMBERS: 'mytroop_members',
  ACTIVITIES: 'mytroop_activities',
  NOTIFICATIONS: 'mytroop_notifications',
};

/**
 * שמירה ושליפה של נתוני משתמש (UserProfile)
 */
export const getUserProfile = (): UserProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('שגיאה בקריאת פרופיל משתמש מ-localStorage:', err);
  }
  return defaultUserProfile;
};

export const saveUserProfile = (profile: UserProfile): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));
  } catch (err) {
    console.error('שגיאה בשמירת פרופיל משתמש:', err);
  }
};

export const clearUserSession = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
  } catch (err) {
    console.error('שגיאה בניקוי סשן משתמש:', err);
  }
};

/**
 * שמירה ושליפה של חניכי הקבוצה
 */
export const getMembers = (): ScoutMember[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('שגיאה בקריאת חניכים מ-localStorage:', err);
  }
  // שמירת ערכי ברירת מחדל אם אין נתונים שמורים
  saveMembers(initialMembers);
  return initialMembers;
};

export const saveMembers = (members: ScoutMember[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  } catch (err) {
    console.error('שגיאה בשמירת חניכים:', err);
  }
};

/**
 * שמירה ושליפה של פעולות
 */
export const getActivities = (): Activity[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('שגיאה בקריאת פעולות מ-localStorage:', err);
  }
  // שמירת פעולות ראשוניות
  saveActivities(initialActivities);
  return initialActivities;
};

export const saveActivities = (activities: Activity[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  } catch (err) {
    console.error('שגיאה בשמירת פעולות:', err);
  }
};

/**
 * שמירה ושליפה של התראות
 */
export const getNotifications = (): NotificationItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('שגיאה בקריאת התראות:', err);
  }
  saveNotifications(initialNotifications);
  return initialNotifications;
};

export const saveNotifications = (notifications: NotificationItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (err) {
    console.error('שגיאה בשמירת התראות:', err);
  }
};

/**
 * חישוב משך הפעולה בדקות (מתוך שלבי הפעולה או ברירת מחדל של 120 דקות)
 */
export const getActivityDurationMinutes = (act: Activity): number => {
  if (act.steps && act.steps.length > 0) {
    let totalMinutes = 0;
    for (const step of act.steps) {
      const match = step.duration?.match(/(\d+)/);
      if (match) {
        totalMinutes += parseInt(match[1], 10);
      }
    }
    if (totalMinutes > 0) {
      return Math.max(totalMinutes, 60); // משך מינימלי לפעולה צופית
    }
  }
  return 120; // משך פעולה צופית תקנית: שעתיים (120 דקות)
};

/**
 * קבלת מועד סיום הפעולה המדויק
 */
export const getActivityEndTime = (act: Activity): Date => {
  const startTime = new Date(act.date).getTime();
  const durationMs = getActivityDurationMinutes(act) * 60 * 1000;
  return new Date(startTime + durationMs);
};

/**
 * בדיקה האם פעולה היא פעולה קרובה עתידית (טרם הסתיימה ומועד סיומה טרם חלף)
 */
export const isActivityUpcoming = (act: Activity, now = new Date()): boolean => {
  if (act.status === 'completed') return false;
  const endTime = getActivityEndTime(act);
  return endTime.getTime() > now.getTime();
};

/**
 * בדיקה האם פעולה הסתיימה או שזמן סיומה המתוכנן כבר עבר
 */
export const isActivityCompletedOrPast = (act: Activity, now = new Date()): boolean => {
  if (act.status === 'completed') return true;
  const endTime = getActivityEndTime(act);
  return endTime.getTime() <= now.getTime();
};

/**
 * שליפת כל הפעולות הקרובות ממוינות מהקרובה ביותר בזמן והלאה
 */
export const getUpcomingActivities = (activities: Activity[], now = new Date()): Activity[] => {
  return activities
    .filter((a) => isActivityUpcoming(a, now))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * שליפת כל הפעולות שהסתיימו (כולל פעולות שזמן סיומן עבר), ממוינות מהאחרונה שהסתיימה אחורה
 */
export const getCompletedActivities = (activities: Activity[], now = new Date()): Activity[] => {
  return activities
    .filter((a) => isActivityCompletedOrPast(a, now))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

/**
 * קבלת שם החודש הנוכחי בעברית (למשל: מאי, נובמבר, אוקטובר)
 */
export const getCurrentMonthNameHebrew = (): string => {
  const months = [
    'ינואר',
    'פברואר',
    'מרץ',
    'אפריל',
    'מאי',
    'יוני',
    'יולי',
    'אוגוסט',
    'ספטמבר',
    'אוקטובר',
    'נובמבר',
    'דצמבר',
  ];
  return months[new Date().getMonth()];
};

/**
 * חישוב ברכת שלום אישית לפי שעת היום
 */
export const getTimeBasedGreeting = (fullName: string): string => {
  const hour = new Date().getHours();
  const firstName = fullName.trim().split(/\s+/)[0] || 'מדריך';

  if (hour >= 5 && hour < 12) {
    return `בוקר טוב, ${firstName}! ⚜️`;
  } else if (hour >= 12 && hour < 17) {
    return `צהריים טובים, ${firstName}! ⚜️`;
  } else {
    return `ערב טוב, ${firstName}! ⚜️`;
  }
};

/**
 * חישוב תווית זמן יחסית (היום, מחר, בעוד יומיים וכו')
 */
export const getRelativeDateLabel = (dateStr: string): string => {
  const targetDate = new Date(dateStr);
  const now = new Date();

  // איפוס שעות להשוואת ימים קלנדריים בלבד
  const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffDays = Math.round((targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'היום';
  if (diffDays === 1) return 'מחר';
  if (diffDays === 2) return 'בעוד יומיים';
  if (diffDays > 2 && diffDays <= 7) return `בעוד ${diffDays} ימים`;
  if (diffDays < 0) return 'הסתיימה';

  // תאריך מעבר לשבוע
  return targetDate.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
};

/**
 * פורמט ידידותי בעברית לתאריך ושעת פעולה (למשל: "יום שלישי הקרוב • 17:30")
 */
export const formatActivityDateTime = (dateStr: string): string => {
  const d = new Date(dateStr);
  const daysOfWeek = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  const dayName = daysOfWeek[d.getDay()];

  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  const relativeLabel = getRelativeDateLabel(dateStr);
  if (relativeLabel === 'היום' || relativeLabel === 'מחר' || relativeLabel === 'בעוד יומיים') {
    return `יום ${dayName} (${relativeLabel}) • ${hours}:${minutes}`;
  }

  return `יום ${dayName} הקרוב • ${hours}:${minutes}`;
};

/**
 * שליפת הטיפ הצופי השבועי לפי שבוע השנה
 */
export const getWeeklyTip = (): string => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);

  const tipIndex = weekNumber % weeklyScoutTips.length;
  return weeklyScoutTips[tipIndex];
};

/**
 * שמירה ושליפה של רעיונות מועדפים (Favorite Activity Ideas)
 */
const FAVORITES_STORAGE_KEY = 'mytroop_favorite_ideas';

export const getFavoriteIdeaIds = (): string[] => {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('שגיאה בקריאת מועדפים:', err);
  }
  return ['idea-treasure-hunt']; // מועדף התחלתי בדיוק כמו ב-activity ideas.html
};

export const saveFavoriteIdeaIds = (ids: string[]): void => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
  } catch (err) {
    console.error('שגיאה בשמירת מועדפים:', err);
  }
};


