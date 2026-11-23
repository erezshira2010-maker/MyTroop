import type { UserProfile, ScoutMember, Activity, ActivityIdea, NotificationItem } from '../types';

/**
 * נתוני ברירת מחדל של מדריך לדוגמה (נועם כהן)
 * מבוסס על מסך הייחוס: שבט אופק • גדוד יונתן • קבוצת נשר (ח׳)
 */
export const defaultUserProfile: UserProfile = {
  id: 'leader-noam-1',
  fullName: 'נועם כהן',
  email: 'noam.cohen@ofek-scouts.org.il',
  shevet: 'ofek',
  shevetName: 'שבט אופק',
  gdud: 'גדוד יונתן',
  patrol: 'קבוצת נשר',
  layer: 'chet',
  layerName: 'ח׳ - נעורים',
  avatarUrl:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBOocxAeW088iNI7lMsO5LU3rhluu_Gs0z6k35ya3IAux6C7HwjZl7ovwWEkyG--uodsO3OWoyMm7fTsL0a9R0iiTPjE0RMhFiQtpIdvNEh8QegZh1oYvftMCwk5VGrVUvp9Qjq1woKWRXGj43P_2O7xmsLcThaftjJ1FZyLOpkUnRpqqYpVnPEX859CJGnXgUeTGvvnoHgcwFMtGxz3ILclBRgkCqjoKuhVqQgdTlAmIyEVqAfk_Jm',
};

/**
 * 24 חניכים רשומים בקבוצה:
 * כולל את כל הכרטיסים והנתונים המדויקים מקובץ my scout html:
 * איתי שפירא (ראש צוות), מאיה כהן, דניאל גולדשטיין (דורש מעקב), שירה רוזנברג (100%), יונתן אבני ועוד.
 */
export const initialMembers: ScoutMember[] = [
  // 1. איתי שפירא (כרטיס אינטראקטיבי מורחב)
  {
    id: 'm-itay-shapira',
    firstName: 'איתי',
    lastName: 'שפירא',
    gender: 'boy',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBFiIW_ElgDmzmqgeSCSBHgGvtNWgFBcQje9soclXIFf0UCScNqmw5UNlnQlcfftC_azrQ7-wLHjuLVTvQuUix482rBxdR92gteMaJ9vSOx2_kyzCr7zHj5dH0PM396QEueyVnfVX3qUCuUGwBydt2OZOrRlSrNp3WPfGchCkdxkSWDOUZTlTEBH4dtkw2lDn3JRD6y_92fAvaLu-nSMJJui2uznwlTfklBO-4qMgkmaM7_DmjpV49s',
    role: 'ראש צוות',
    gradeClass: 'כיתה ח׳ 2 • אחראי שש-בש וציוד',
    isLeaderTeam: true,
    needsFollowUp: false,
    attendanceRate: 95,
    attendedActivities: 19,
    totalActivities: 20,
    phone: '054-000-4921',
    motherName: 'יעל שפירא',
    motherPhone: '052-8419283',
    fatherName: 'רון שפירא',
    fatherPhone: '050-3291847',
    parentName: 'יעל ורון שפירא',
    parentPhone: '052-8419283',
    allergies: 'רגישות קלה לשומשום (מצויד במזרק בתיק קבוע).',
  },

  // 2. מאיה כהן
  {
    id: 'm-maya-cohen',
    firstName: 'מאיה',
    lastName: 'כהן',
    gender: 'girl',
    role: 'חניכה',
    gradeClass: 'כיתה ח׳ 1 • גדוד אלון',
    isLeaderTeam: false,
    needsFollowUp: false,
    attendanceRate: 90,
    attendedActivities: 18,
    totalActivities: 20,
    phone: '052-000-8832',
    parentName: 'רוני כהן',
    parentPhone: '052-9876514',
    motherName: 'רוני כהן',
    motherPhone: '052-9876514',
  },

  // 3. דניאל גולדשטיין (דורש מעקב)
  {
    id: 'm-daniel-goldstein',
    firstName: 'דניאל',
    lastName: 'גולדשטיין',
    gender: 'boy',
    role: 'צוות בישול שדה',
    gradeClass: 'כיתה ח׳ 3 • צוות בישול שדה',
    isLeaderTeam: false,
    needsFollowUp: true,
    followUpReason: 'פספס 2 פעולות אחרונות',
    attendanceRate: 80,
    attendedActivities: 16,
    totalActivities: 20,
    phone: '053-456-7890',
    parentName: 'אילן גולדשטיין',
    parentPhone: '052-9876508',
    fatherName: 'אילן גולדשטיין',
    fatherPhone: '052-9876508',
  },

  // 4. שירה רוזנברג (100% מושלם)
  {
    id: 'm-shira-rosenberg',
    firstName: 'שירה',
    lastName: 'רוזנברג',
    gender: 'girl',
    avatarUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAYXaTTxmg6178CLdMlQnQj2dBr4FACATMJpbwt6Xb-WTYETs5TVTRJLNxZL_3H4W2Au0IwLhe9hkZBLkwQIUV2VPApKi7vePbBwu85d92C3kmZl2DKBVRtQVTLfeQVqITW5mxIPHhtUMoRzqe6GuHW67Sr-0d2H0Io58njeck6Oulp1QehW_i1PkNjO1wDs6pk5QWwgrmBsmKBJNROBumaK5XAicNZjhnemnoZtTHQp9KkMCWI3FKJ',
    role: 'מחסנאית שבט',
    gradeClass: 'כיתה ח׳ 2 • מחסנאית שבט',
    isLeaderTeam: true,
    needsFollowUp: false,
    attendanceRate: 100,
    attendedActivities: 20,
    totalActivities: 20,
    phone: '053-000-9123',
    parentName: 'דנה רוזנברג',
    parentPhone: '052-9876518',
    motherName: 'דנה רוזנברג',
    motherPhone: '052-9876518',
  },

  // 5. יונתן אבני
  {
    id: 'm-yonatan-avni',
    firstName: 'יונתן',
    lastName: 'אבני',
    gender: 'boy',
    role: 'אחראי מוראל וטקסים',
    gradeClass: 'כיתה ח׳ 1 • אחראי מוראל וטקסים',
    isLeaderTeam: true,
    needsFollowUp: false,
    attendanceRate: 85,
    attendedActivities: 17,
    totalActivities: 20,
    phone: '058-000-1290',
    parentName: 'שרה אבני',
    parentPhone: '052-9876503',
    motherName: 'שרה אבני',
    motherPhone: '052-9876503',
  },

  // 6. רוני שחר (צוות מוביל)
  {
    id: 'm-roni-shahar',
    firstName: 'רוני',
    lastName: 'שחר',
    gender: 'girl',
    role: 'אחראית גיבוש וחברה',
    gradeClass: 'כיתה ח׳ 2 • צוות מוביל',
    isLeaderTeam: true,
    needsFollowUp: false,
    attendanceRate: 95,
    attendedActivities: 19,
    totalActivities: 20,
    phone: '050-1234575',
    parentName: 'לימור שחר',
    parentPhone: '052-9876515',
    motherName: 'לימור שחר',
    motherPhone: '052-9876515',
  },

  // 7. תומר אלבז (דורש מעקב)
  {
    id: 'm-tomer-elbaz',
    firstName: 'תומר',
    lastName: 'אלבז',
    gender: 'boy',
    role: 'חניך',
    gradeClass: 'כיתה ח׳ 3',
    isLeaderTeam: false,
    needsFollowUp: true,
    followUpReason: 'נעדר מפעולת פתיחה ומחנה',
    attendanceRate: 75,
    attendedActivities: 15,
    totalActivities: 20,
    phone: '050-1234566',
    parentName: 'שמעון אלבז',
    parentPhone: '052-9876506',
    fatherName: 'שמעון אלבז',
    fatherPhone: '052-9876506',
  },

  // 8. אורי בן-דוד (דורש מעקב)
  {
    id: 'm-uri-bendavid',
    firstName: 'אורי',
    lastName: 'בן-דוד',
    gender: 'boy',
    role: 'חניך',
    gradeClass: 'כיתה ח׳ 1',
    isLeaderTeam: false,
    needsFollowUp: true,
    followUpReason: 'ירידה בהתייצבות בחודש האחרון',
    attendanceRate: 70,
    attendedActivities: 14,
    totalActivities: 20,
    phone: '050-1234572',
    parentName: 'אבי בן-דוד',
    parentPhone: '052-9876512',
    fatherName: 'אבי בן-דוד',
    fatherPhone: '052-9876512',
  },

  // שאר חניכי הקבוצה להשלמת 24 חניכים רשומים
  { id: 'm-yoav', firstName: 'יואב', lastName: 'אברהם', gender: 'boy', gradeClass: 'כיתה ח׳ 2', role: 'חניך', attendanceRate: 90, attendedActivities: 18, totalActivities: 20, phone: '050-1234562', parentName: 'דוד אברהם', parentPhone: '052-9876502' },
  { id: 'm-omer', firstName: 'עומר', lastName: 'ברק', gender: 'boy', gradeClass: 'כיתה ח׳ 1', role: 'חניך', attendanceRate: 90, attendedActivities: 18, totalActivities: 20, phone: '050-1234564', parentName: 'יוסי ברק', parentPhone: '052-9876504' },
  { id: 'm-alon', firstName: 'אלון', lastName: 'גולן', gender: 'boy', gradeClass: 'כיתה ח׳ 3', role: 'חניך', attendanceRate: 95, attendedActivities: 19, totalActivities: 20, phone: '050-1234565', parentName: 'רונית גולן', parentPhone: '052-9876505' },
  { id: 'm-matan', firstName: 'מתן', lastName: 'קפלן', gender: 'boy', gradeClass: 'כיתה ח׳ 2', role: 'חניך', attendanceRate: 85, attendedActivities: 17, totalActivities: 20, phone: '050-1234567', parentName: 'ענת קפלן', parentPhone: '052-9876507' },
  { id: 'm-amit', firstName: 'עמית', lastName: 'ששון', gender: 'boy', gradeClass: 'כיתה ח׳ 1', role: 'חניך', attendanceRate: 90, attendedActivities: 18, totalActivities: 20, phone: '050-1234569', parentName: 'קרן ששון', parentPhone: '052-9876509' },
  { id: 'm-guy', firstName: 'גיא', lastName: 'לביא', gender: 'boy', gradeClass: 'כיתה ח׳ 2', role: 'חניך', attendanceRate: 90, attendedActivities: 18, totalActivities: 20, phone: '050-1234570', parentName: 'משה לביא', parentPhone: '052-9876510' },
  { id: 'm-roey', firstName: 'רועי', lastName: 'אלפסי', gender: 'boy', gradeClass: 'כיתה ח׳ 3', role: 'חניך', attendanceRate: 85, attendedActivities: 17, totalActivities: 20, phone: '050-1234571', parentName: 'מירי אלפסי', parentPhone: '052-9876511' },
  { id: 'm-shahar', firstName: 'שחר', lastName: 'אדר', gender: 'boy', gradeClass: 'כיתה ח׳ 1', role: 'חניך', attendanceRate: 90, attendedActivities: 18, totalActivities: 20, phone: '050-1234573', parentName: 'גלית אדר', parentPhone: '052-9876513' },
  { id: 'm-noa', firstName: 'נועה', lastName: 'דגן', gender: 'girl', gradeClass: 'כיתה ח׳ 2', role: 'חניכה', attendanceRate: 95, attendedActivities: 19, totalActivities: 20, phone: '050-1234576', parentName: 'גל דגן', parentPhone: '052-9876516' },
  { id: 'm-lian', firstName: 'ליאן', lastName: 'שמש', gender: 'girl', gradeClass: 'כיתה ח׳ 1', role: 'חניכה', attendanceRate: 90, attendedActivities: 18, totalActivities: 20, phone: '050-1234577', parentName: 'אורלי שמש', parentPhone: '052-9876517' },
  { id: 'm-shira-m', firstName: 'שירה', lastName: 'מזרחי', gender: 'girl', gradeClass: 'כיתה ח׳ 3', role: 'חניכה', attendanceRate: 90, attendedActivities: 18, totalActivities: 20, phone: '050-1234578', parentName: 'דנה מזרחי', parentPhone: '052-9876518' },
  { id: 'm-hila', firstName: 'הילה', lastName: 'שפירא', gender: 'girl', gradeClass: 'כיתה ח׳ 2', role: 'חניכה', attendanceRate: 95, attendedActivities: 19, totalActivities: 20, phone: '050-1234579', parentName: 'תמר שפירא', parentPhone: '052-9876519' },
  { id: 'm-yael-s', firstName: 'יעל', lastName: 'שטרן', gender: 'girl', gradeClass: 'כיתה ח׳ 1', role: 'חניכה', attendanceRate: 90, attendedActivities: 18, totalActivities: 20, phone: '050-1234580', parentName: 'בני שטרן', parentPhone: '052-9876520' },
  { id: 'm-agam', firstName: 'אגם', lastName: 'ביטון', gender: 'girl', gradeClass: 'כיתה ח׳ 3', role: 'חניכה', attendanceRate: 85, attendedActivities: 17, totalActivities: 20, phone: '050-1234581', parentName: 'סיגל ביטון', parentPhone: '052-9876521' },
  { id: 'm-mia', firstName: 'מיה', lastName: 'קדוש', gender: 'girl', gradeClass: 'כיתה ח׳ 2', role: 'חניכה', attendanceRate: 90, attendedActivities: 18, totalActivities: 20, phone: '050-1234582', parentName: 'חיים קדוש', parentPhone: '052-9876522' },
  { id: 'm-adi', firstName: 'עדי', lastName: 'נבון', gender: 'girl', gradeClass: 'כיתה ח׳ 1', role: 'חניכה', attendanceRate: 95, attendedActivities: 19, totalActivities: 20, phone: '050-1234583', parentName: 'שלומית נבון', parentPhone: '052-9876523' },
  { id: 'm-talia', firstName: 'טליה', lastName: 'זוהר', gender: 'girl', gradeClass: 'כיתה ח׳ 3', role: 'חניכה', attendanceRate: 90, attendedActivities: 18, totalActivities: 20, phone: '050-1234584', parentName: 'אילנה זוהר', parentPhone: '052-9876524' },
];

/**
 * פונקציית עזר ליצירת תאריך יחסי דינמי בימים
 */
export const getRelativeDateString = (daysOffset: number, hours = 17, minutes = 30): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

/**
 * רשימת פעולות ראשוניות
 */
export const initialActivities: Activity[] = [
  {
    id: 'act-prev-1',
    title: 'פעולת פתיחת שנה וגיבוש קבוצתי 🎯',
    date: getRelativeDateString(-4, 17, 0),
    location: 'מתחם החורשה, שבט אופק',
    category: 'גיבוש ועבודת צוות',
    categoryIcon: 'groups',
    equipment: 'כדור, בריסטולים, טושים צבעוניים, רמקול למוזיקה',
    description: 'פעולת פתיחת שנת הפעילות בצופים, היכרות מעמיקה, תיאום ציפיות ויצירת אמנת קבוצה.',
    goals: [
      'היכרות מעמיקה בין חברי הקבוצה החדשים והוותיקים',
      'ניסוח אמנת קבוצה מוסכמת לשנת הפעילות',
      'יצירת אווירת שייכות וגיבוש',
    ],
    steps: [
      { title: 'מעגל פתיחה ומשחק שמות בתנועה', duration: '15 דקות', description: 'סבב שמות קצבי עם כדור וחימום צופי.' },
      { title: 'משחק גיבוש ODT - מבוך חבלים', duration: '30 דקות', description: 'מעבר קבוצתי במבוך חבלים ללא דיבור להדגשת שיתוף פעולה.' },
      { title: 'כתיבת אמנת הקבוצה', duration: '30 דקות', description: 'כל חניך חותם בטביעת אצבע צבעונית על האמנה השנתית.' },
      { title: 'מסדר סיום וחלוקת עניבות', duration: '15 דקות', description: 'סיכום הפעולה והכרזה על המורל הקבוצתי.' },
    ],
    status: 'completed',
    attendedCount: 21,
    totalExpected: 24,
    presentMemberIds: [
      'm-itay-shapira',
      'm-maya-cohen',
      'm-shira-rosenberg',
      'm-yonatan-avni',
      'm-roni-shahar',
      'm-tomer-elbaz',
      'm-uri-bendavid',
      'm-yoav',
      'm-omer',
      'm-alon',
      'm-matan',
      'm-amit',
      'm-guy',
      'm-roey',
      'm-shahar',
      'm-noa',
      'm-lian',
      'm-shira-m',
      'm-hila',
      'm-yael-s',
      'm-agam',
    ],
    absentMemberIds: [
      'm-daniel-goldstein', // דניאל גולדשטיין (פספס 2 פעולות אחרונות - דורש מעקב)
      'm-mia',
      'm-adi',
    ],
  },

  {
    id: 'act-prev-2',
    title: 'פעולת הישרדות צופית וניווט עירוני 🧭',
    date: getRelativeDateString(-11, 17, 0),
    location: 'פארק השבט, שבט אופק',
    category: 'צופיות מעשית',
    categoryIcon: 'explore',
    equipment: 'מפות טופוגרפיות, מצפנים, דפי רמזים',
    description: 'לימוד מיומנויות ניווט צופי, קריאת מפה ומציאת נקודות ציון בסביבת השבט.',
    goals: ['הבנת עקרונות המצפן והצפון המגנטי', 'עבודה בצוותי ניווט קטנים'],
    steps: [
      { title: 'הסבר תיאורטי על קריאת מפה', duration: '20 דקות', description: 'הכרת סימנים מוסכמים ומקרא מפה.' },
      { title: 'מסלול ניווט מעשי', duration: '50 דקות', description: 'מציאת 5 תחנות שונות ברחבי השבט.' },
      { title: 'סיכום ומסדר', duration: '20 דקות', description: 'בדיקת זמנים וחלוקת נקודות.' },
    ],
    status: 'completed',
    attendedCount: 21,
    totalExpected: 24,
    presentMemberIds: [
      'm-itay-shapira',
      'm-maya-cohen',
      'm-shira-rosenberg',
      'm-yonatan-avni',
      'm-roni-shahar',
      'm-tomer-elbaz',
      'm-uri-bendavid',
      'm-yoav',
      'm-omer',
      'm-alon',
      'm-matan',
      'm-amit',
      'm-guy',
      'm-roey',
      'm-shahar',
      'm-noa',
      'm-lian',
      'm-shira-m',
      'm-hila',
      'm-yael-s',
      'm-agam',
    ],
    absentMemberIds: [
      'm-daniel-goldstein', // דניאל גולדשטיין (פספס 2 פעולות אחרונות - דורש מעקב)
      'm-mia',
      'm-adi',
    ],
  },

  // הפעולה הקרובה ביותר בלו״ז (התאמה מדויקת לצילום המסך של my activities.html)
  {
    id: 'act-mutual-responsibility',
    title: 'פעולת ערבות הדדית ומנהיגות צעירה',
    date: getRelativeDateString(1, 16, 30),
    location: 'רחבת התורן, שבט אופק',
    category: 'ערכים ומנהיגות',
    categoryIcon: 'flag',
    equipment: 'סרטי סימון מוכנים • חבל ציוד קל (חבלים ובדי יוטה)',
    description: 'פעולה ערכית וחווייתית העוסקת באחריות קבוצתית, ערבות הדדית ומנהיגות צעירה של חניכי שכבת ח׳.',
    goals: [
      'פיתוח ערבות הדדית ותמיכה בין חברי הקבוצה',
      'התנסות בהובלת משימות שטח בצוותים קטנים',
      'הבנת תפקיד המנהיג הצופי בקבוצה',
    ],
    steps: [
      {
        title: 'פתיחה ומשחק שרשרת אמון',
        duration: '15 דקות',
        description: 'משחק חימום בתנועה הממחיש תלות הדדית ושיתוף פעולה.',
      },
      {
        title: 'משימת שטח קבוצתית: חציית הנהר',
        duration: '40 דקות',
        description: 'מעבר שטח בעזרת חבלים וקורות עץ ללא נגיעה בקרקע.',
      },
      {
        title: 'דיון ערכי וסיפור מנהיגות',
        duration: '25 דקות',
        description: 'שיחה קבוצתית על חשיבות התמיכה בחבר שמתקשה.',
      },
      {
        title: 'מסדר סיום ומוראל גדודי',
        duration: '15 דקות',
        description: 'הנפת דגל השבט, סיכום נקודות לשיפור ומוראל סיום.',
      },
    ],
    status: 'scheduled',
  },

  {
    id: 'act-upcoming-next',
    title: 'פעולת אש ובישול צופי 🪵🔥',
    date: getRelativeDateString(2, 17, 30),
    location: 'מתחם החורשה, שבט אופק',
    category: 'צופיות מעשית',
    categoryIcon: 'local_fire_department',
    equipment: 'קרשים יבשים, מקלות דקים, כירות שדה, תפוחי אדמה, נייר כסף ומלח גס.',
    description: 'התנסות מעשית בבניית מדורת שדה תקנית, הדלקת אש בטוחה ובישול צופי טעים עם החניכים.',
    goals: [
      'הכרת סוגי מבני מדורות צופיות (כוכב, פירמידה, שוקת)',
      'הקפדה על כללי בטיחות באש, מים וחול מוכנים מראש',
      'שיתוף פעולה בחלוקת משימות לבישול השדה',
    ],
    steps: [
      {
        title: 'פתיחה ומסדר בטיחות באש',
        duration: '15 דקות',
        description: 'תדריך בטיחות קפדני, גידור מתחם האש, הכנת דליי חול ומים.',
      },
      {
        title: 'איסוף חומרי בערה ובניית מדורה',
        duration: '25 דקות',
        description: 'חלוקה לצוותי איסוף קרשים יבשים, בניית מבנה פירמידה בטוח.',
      },
      {
        title: 'הדלקת האש והכנת תפוחי האדמה',
        duration: '35 דקות',
        description: 'עטיפת תפוחי אדמה בנייר כסף והנחתם בגחלים.',
      },
      {
        title: 'אכילה משותפת וסיפור צופי סביב המדורה',
        duration: '30 דקות',
        description: 'שיחת גיבוש, מורל וסיפור ערכי על מנהיגות צופית.',
      },
      {
        title: 'כיבוי מוחלט של האש, ניקוי השטח ומסדר סיום',
        duration: '15 דקות',
        description: 'הרטבה כפולה של הגחלים, החזרת אבנים ומסדר גדודי.',
      },
    ],
    status: 'scheduled',
  },

  {
    id: 'act-plan-2',
    title: 'פעולת מנהיגות ודמוקרטיה בצופים ⚖️',
    date: getRelativeDateString(6, 17, 0),
    location: 'חדר הדרכה 3, שבט אופק',
    category: 'ערכים ומנהיגות',
    categoryIcon: 'balance',
    equipment: 'קלפי, פתקי הצבעה, כרטיסיות דילמה מוסרית',
    description: 'סימולציית בחירות וקבלת החלטות דמוקרטית בקבוצה.',
    goals: ['הבנת חשיבות ההקשבה לדעות שונות', 'קבלת החלטות קבוצתית'],
    steps: [
      { title: 'משחק הדילמות', duration: '30 דקות', description: 'דיון בקבוצות על מקרי מבחן יומיומיים.' },
      { title: 'סימולציית בחירות לקפטן שבועי', duration: '40 דקות', description: 'הצגת מצעים והצבעה חשאית.' },
      { title: 'סיכום ומסקנות', duration: '20 דקות', description: 'הפקת לקחים משותפת.' },
    ],
    status: 'scheduled',
  },

  {
    id: 'act-plan-3',
    title: 'סדנת קשרים וכפיתות מתקדמות 🪢',
    date: getRelativeDateString(9, 17, 0),
    location: 'רחבת הכפיתות, שבט אופק',
    category: 'צופיות מעשית',
    categoryIcon: 'handyman',
    equipment: 'חבלי כפיתה, סנדות עץ, מטר מדידה',
    description: 'לימוד קשר בוהן, קשר הצלה וכפיתה מרובעת לבניית מבנה שדה.',
    goals: ['שליטה ב-3 קשרים צופיים בסיסיים', 'בניית שער מחנה קבוצתי'],
    steps: [
      { title: 'תרגול קשרים בודדים', duration: '25 דקות', description: 'עבודה אישית בזוגות עם חבלים.' },
      { title: 'בניית שער קבוצתי', duration: '50 דקות', description: 'כפיתת סנדות יחד ליצירת מתקן יציב.' },
      { title: 'בדיקת יציבות ומסדר', duration: '15 דקות', description: 'בדיקת חוזק המבנה ופירוק בטוח.' },
    ],
    status: 'scheduled',
  },

  {
    id: 'act-plan-4',
    title: 'פעולת ODT ואתגרים בטבע 🧗',
    date: getRelativeDateString(13, 17, 0),
    location: 'יער קהילתי סמוך',
    category: 'גיבוש ועבודת צוות',
    categoryIcon: 'nature_people',
    equipment: 'רצועות מתיחה, קרשים, כיסויי עיניים',
    description: 'סדרת משימות אתגר שטח המפתחות אמון הדדי והובלה.',
    goals: ['חיזוק האמון בין החניכים', 'התנסות בהובלת צוות'],
    steps: [
      { title: 'הולכת עיוורים בשטח', duration: '30 דקות', description: 'הובלת בן זוג בעצימת עיניים.' },
      { title: 'מעבר שדה מוקשים דמיוני', duration: '45 דקות', description: 'תכנון אסטרטגיה קבוצתית.' },
      { title: 'מעגל שיתוף רגשות', duration: '25 דקות', description: 'שיחה על תחושות ביטחון ואחריות.' },
    ],
    status: 'scheduled',
  },

  {
    id: 'act-plan-5',
    title: 'פעולת שדאות והסוואה בשטח 🍃',
    date: getRelativeDateString(16, 17, 30),
    location: 'הוואדי הירוק, שבט אופק',
    category: 'צופיות מעשית',
    categoryIcon: 'forest',
    equipment: 'צבעי פנים, רשתות הסוואה, פנסים',
    description: 'מיומנויות תנועה שקטה בשטח, הסתתרות והתמזגות בסביבה הטבעית.',
    goals: ['הכרת עקרונות ההסוואה', 'הקשבה לרחשי הטבע'],
    steps: [
      { title: 'הסוואה אישית', duration: '25 דקות', description: 'שימוש בעלים, צבעי פנים ובוץ.' },
      { title: 'משחק הדגל הלילי', duration: '50 דקות', description: 'תנועה חרישית לתפיסת דגל היריב.' },
      { title: 'סיכום מסדר אורות', duration: '15 דקות', description: 'שיחה על חשיבות השמירה על הטבע.' },
    ],
    status: 'scheduled',
  },

  {
    id: 'act-plan-6',
    title: 'ערב תרבות ומסורת צופית ⛺',
    date: getRelativeDateString(20, 18, 0),
    location: 'מועדון הגדוד, שבט אופק',
    category: 'ערכים ומנהיגות',
    categoryIcon: 'diversity_3',
    equipment: 'שירונים, גיטרה, שתייה חמה, עוגיות',
    description: 'ערב מסביב לאש השבטית, שירי תנועה, סיפורי עבר וחידון מורשת צופית.',
    goals: ['חיבור למורשת תנועת הצופים', 'חיזוק הגאווה השבטית'],
    steps: [
      { title: 'חידון טריוויה צופי', duration: '30 דקות', description: 'שאלות על תולדות התנועה והשבט.' },
      { title: 'שירה בציבור ומורלים', duration: '40 דקות', description: 'לימוד המנון השבט ושירי צופים מסורתיים.' },
      { title: 'חלוקת תגי משימה', duration: '20 דקות', description: 'הענקת אותות הערכה לחניכים מתמידים.' },
    ],
    status: 'scheduled',
  },
];

/**
 * מאגר טיפים צופיים שבועיים המתחלפים לפי שבוע השנה
 */
export const weeklyScoutTips: string[] = [
  'בפעולת אש: תמיד החזיקו דלי חול ודלי מים מוכנים במרחק 2 מטרים מהמוקד!',
  'כפיתה חזקה מתחילה בקשר מוט הדוק – אל תוותרו על מתיחה טובה של החבל.',
  'תכנון פעולה מנצח מבוסס תמיד על משחק פתיחה קצבי, שיא מעשי ומעגל סיכום מעצים.',
  'חניך שמתקשה להתרכז? תנו לו תפקיד הובלה מעשי בשטח (איסוף עצים, חלוקת ציוד).',
  'בטיחות לפני הכל: סרקו תמיד את שטח הפעולה 10 דקות לפני הגעת החניכים.',
  'הערכה אישית שווה זהב: בסוף כל פעולה החמיאו לחניך אחד באופן אישי על מאמץ שביצע.',
  'שמרו תמיד על עקרון "לא משאירים עקבות" (Leave No Trace) – השטח נשאר נקי יותר מאיך שמצאתם אותו.',
];

/**
 * התראות פעילות למדריך
 */
export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'הפעולה הקרובה מתקרבת! 🔥',
    message: 'פעולת אש ובישול צופי מתוכננת ליום שלישי הקרוב ב-17:30. ודאו שהציוד מוכן.',
    date: 'היום, 08:00',
    read: false,
    type: 'activity',
  },
  {
    id: 'notif-2',
    title: 'תזכורת בטיחות',
    message: 'יש לבדוק אישורי הורים ומילוי הצהרות בריאות לכל חניכי הקבוצה.',
    date: 'אתמול, 16:30',
    read: false,
    type: 'reminder',
  },
  {
    id: 'notif-3',
    title: 'עדכון נוכחות מהפעולה הקודמת',
    message: 'נרשמה נוכחות מרשימה של 87.5% בפעולת הגיבוש הקודמת! כל הכבוד.',
    date: 'לפני 3 ימים',
    read: true,
    type: 'system',
  },
];

/**
 * בנק רעיונות לפעולות צופיות (Scout Activity Ideas Library)
 * מאגר עשיר ומגוון התואם במדויק לקובץ activity ideas.html ומכיל פעולות מלאות
 */
export const activityIdeas: ActivityIdea[] = [
  // 1. כרטיס מוביל ראשי (Featured Card עם תמונה גדולה) מתוך activity ideas.html
  {
    id: 'idea-treasure-hunt',
    title: 'חפש את המטמון הצופי: פענוח צפנים ומורס 🧭',
    category: 'פעולות שטח ומחנאות',
    categoryIcon: 'forest',
    iconBg: 'bg-[#DCE3D3]',
    iconColor: 'text-[#8B7355]',
    isFeatured: true,
    ratingNotice: 'מומלץ החודש בשבט • 98% משוב חיובי',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCjJV7Ks1lBxZsVrildtQmND3MWx97C2xPK5Wb4GnRtdBjv-6-yQZ7wa8fmKYAofAbZ4tWHu2EI3JIHNXk1iVeTwmnyu6MBXXWj2ZIAAOzhBly8np7tfJke5fqbUlcWC1qkOYSQ7oWLeZaS9plLGPGrriiwnifd5Y8P9WheQaJ-cp6h_d1k73te1frFWPeJQNhgNkqmmTf-1ts9gCBVerH7cNVCtmXx3haBaqpO0SbyFnqr6gMATXQT',
    ageGroup: 'ד׳-ו׳ • ח׳ ומעלה',
    duration: '60 דקות',
    groupSize: '15-30 חניכים',
    location: 'חורשה/שבט',
    description:
      'פעולת שטח אינטראקטיבית הכוללת פתרון כתבי סתרים, קשירות סנאדה צופית ומציאת תחנות ניווט ברחבי היער/השבט.',
    equipment: 'חבלי שדה, כתבי סתרים מנויילנים, מפת השבט, פנסים, תיבת אוצר עם מנעול 4 ספרות',
    author: 'נועם י.',
    socialProof: 'נוצר ע״י נועם י. • 98% משוב חיובי',
    goals: [
      'לימוד עקרונות פענוח צפנים (קוד מורס, כתב אתב״ש)',
      'שכלול מיומנויות התמצאות וניווט שטח',
      'עבודת צוות שיתופית וחלוקת תפקידים בצוות',
    ],
    steps: [
      {
        title: 'פתיחה וסיפור מסגרת',
        duration: '10 דק׳',
        description: 'מכתב מוצפן מגנרל הצופים האבוד שנמצא בתוך בקבוק עתיק.',
      },
      {
        title: 'מסלול תחנות המשימה',
        duration: '35 דק׳',
        description:
          '4 תחנות: קשר הצלה, כתב אתב״ש, קוד מורס עם פנסים, ומשחק שיווי משקל צוותי.',
      },
      {
        title: 'פיצוח תיבת האוצר ומסדר סיכום',
        duration: '15 דק׳',
        description: 'חיבור כל הרמזים לקוד מנעול 4 ספרות ומציאת תעודות סייר מוסמך.',
      },
    ],
  },

  // 2. כרטיס 2 מתוך activity ideas.html
  {
    id: 'idea-human-board-game',
    title: 'משחק הלוח האנושי - גיבוש ושיתוף פעולה 🎲',
    category: 'פעולות גיבוש',
    categoryIcon: 'sports_esports',
    iconBg: 'bg-[#fcdeb6]',
    iconColor: 'text-[#271902]',
    ageGroup: 'כל שכבות הגיל',
    duration: '45 דק׳',
    groupSize: '12-25 חניכים',
    location: 'רחבת השבט / אולם פנימי',
    description:
      'מסלול ענק שבו החניכים הם כלי המשחק, וכל משבצת דורשת משימה קבוצתית משותפת ומצחיקה. מתאים במיוחד לפתיחת שנה ואיחוד קבוצה.',
    equipment: 'קוביות ענק מספוג, לוחות משימה מבריסטול, מסקינגטייפ צבעוני, כרטיסי שאלות',
    socialProof: '42 מדריכים שמרו השבוע',
    goals: [
      'היכרות חווייתית ואינטימית בין חברי הקבוצה',
      'שבירת מחסומים אישיים דרך הומור ומשחק',
      'הבנת חשיבות התמיכה והפרגון ההדדי',
    ],
    steps: [
      {
        title: 'הסבר החוקים וחלוקה לקבוצות צבע',
        duration: '10 דק׳',
        description: 'הטלת קובייה וקביעת סדר המהלכים על הלוח האנושי.',
      },
      {
        title: 'מהלך המשחק ומשימות השטח',
        duration: '25 דק׳',
        description: 'מעבר בין 20 משבצות אתגר: בניית מגדל אנושי, שירת מורל בלי מילים, חידון שמות.',
      },
      {
        title: 'סיום משותף ושיחת עיבוד',
        duration: '10 דק׳',
        description: 'הגעה לקו הסיום ביחד ושיחה על שיתוף הפעולה.',
      },
    ],
  },

  // 3. כרטיס 3 מתוך activity ideas.html
  {
    id: 'idea-moral-compass',
    title: 'דילמת המצפן המוסרי: פעולת ערכים וקבלת החלטות ⚖️',
    category: 'פעולות ערכיות',
    categoryIcon: 'balance',
    iconBg: 'bg-[#DCE3D3]',
    iconColor: 'text-[#715b3e]',
    ageGroup: 'ערכית • ח׳-ט׳',
    duration: '50 דק׳',
    groupSize: '10-20 חניכים',
    location: 'מועדון הגדוד / מעגל דשא',
    description:
      'משחק תפקידים סוחף המדמה הישרדות באי בודד וקבלת החלטות קהילתיות דמוקרטיות. מעורר חשיבה ביקורתית והקשבה הדדית.',
    equipment: 'כרטיסי דילמה מוסרית, דפי הצבעה, לוח מחיק וטושים, חבלי סימון',
    socialProof: 'מאושר ע״י הנהגת השבט',
    goals: [
      'פיתוח חשיבה מוסרית וביקורתית מול דילמות חברתיות',
      'התנסות בקבלת החלטות בקבוצה תוך כיבוד עמדות מיעוט',
      'הבנת הקשר בין ערכי הצופים לחיי היומיום',
    ],
    steps: [
      {
        title: 'סיפור פתיחה: הספינה הטובעת',
        duration: '15 דק׳',
        description: 'הצגת מקרה המבחן: מי יזכה לעלות על סירת ההצלה האחרונה?',
      },
      {
        title: 'דיון בצוותים וטיעונים מנומקים',
        duration: '25 דק׳',
        description: 'כל צוות מקבל תפקיד ומגן על עמדתו בפני מליאת הקבוצה.',
      },
      {
        title: 'סיכום ערכי והשלכה לחיים',
        duration: '10 דק׳',
        description: 'מעגל שיח על ערבות הדדית ומנהיגות מוסרית.',
      },
    ],
  },

  // 4. מבוך החבלים העיוור (משחקי חברה ו-O.D.T)
  {
    id: 'idea-blind-maze',
    title: 'מבוך החבלים העיוור - מסע אמון קבוצתי 🧗',
    category: 'משחקי חברה ו-O.D.T',
    categoryIcon: 'psychology',
    iconBg: 'bg-[#eee1cc]',
    iconColor: 'text-[#6c6353]',
    ageGroup: 'שכבות ה׳–ח׳',
    duration: '45 דק׳',
    groupSize: '12-24 חניכים',
    location: 'חורשת השבט',
    description:
      'משימת ODT מאתגרת שבה החניכים עוברים במבוך חבלים סבוך בעיניים מכוסות, כשהם מונחים רק על ידי שותפיהם. תרגיל אמון רב-עוצמה.',
    equipment: '50 מטר חבל שדה, 15 כיסויי עיניים מבד, עצי חורשה כעוגנים',
    socialProof: '58 מדריכים שמרו השבוע',
    goals: [
      'בניית אמון עמוק בין החניכים',
      'שיפור מיומנויות תקשורת והקשבה ללא שפה חזותית',
      'התמודדות עם חוסר ודאות ופחד בעזרת הקבוצה',
    ],
    steps: [
      {
        title: 'חימום אמון בזוגות',
        duration: '10 דק׳',
        description: 'תרגיל "נפילה לאחור" והליכת עיוור בליווי מגע יד בלבד.',
      },
      {
        title: 'חציית מבוך החבלים',
        duration: '25 דק׳',
        description: 'הובלה קולית מתוזמנת דרך המבוך ללא נגיעה בחבלי הגבול.',
      },
      {
        title: 'עיבוד חוויות ומעגל פריקה',
        duration: '10 דק׳',
        description: 'שיתוף רגשות על תחושת התלות במוביל והאחריות כמוביל.',
      },
    ],
  },

  // 5. סדנת כפיתות ומבנה צופי
  {
    id: 'idea-pioneering',
    title: 'סדנת סיירות, כפיתות ובניית מגדל תצפית 🪵',
    category: 'פעולות שטח ומחנאות',
    categoryIcon: 'handyman',
    iconBg: 'bg-[#DCE3D3]',
    iconColor: 'text-[#383428]',
    ageGroup: 'שכבות ז׳–ט׳',
    duration: '90 דק׳',
    groupSize: '10-25 חניכים',
    location: 'רחבת הכפיתות של השבט',
    description:
      'התנסות מעשית בכפיתה מרובעת, מוצלבת וכפיתת חצובה. בניית מגדל צופי יציב ומסדר הנפת דגל גדודי בראש המתקן.',
    equipment: 'סנדות עץ (3 מטר), חבלי כפיתה 6 מ״מ, מטר מדידה, כפפות עבודה, דגל השבט',
    socialProof: 'מומלץ למחנה פסח וקיץ',
    goals: [
      'שליטה מקצועית בשלושת סוגי הכפיתות הצופיות',
      'הבנת עקרונות פיזיקליים של יציבות וחלוקת משקל במבנה',
      'עבודת צוות הדוקה וחלוקת תפקידי שטח',
    ],
    steps: [
      {
        title: 'רענון קשרים ותרגול כפיתות יבשות',
        duration: '20 דק׳',
        description: 'הדגמה של קשר מוט וכפיתה מרובעת מהודקת.',
      },
      {
        title: 'בנייה צוותית של מגדל החצובה',
        duration: '50 דק׳',
        description: 'הרמת רגלי המבנה, חיזוק קורות הרוחב ובדיקת יציבות.',
      },
      {
        title: 'הנפת הדגל ומסדר בטיחות',
        duration: '20 דק׳',
        description: 'טקס הנפת דגל, פירוק בטיחותי ואיסוף ציוד מסודר.',
      },
    ],
  },

  // 6. חדר בריחה צופי
  {
    id: 'idea-escape-room',
    title: 'הבריחה ממתחם השבט - חדר בריחה צופי 🗝️',
    category: 'פעולות גיבוש',
    categoryIcon: 'lock_open',
    iconBg: 'bg-[#eee1cc]',
    iconColor: 'text-[#705b3b]',
    ageGroup: 'שכבות ד׳–ח׳',
    duration: '60 דק׳',
    groupSize: '12-20 חניכים',
    location: 'חדר הדרכה או מחסן השבט',
    description:
      'חדר בריחה מלא חידות צופיות, מנעולים, רמזים מוחבאים ואתגר זמן. כדי להימלט, הקבוצה חייבת לפעול בהרמוניה מושלמת.',
    equipment: 'מנעולי מספרים, תיבות נעולות, פנס UV וטוש בלתי נראה, רמזי נייר מעוצבים',
    socialProof: '36 מדריכים שמרו השבוע',
    goals: [
      'חשיבה יצירתית ופתרון בעיות תחת לחץ זמן',
      'חיזוק תחושת ההישג המשותף של כל חברי הקבוצה',
      'העצמת חניכים שקטים דרך חידות היגיון שונות',
    ],
    steps: [
      {
        title: 'נעילת החדר והשמעת הודעת חירום',
        duration: '10 דק׳',
        description: 'הקלטה קולית דרמטית המציבה את מטרת החדר ומגבלת 45 הדקות.',
      },
      {
        title: 'חיפוש רמזים ופיצוח המנעולים',
        duration: '40 דק׳',
        description: 'פתיחת 3 תיבות ברצף: מפת קודים, פאזל סמלים צופיים ומפתח יציאה.',
      },
      {
        title: 'יציאה לחופשי ומוראל ניצחון',
        duration: '10 דק׳',
        description: 'פיצוח הקוד האחרון, פתיחת הדלת ומוראל גדודי סוחף.',
      },
    ],
  },

  // 7. בישול צופי ללא כלים
  {
    id: 'idea-cooking-fire',
    title: 'בישול צופי ללא כלים: פיתות סאג׳ ותפוחי אדמה 🪵🔥',
    category: 'פעולות שטח ומחנאות',
    categoryIcon: 'local_fire_department',
    iconBg: 'bg-[#fcdeb6]',
    iconColor: 'text-[#705b3b]',
    ageGroup: 'שכבות ו׳–ט׳',
    duration: '90 דק׳',
    groupSize: '15-25 חניכים',
    location: 'מתחם מדורות השבט',
    description:
      'הדלקת אש בטוחה בשיטת הפירמידה, הכנת בצק פיתות שדה, אפייה על סאג׳ רותח ובישול תפוחי אדמה במעטפת גחלים.',
    equipment: 'קמח, שמרים, שמן זית, מלח, סאג׳ ברזל, דליי מים וחול, עצים יבשים, נייר כסף',
    socialProof: 'דירוג 4.9 כוכבים מקרב מדריכי השבט',
    goals: [
      'הקפדה מוחלטת על כללי בטיחות באש צופית',
      'עצמאות קולינרית בשטח ללא אמצעים ביתיים',
      'חלוקת תפקידים: צוות בצק, צוות אש, צוות ניקיון',
    ],
    steps: [
      {
        title: 'תדריך בטיחות והקמת מתחם אש מגודר',
        duration: '20 דק׳',
        description: 'הצבת דליי מים וחול, איסוף זרדים ובניית מוקד פירמידה בטוח.',
      },
      {
        title: 'לישת הבצק והדלקת המוקד',
        duration: '40 דק׳',
        description: 'הכנת כדורי בצק, רידוד על שולחן שדה ואפייה מהירה על הסאג׳.',
      },
      {
        title: 'ארוחה קבוצתית משותפת וכיבוי מוחלט',
        duration: '30 דק׳',
        description: 'מריחת שוקולד ולבנה, סבב שיתוף וכיבוי יסודי של האש.',
      },
    ],
  },

  // 8. מנהיגות ועמידה מול קהל
  {
    id: 'idea-public-speaking',
    title: 'מנהיגות בעולם משתנה: לעמוד מול קהל ולהוביל 🧭',
    category: 'מנהיגות ואחריות',
    categoryIcon: 'campaign',
    iconBg: 'bg-[#DCE3D3]',
    iconColor: 'text-[#715b3e]',
    ageGroup: 'שכבות ח׳–ט׳',
    duration: '55 דק׳',
    groupSize: '10-18 חניכים',
    location: 'מועדון השבט',
    description:
      'סדנת עמידה מול קהל, שפת גוף, נאומים בני דקה ומנהיגות אישית. מעניקה לחניכי השכבה הבוגרת ביטחון להוביל פעילות בעצמם.',
    equipment: 'מיקרופון דמה, קלפי משימה עם נושאי נאום אקראיים, סטופר, כרטיסיות משוב',
    socialProof: 'פעולת חובה לשכבת ט׳ לקראת הדרכה',
    goals: [
      'התגברות על פחד קהל וחיזוק הדימוי העצמי',
      'לימוד עקרונות שפת גוף, קשר עין ואינטונציה נכונה',
      'הקניית כלים למשוב עמיתים חיובי ומקדם',
    ],
    steps: [
      {
        title: 'משחק חימום: נאום הג׳יבריש',
        duration: '15 דק׳',
        description: 'כל חניך נואם בשפה מומצאת תוך שימוש בהבעות פנים דרמטיות.',
      },
      {
        title: 'אתגר 60 השניות',
        duration: '25 דק׳',
        description: 'הגרלת נושא מצחיק ונאום מנומק של דקה מול כל הקבוצה.',
      },
      {
        title: 'מעגל משוב הדדי וחיזוקים',
        duration: '15 דק׳',
        description: 'כל חניך מקבל פתק משוב מחמם לב מחבר לקבוצה.',
      },
    ],
  },

  // 9. יצירה צופית ועיצוב דגלים
  {
    id: 'idea-scout-art',
    title: 'סדנת עיצוב שלטי שבט, מוראל וציורי יוטה 🎨',
    category: 'פעולות יצירה',
    categoryIcon: 'palette',
    iconBg: 'bg-[#ffdada]',
    iconColor: 'text-[#ba1a1a]',
    ageGroup: 'שכבות ד׳–ז׳',
    duration: '60 דק׳',
    groupSize: '15-25 חניכים',
    location: 'רחבת היצירה / מחסן',
    description:
      'עיצוב דגלי גדוד ייחודיים על גבי בדי יוטה, שימוש בשבלונות טבעיות, טושים עמידים וצבעי שדה לעיטור פינת הקבוצה בשבט.',
    equipment: 'בדי יוטה 1x1 מטר, צבעי גואש עמידים, ספוגים, שבלונות סמלי צופים, חבלי תלייה',
    socialProof: 'תוצר שנשאר איתנו כל השנה!',
    goals: [
      'עידוד יצירתיות וביטוי עצמי של חברי הקבוצה',
      'חיזוק תחושת הגאווה והשייכות לגדוד',
      'יצירת תוצר פיזי מתמשך שילווה את הקבוצה כל השנה',
    ],
    steps: [
      {
        title: 'סיעור מוחות וסקיצה קבוצתית',
        duration: '15 דק׳',
        description: 'בחירת סמל הקבוצה, משפט מפתח ומוראל שיופיע על הדגל.',
      },
      {
        title: 'צביעה, הטבעות ועיטור היריעה',
        duration: '35 דק׳',
        description: 'עבודה בצוותים קטנים על צביעת הרקע, האותיות והאיורים.',
      },
      {
        title: 'תליית הדגל בפינת הגדוד ומסדר כבוד',
        duration: '10 דק׳',
        description: 'קשירת הדגל לסנדה בעזרת קשר בוהן והשמעת מוראל סיום.',
      },
    ],
  },

  // 10. ניווט אסטרונומי וכוכבים
  {
    id: 'idea-stars-navigation',
    title: 'כוכבים וניווט לילי: התמצאות בשמי הארץ 🌌',
    category: 'פעולות שטח ומחנאות',
    categoryIcon: 'explore',
    iconBg: 'bg-[#eee1cc]',
    iconColor: 'text-[#271902]',
    ageGroup: 'שכבות ז׳–ט׳',
    duration: '75 דק׳',
    groupSize: '12-24 חניכים',
    location: 'שטח פתוח חשוך סמוך לשבט',
    description:
      'גילוי כוכב הצפון, מערכת הדובה הגדולה וקסיופאה. לימוד הליכת שטח ללא תאורה והבנת חשיבות התאמת העין לחושך.',
    equipment: 'מפת שמיים מסתובבת, מצפנים, מחצלות ישיבה, תה חם בטרמוס',
    socialProof: 'חוויה בלתי נשכחת לכל הקבוצה',
    goals: [
      'הכרת גרמי השמיים והתמצאות לפי כוכב הצפון',
      'פיתוח תחושת ביטחון ושלווה בשטח פתוח בלילה',
      'חיבור חווייתי ושקט לטבע',
    ],
    steps: [
      {
        title: 'התרגלות לחשכת הלילה וכיבוי פנסים',
        duration: '15 דק׳',
        description: 'הסבר על ראיית לילה של העין ותרגיל שמיעה חרישית.',
      },
      {
        title: 'איתור כוכב הצפון וקבוצות כוכבים',
        duration: '35 דק׳',
        description: 'מתיחת קו דמיוני משתי כוכבי הדובה הגדולה אל פולאריס.',
      },
      {
        title: 'סיפור כוכבים מיתולוגי ותה חם',
        duration: '25 דק׳',
        description: 'מעגל ישיבה סביב תה צמחים וסיפור על מקור המזלות.',
      },
    ],
  },

  // 11. אולימפיאדת משחקי תנועה
  {
    id: 'idea-olympics',
    title: 'אולימפיאדת משחקי תנועה ושדה היתוליים 🏆',
    category: 'משחקי חברה ו-O.D.T',
    categoryIcon: 'emoji_events',
    iconBg: 'bg-[#fcdeb6]',
    iconColor: 'text-[#705b3b]',
    ageGroup: 'שכבות ד׳–ו׳',
    duration: '60 דק׳',
    groupSize: '15-30 חניכים',
    location: 'מגרש הדשא של השבט',
    description:
      'תחרות ספורטיבית היתולית: מרוץ שקים, הליכה על קביים צופיים, משיכת חבל ומסלול מכשולים קצבי מלא צחוק.',
    equipment: 'שקי יוטה, חבל משיכה עבה, קונוסים, שריקות, מדליות שוקולד',
    socialProof: 'מתאים במיוחד לפעולות שבת',
    goals: [
      'פריקת אנרגיה חיובית ותנועה גופנית בריאה',
      'עידוד ספורטיביות, הוגנות ופרגון לקבוצה היריבה',
      'שיתוף כל חניך ללא קשר לרמת כושר גופני',
    ],
    steps: [
      {
        title: 'טקס פתיחה אולימפי והשבעת ספורטאים',
        duration: '10 דק׳',
        description: 'הדלקת לפיד דמה ומוראל קבוצתי קצבי.',
      },
      {
        title: 'מקצי התחרות ההיתוליים',
        duration: '40 דק׳',
        description: 'מרוץ שקים זוגי, משיכת חבל צוותית ומסלול מכשולים.',
      },
      {
        title: 'טקס חלוקת מדליות שוקולד',
        duration: '10 דק׳',
        description: 'הענקת פרס "הקבוצה ההוגנת ביותר" ומסדר סיום.',
      },
    ],
  },

  // 12. מעורבות קהילתית
  {
    id: 'idea-giveback',
    title: 'צופים למען הקהילה: מבצע חסד ונתינה שכונתית 🤝',
    category: 'פעולות ערכיות',
    categoryIcon: 'volunteer_activism',
    iconBg: 'bg-[#DCE3D3]',
    iconColor: 'text-[#715b3e]',
    ageGroup: 'שכבות ו׳–ט׳',
    duration: '70 דק׳',
    groupSize: '12-25 חניכים',
    location: 'מרכז הקהילתי או רחובות השכונה',
    description:
      'חלוקת עציצים קטנים עם פתקי ברכה לתושבי השכונה ולקשישים, ניקיון שטח ציבורי והפצת טוב סביבתי.',
    equipment: 'עציצים קטנים, ניירות ברכה מעוצבים, כפפות חד-פעמיות, שקיות אשפה גדולות',
    socialProof: 'התקבלו מכתבי תודה מרגשים מתושבי השכונה',
    goals: [
      'חיזוק ערך הנתינה והמעורבות החברתית בקהילה',
      'חיבור חם בין השבט הצופי לתושבי השכונה הוותיקים',
      'הפנמת העיקרון הצופי "מעשה טוב אחד בכל יום"',
    ],
    steps: [
      {
        title: 'כתיבת ברכות וקישוט העציצים',
        duration: '20 דק׳',
        description: 'כל זוג חניכים כותב מכתב אישי ומחמם לב לתושב.',
      },
      {
        title: 'סיור בשכונה וחלוקה אישית',
        duration: '40 דק׳',
        description: 'מפגש מרגש עם שכנים, הענקת העציץ ושיחה קצרה.',
      },
      {
        title: 'שיחת סיכום: כוחו של חיוך קטן',
        duration: '10 דק׳',
        description: 'שיתוף ברשמים מהמפגשים והבנת משמעות הנתינה.',
      },
    ],
  },
];
