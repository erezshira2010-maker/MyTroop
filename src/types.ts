/**
 * ממשקי נתונים (TypeScript Interfaces) עבור אפליקציית MyTroop
 * כל הטיפוסים מתארים נתונים אמיתיים של מדריך, חניכים, פעולות והתראות
 */

// פרופיל המדריך המחובר
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  shevet: string;       // קוד השבט, למשל 'ofek'
  shevetName: string;   // שם השבט בעברית, למשל 'שבט אופק'
  gdud: string;         // גדוד, למשל 'גדוד יונתן'
  patrol: string;       // שם הקבוצה, למשל 'קבוצת נשר'
  layer: string;        // קוד שכבת הגיל, למשל 'chet'
  layerName: string;    // שם השכבה, למשל 'ח׳ - נעורים'
  avatarUrl?: string;   // תמונת פרופיל (אופציונלית)
}

// חניך בקבוצה
export interface ScoutMember {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'boy' | 'girl'; // 'boy' (בן) או 'girl' (בת) לצורך חישוב חלוקה
  phone: string;
  parentName: string;
  parentPhone: string;
  notes?: string;

  // שדות מורחבים עבור מסך "החניכים שלי" (my scout html)
  avatarUrl?: string;
  gradeClass?: string;         // לדוגמה: "כיתה ח׳ 2"
  role?: string;               // לדוגמה: "ראש צוות", "אחראי ציוד ומוראל"
  isLeaderTeam?: boolean;      // האם שייך לצוות מוביל
  needsFollowUp?: boolean;     // האם דורש מעקב (נוכחות נמוכה / חיסורים)
  followUpReason?: string;     // סיבת המעקב (למשל: "פספס 2 פעולות אחרונות")
  attendanceRate?: number;     // אחוז נוכחות (למשל 95)
  attendedActivities?: number; // כמות פעולות שנכח (19)
  totalActivities?: number;    // סך הכל פעולות (20)
  fatherName?: string;
  fatherPhone?: string;
  motherName?: string;
  motherPhone?: string;
  allergies?: string;          // אלרגיות והנחיות רפואיות
}

// שלב במערך פעולה
export interface ActivityStep {
  title: string;
  duration: string; // למשל '20 דקות'
  description: string;
}

// פעולה צופית
export interface Activity {
  id: string;
  title: string;
  date: string; // פורמט ISO או YYYY-MM-DDTHH:mm
  location: string;
  category: string; // למשל 'צופיות מעשית'
  categoryIcon?: string;
  equipment: string;
  description: string;
  goals: string[];
  steps: ActivityStep[];
  status: 'scheduled' | 'completed'; // האם הפעולה מתוכננת או שהסתיימה
  attendedCount?: number;            // מספר החניכים שנכחו
  totalExpected?: number;            // סך החניכים שהיו אמורים לנכוח
  presentMemberIds?: string[];       // מזהי החניכים שנכחו
  absentMemberIds?: string[];        // מזהי החניכים שנעדרו
}

// שלב בפעולה מתוך בנק הרעיונות
export interface ActivityIdeaStep {
  title: string;
  duration: string;
  description: string;
}

// רעיון לפעולה בבנק הרעיונות
export interface ActivityIdea {
  id: string;
  title: string;
  category: string;
  categoryIcon?: string;
  iconBg?: string;
  iconColor?: string;
  ageGroup: string;
  duration: string;
  groupSize?: string;
  location?: string;
  description: string;
  equipment: string;
  goals?: string[];
  steps?: ActivityIdeaStep[];
  imageUrl?: string;
  isFeatured?: boolean;
  author?: string;
  ratingNotice?: string;
  socialProof?: string;
}

// התראה למדריך
export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'activity' | 'reminder' | 'system';
}
