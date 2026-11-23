import { useState, useMemo, useEffect } from 'react';
import type { ActivityIdea, Activity, UserProfile, NotificationItem } from '../types';
import { activityIdeas } from '../data/mockData';
import { getFavoriteIdeaIds, saveFavoriteIdeaIds } from '../services/storage';
import ProfileModal from './ProfileModal';
import NotificationsModal from './NotificationsModal';
import MyTroopLogo from './MyTroopLogo';

interface IdeasBankScreenProps {
  user: UserProfile;
  notifications?: NotificationItem[];
  onBackToDashboard: () => void;
  onNavigateTab?: (tab: 'dashboard' | 'members' | 'activities' | 'ideas') => void;
  onAddActivity?: (newAct: Activity) => void;
  onSaveProfile?: (updated: UserProfile) => void;
  onLogout?: () => void;
}

type CategoryType =
  | 'all'
  | 'פעולות גיבוש'
  | 'פעולות ערכיות'
  | 'משחקי חברה ו-O.D.T'
  | 'פעולות שטח ומחנאות'
  | 'פעולות יצירה'
  | 'מנהיגות ואחריות'
  | 'favorites';

/**
 * קומפוננטת "בנק רעיונות לפעולות" (MyTroop – Activity Ideas Screen)
 * שחזור מדויק ומלא של קובץ activity ideas.html מתוך Google Stitch:
 * - כותרת וסרגל ניווט עליון עם לוגו MyTroop הרשמי ופרופיל
 * - חיפוש חכם וסינון מהיר לפי קטגוריות בגלילה אופקית
 * - כרטיס ראשי (Featured) עם תמונה גדולה וכרטיסים מאוירים מגוונים
 * - סימון מועדפים נשמר ב-localStorage
 * - מודאל מגירה עולה (Slide-up Drawer) עם מערך שלם, מטרות, ציוד ושלבים
 * - אפשרות "הוספה לפעולות שלי" שיוצרת פעולה חדשה ביומן הפעולות
 * - אפשרות הורדת מערך כקובץ PDF
 */
export default function IdeasBankScreen({
  user,
  notifications = [],
  onBackToDashboard,
  onNavigateTab,
  onAddActivity,
  onSaveProfile,
  onLogout,
}: IdeasBankScreenProps) {
  // חיפוש וסינון
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>('all');
  const [durationFilter, setDurationFilter] = useState<string>('all');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // מועדפים נשמרים ב-localStorage
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getFavoriteIdeaIds());

  // מודאלים
  const [activeIdeaModal, setActiveIdeaModal] = useState<ActivityIdea | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // מודאל שיבוץ פעולה ביומן
  const [schedulingIdea, setSchedulingIdea] = useState<ActivityIdea | null>(null);
  const [scheduleDate, setScheduleDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [scheduleTime, setScheduleTime] = useState('17:00');
  const [scheduleLocation, setScheduleLocation] = useState(`שבט ${user.shevetName || 'אופק'}`);

  // פידבק הוספה והורדה
  const [addedSuccessId, setAddedSuccessId] = useState<string | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  // סנכרון מועדפים
  useEffect(() => {
    saveFavoriteIdeaIds(favoriteIds);
  }, [favoriteIds]);

  // הצגת הודעת טוסט צפה בדיוק כמו ב-activity ideas.html
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // החלפת מצב מועדף
  const handleToggleFavorite = (ideaId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavoriteIds((prev) => {
      const isFav = prev.includes(ideaId);
      if (isFav) {
        showToast('הפעולה הוסרה מהמועדפים');
        return prev.filter((id) => id !== ideaId);
      } else {
        showToast('הפעולה נשמרה במועדפים! ❤️');
        return [...prev, ideaId];
      }
    });
  };

  // פתיחת מודאל שיבוץ תאריך ושעה לפעולה
  const handleOpenScheduleModal = (idea: ActivityIdea) => {
    setSchedulingIdea(idea);
    const d = new Date();
    d.setDate(d.getDate() + 3);
    setScheduleDate(d.toISOString().split('T')[0]);
    setScheduleTime('17:00');
    setScheduleLocation(`שבט ${user.shevetName || 'אופק'}`);
  };

  // אישור שיבוץ הפעולה והוספתה ליומן תחת "פעולות קרובות"
  const handleConfirmSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingIdea || !onAddActivity) return;

    // בניית תאריך מלא ושעה
    const fullDate = new Date(`${scheduleDate}T${scheduleTime}:00`);

    const steps = schedulingIdea.steps
      ? schedulingIdea.steps.map((s) => ({
          title: s.title,
          duration: s.duration,
          description: s.description,
        }))
      : [
          { title: 'מעגל פתיחה ומוראל', duration: '15 דקות', description: 'פתיחה והסבר על מהלך הפעולה' },
          { title: 'מהלך מרכזי', duration: schedulingIdea.duration, description: schedulingIdea.description },
          { title: 'מסדר סיום', duration: '15 דקות', description: 'סיכום ומוראל סיום גדודי' },
        ];

    const newActivity: Activity = {
      id: `act-idea-${Date.now()}`,
      title: schedulingIdea.title,
      date: fullDate.toISOString(),
      location: scheduleLocation.trim() || `שבט ${user.shevetName || 'אופק'}`,
      category: schedulingIdea.category,
      categoryIcon: schedulingIdea.categoryIcon || 'lightbulb',
      equipment: schedulingIdea.equipment || 'לא נדרש ציוד מיוחד',
      description: schedulingIdea.description,
      goals:
        schedulingIdea.goals && schedulingIdea.goals.length > 0
          ? schedulingIdea.goals
          : ['גיבוש הקבוצה והעברת ערכים צופיים'],
      steps,
      status: 'scheduled',
    };

    onAddActivity(newActivity);
    setAddedSuccessId(schedulingIdea.id);
    setSchedulingIdea(null);
    setActiveIdeaModal(null);
    showToast(`הפעולה "${newActivity.title}" שובצה בהצלחה תחת 'פעולות קרובות'! 📅`);

    setTimeout(() => {
      setAddedSuccessId(null);
    }, 2500);
  };

  // סימולציית הורדת PDF למכשיר
  const handleDownloadPdf = (idea: ActivityIdea) => {
    setIsDownloadingPdf(true);
    setTimeout(() => {
      setIsDownloadingPdf(false);
      showToast('הקובץ הורד בהצלחה למכשיר 📄');

      // פתיחת חלון הדפסה מעוצב של הדפדפן עבור המערך
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html dir="rtl" lang="he">
          <head>
            <meta charset="utf-8">
            <title>${idea.title} - מערך פעולה MyTroop</title>
            <style>
              body { font-family: system-ui, -apple-system, sans-serif; padding: 30px; direction: rtl; color: #1c1c17; }
              h1 { color: #715b3e; border-bottom: 2px solid #8B7355; padding-bottom: 8px; }
              .badge { display: inline-block; background: #eee1cc; padding: 4px 10px; border-radius: 20px; font-size: 13px; margin-left: 6px; }
              .box { background: #f6f3eb; border: 1px solid #e2dacb; padding: 15px; border-radius: 12px; margin: 15px 0; }
              .step { margin-bottom: 12px; padding: 10px; background: #ffffff; border-radius: 8px; }
              .step-num { font-weight: bold; color: #8B7355; }
            </style>
          </head>
          <body>
            <h1>${idea.title}</h1>
            <div>
              <span class="badge">קטגוריה: ${idea.category}</span>
              <span class="badge">משך: ${idea.duration}</span>
              <span class="badge">שכבת גיל: ${idea.ageGroup}</span>
              <span class="badge">מיקום: ${idea.location || 'שבט אופק'}</span>
            </div>
            <div class="box">
              <h3>תיאור הפעולה</h3>
              <p>${idea.description}</p>
              <h3>ציוד דרוש ומצרכים</h3>
              <p>${idea.equipment}</p>
            </div>
            <h3>שלבי הפעולה</h3>
            ${
              idea.steps
                ? idea.steps
                    .map(
                      (s, idx) => `
              <div class="step">
                <span class="step-num">שלב ${idx + 1}: ${s.title} (${s.duration})</span>
                <p>${s.description}</p>
              </div>
            `
                    )
                    .join('')
                : '<p>אין שלבים מפורטים</p>'
            }
            <footer style="margin-top: 40px; text-align: center; font-size: 12px; color: #6E6754;">
              הופק באמצעות MyTroop - פלטפורמת ההדרכה הצופית
            </footer>
          </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
      }
    }, 1200);
  };

  // סינון רשימת הרעיונות
  const filteredIdeas = useMemo(() => {
    return activityIdeas.filter((idea) => {
      // 1. סינון קטגוריה או מועדפים
      if (selectedCategory === 'favorites') {
        if (!favoriteIds.includes(idea.id)) return false;
      } else if (selectedCategory !== 'all') {
        if (idea.category !== selectedCategory) return false;
      }

      // 2. סינון שכבת גיל מתוך מודאל המסננים
      if (ageGroupFilter !== 'all') {
        if (!idea.ageGroup.includes(ageGroupFilter)) return false;
      }

      // 3. סינון משך זמן מתוך מודאל המסננים
      if (durationFilter === 'short' && !idea.duration.includes('45')) return false;
      if (durationFilter === 'medium' && !idea.duration.includes('60')) return false;
      if (durationFilter === 'long' && !idea.duration.includes('75') && !idea.duration.includes('90')) return false;

      // 4. חיפוש חופשי
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesTitle = idea.title.toLowerCase().includes(q);
        const matchesDesc = idea.description.toLowerCase().includes(q);
        const matchesEquip = idea.equipment.toLowerCase().includes(q);
        const matchesCategory = idea.category.toLowerCase().includes(q);
        const matchesAge = idea.ageGroup.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesEquip && !matchesCategory && !matchesAge) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, favoriteIds, ageGroupFilter, durationFilter, searchQuery]);

  // ספירת התראות
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-[#F6F3EB] text-on-surface font-body-md text-body-md flex flex-col min-h-screen">
      {/* 1. Header עליון זהה לכל מסכי MyTroop עם לוגו Stitch מקורי */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#F6F3EB]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(50,46,35,0.06)] pt-safe border-b border-[#E2DACB]/60">
        <div className="h-16 px-gutter flex items-center justify-between max-w-lg mx-auto w-full">
          {/* Logo & Name - New Original MyTroop Logo */}
          <button
            onClick={onBackToDashboard}
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
            <button
              onClick={() => setIsNotificationsOpen(true)}
              aria-label="התראות"
              className="relative w-11 h-11 flex items-center justify-center rounded-full text-secondary hover:bg-surface-container-high transition-colors cursor-pointer"
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
        <div className="flex flex-col w-full pb-8 select-none">
          {/* Header & Greeting Intro מתוך activity ideas.html */}
          <section className="flex flex-col gap-space-xs mb-space-md">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                  רעיונות לפעולות 💡
                </h1>
                <p className="font-body-md text-body-md text-secondary mt-0.5">
                  מחפשים רעיון לפעולה הבאה? ההשראה לקבוצה שלכם!
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#DCE3D3] flex items-center justify-center text-[#8B7355] shadow-sm shrink-0">
                <span className="material-symbols-outlined text-[28px]">auto_stories</span>
              </div>
            </div>
          </section>

          {/* Search Input Container מתוך activity ideas.html - ריווח מעודן ומאוזן */}
          <section className="mb-4 sm:mb-4.5">
            <div className="relative w-full">
              <div className="absolute inset-y-0 right-0 pr-space-md flex items-center pointer-events-none text-secondary">
                <span className="material-symbols-outlined text-[22px]">search</span>
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חיפוש לפי מטרה, נושא, גיל או שם הפעולה…"
                className="w-full h-12 pr-11 pl-12 bg-surface-container-lowest text-on-surface placeholder:text-secondary/70 rounded-xl shadow-xs border border-[#E2DACB] text-body-md font-body-md focus:outline-none focus:ring-1 focus:ring-[#8B7355] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setIsFilterModalOpen(true)}
                aria-label="מסננים מתקדמים"
                className={`absolute inset-y-0 left-0 pl-space-md flex items-center transition-colors cursor-pointer ${
                  ageGroupFilter !== 'all' || durationFilter !== 'all'
                    ? 'text-[#8B7355] font-bold'
                    : 'text-secondary hover:text-[#8B7355]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">tune</span>
              </button>
            </div>
          </section>

          {/* Horizontal Scrollable Category Chips מתוך activity ideas.html - ריווח מעודן ומאוזן */}
          <section className="mb-4.5 sm:mb-5 -mx-gutter px-gutter overflow-x-auto scrollbar-none flex items-center gap-2 pb-1.5 pt-0.5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-label-lg text-label-lg shadow-xs transition-transform active:scale-95 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#8B7355] text-white'
                  : 'bg-surface-container-lowest text-secondary border border-[#E2DACB] hover:bg-[#DCE3D3]/50'
              }`}
            >
              הכל (+120)
            </button>

            <button
              onClick={() => setSelectedCategory('פעולות גיבוש')}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-label-lg text-label-lg shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'פעולות גיבוש'
                  ? 'bg-[#8B7355] text-white'
                  : 'bg-surface-container-lowest text-secondary border border-[#E2DACB] hover:bg-[#DCE3D3]/50'
              }`}
            >
              <span>פעולות גיבוש</span>
              <span>🤝</span>
            </button>

            <button
              onClick={() => setSelectedCategory('פעולות ערכיות')}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-label-lg text-label-lg shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'פעולות ערכיות'
                  ? 'bg-[#8B7355] text-white'
                  : 'bg-surface-container-lowest text-secondary border border-[#E2DACB] hover:bg-[#DCE3D3]/50'
              }`}
            >
              <span>פעולות ערכיות</span>
              <span>⚖️</span>
            </button>

            <button
              onClick={() => setSelectedCategory('משחקי חברה ו-O.D.T')}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-label-lg text-label-lg shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'משחקי חברה ו-O.D.T'
                  ? 'bg-[#8B7355] text-white'
                  : 'bg-surface-container-lowest text-secondary border border-[#E2DACB] hover:bg-[#DCE3D3]/50'
              }`}
            >
              <span>משחקי חברה ו-O.D.T</span>
              <span>🏃</span>
            </button>

            <button
              onClick={() => setSelectedCategory('פעולות שטח ומחנאות')}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-label-lg text-label-lg shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'פעולות שטח ומחנאות'
                  ? 'bg-[#8B7355] text-white'
                  : 'bg-surface-container-lowest text-secondary border border-[#E2DACB] hover:bg-[#DCE3D3]/50'
              }`}
            >
              <span>פעולות שטח ומחנאות</span>
              <span>⛺️</span>
            </button>

            <button
              onClick={() => setSelectedCategory('פעולות יצירה')}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-label-lg text-label-lg shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'פעולות יצירה'
                  ? 'bg-[#8B7355] text-white'
                  : 'bg-surface-container-lowest text-secondary border border-[#E2DACB] hover:bg-[#DCE3D3]/50'
              }`}
            >
              <span>פעולות יצירה</span>
              <span>🎨</span>
            </button>

            <button
              onClick={() => setSelectedCategory('מנהיגות ואחריות')}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-label-lg text-label-lg shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'מנהיגות ואחריות'
                  ? 'bg-[#8B7355] text-white'
                  : 'bg-surface-container-lowest text-secondary border border-[#E2DACB] hover:bg-[#DCE3D3]/50'
              }`}
            >
              <span>מנהיגות ואחריות</span>
              <span>🧭</span>
            </button>

            <button
              onClick={() => setSelectedCategory('favorites')}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-label-lg text-label-lg shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'favorites'
                  ? 'bg-[#8B7355] text-white'
                  : 'bg-surface-container-lowest text-secondary border border-[#E2DACB] hover:bg-[#DCE3D3]/50'
              }`}
            >
              <span>מועדפים ({favoriteIds.length})</span>
              <span>❤️</span>
            </button>
          </section>

          {/* Activity Cards Feed מתוך activity ideas.html - ריווח מעודן ומאוזן מעל הכרטיס הראשון */}
          <section className="flex flex-col gap-4.5 sm:gap-5 mt-1 sm:mt-1.5 mb-14">
            {filteredIdeas.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-2xl p-8 border border-[#E2DACB] text-center flex flex-col items-center gap-3">
                <span className="w-14 h-14 rounded-full bg-[#eee1cc] flex items-center justify-center text-[#705b3b]">
                  <span className="material-symbols-outlined text-[30px]">search_off</span>
                </span>
                <h3 className="font-bold text-lg text-on-surface">לא נמצאו פעולות מתאימות</h3>
                <p className="text-body-sm text-secondary max-w-xs">
                  נסו לשנות את מילות החיפוש, לבחור קטגוריה אחרת או לאפס את המסננים.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setAgeGroupFilter('all');
                    setDurationFilter('all');
                  }}
                  className="py-2 px-5 rounded-xl bg-[#8B7355] text-white font-bold text-sm shadow-xs cursor-pointer active:scale-95 transition-all mt-1"
                >
                  איפוס כל המסננים
                </button>
              </div>
            ) : (
              filteredIdeas.map((idea, index) => {
                const isFavorite = favoriteIds.includes(idea.id);

                // כרטיס ראשון מוביל (Featured Card) עם תמונה גדולה בדיוק כמו בצילום המסך
                if (index === 0 && idea.imageUrl) {
                  return (
                    <article
                      key={idea.id}
                      className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_16px_rgba(77,69,60,0.08)] border border-[#E2DACB]/70 overflow-hidden flex flex-col transition-all hover:border-[#8B7355]/50"
                    >
                      {/* Visual Card Banner */}
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          alt={idea.title}
                          src={idea.imageUrl}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c17]/85 via-transparent to-black/25 flex flex-col justify-between p-space-md">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-1 rounded-full text-[#8B7355] font-label-md text-label-md shadow-xs">
                              <span className="material-symbols-outlined text-[16px]">
                                {idea.categoryIcon || 'forest'}
                              </span>
                              <span>{idea.category}</span>
                            </span>

                            <button
                              aria-label={isFavorite ? 'הסרה ממועדפים' : 'הוספה למועדפים'}
                              onClick={(e) => handleToggleFavorite(idea.id, e)}
                              className={`w-9 h-9 rounded-full bg-surface-container-lowest/95 backdrop-blur-md flex items-center justify-center shadow-xs transition-transform active:scale-90 cursor-pointer ${
                                isFavorite ? 'text-[#ba1a1a]' : 'text-secondary hover:text-[#ba1a1a]'
                              }`}
                            >
                              <span
                                className="material-symbols-outlined text-[20px]"
                                style={{
                                  fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0",
                                }}
                              >
                                {isFavorite ? 'favorite' : 'favorite_border'}
                              </span>
                            </button>
                          </div>

                          <div className="text-white">
                            {idea.ratingNotice && (
                              <div className="flex items-center gap-1.5 text-[#fcdeb6] font-label-sm text-label-sm mb-1">
                                <span className="material-symbols-outlined text-[14px]">star</span>
                                <span>{idea.ratingNotice}</span>
                              </div>
                            )}
                            <h2 className="font-headline-sm text-headline-sm text-white font-bold leading-tight">
                              {idea.title}
                            </h2>
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-space-md flex flex-col gap-space-sm">
                        {/* Badges Row */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 bg-[#DCE3D3] text-[#383428] px-2.5 py-1 rounded-full font-label-sm text-label-sm">
                            <span className="material-symbols-outlined text-[14px]">school</span>
                            <span>{idea.ageGroup}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 bg-[#F5F1E6] text-[#383428] px-2.5 py-1 rounded-full font-label-sm text-label-sm">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            <span>{idea.duration}</span>
                          </span>
                          {idea.groupSize && (
                            <span className="inline-flex items-center gap-1 bg-[#eee1cc] text-[#6E6754] font-label-sm text-label-sm px-2.5 py-1 rounded-full">
                              <span className="material-symbols-outlined text-[14px]">groups</span>
                              <span>{idea.groupSize}</span>
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="font-body-md text-body-md text-secondary leading-relaxed">
                          {idea.description}
                        </p>

                        {/* Divider & Footer */}
                        <div className="pt-space-xs flex items-center justify-between gap-space-md border-t border-[#E2DACB]/40">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1.5 space-x-reverse">
                              <span className="w-6 h-6 rounded-full bg-[#8B7355] text-white text-[10px] flex items-center justify-center font-bold">
                                נ
                              </span>
                              <span className="w-6 h-6 rounded-full bg-[#9E825D] text-white text-[10px] flex items-center justify-center font-bold">
                                י
                              </span>
                            </div>
                            <span className="font-label-sm text-label-sm text-secondary">
                              {idea.author ? `נוצר ע״י ${idea.author}` : 'צוות הדרכה צופים'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenScheduleModal(idea)}
                              className="h-10 px-3.5 rounded-xl bg-[#DCE3D3] hover:bg-[#d0dbca] text-[#304638] font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer border border-[#829B7A]/40"
                              title="שבץ פעולה זו ביומן הפעולות שלי"
                            >
                              <span className="material-symbols-outlined text-[18px] text-[#715b3e]">calendar_add_on</span>
                              <span>הוספה לפעולות שלי</span>
                            </button>

                            <button
                              onClick={() => setActiveIdeaModal(idea)}
                              className="h-10 px-3.5 rounded-xl bg-[#8B7355] hover:bg-[#7A6548] text-white font-label-md text-label-md flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
                            >
                              <span>צפייה במערך</span>
                              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                }

                // שאר הכרטיסים בסגנון המאויר (Illustrated Card Style) מתוך activity ideas.html
                return (
                  <article
                    key={idea.id}
                    className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_16px_rgba(77,69,60,0.08)] border border-[#E2DACB]/70 p-space-md flex flex-col gap-space-sm transition-all hover:border-[#8B7355]/50"
                  >
                    <div className="flex items-start justify-between gap-space-sm">
                      <div className="flex items-start gap-space-sm">
                        <div
                          className={`w-12 h-12 rounded-2xl ${
                            idea.iconBg || 'bg-[#fcdeb6]'
                          } ${idea.iconColor || 'text-[#271902]'} flex items-center justify-center shrink-0 shadow-xs`}
                        >
                          <span className="material-symbols-outlined text-[26px]">
                            {idea.categoryIcon || 'sports_esports'}
                          </span>
                        </div>
                        <div>
                          <span className="inline-flex items-center gap-1 bg-[#DCE3D3] text-[#383428] font-label-sm text-label-sm px-2.5 py-0.5 rounded-full mb-1">
                            {idea.category}
                          </span>
                          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold leading-snug">
                            {idea.title}
                          </h2>
                        </div>
                      </div>

                      <button
                        aria-label={isFavorite ? 'הסרה ממועדפים' : 'הוספה למועדפים'}
                        onClick={(e) => handleToggleFavorite(idea.id, e)}
                        className={`w-9 h-9 rounded-full bg-[#DCE3D3]/60 flex items-center justify-center shrink-0 transition-transform active:scale-90 cursor-pointer ${
                          isFavorite ? 'text-[#ba1a1a]' : 'text-secondary hover:text-[#ba1a1a]'
                        }`}
                      >
                        <span
                          className="material-symbols-outlined text-[20px]"
                          style={{
                            fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0",
                          }}
                        >
                          {isFavorite ? 'favorite' : 'favorite_border'}
                        </span>
                      </button>
                    </div>

                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 bg-[#DCE3D3] text-[#383428] px-2.5 py-1 rounded-full font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[14px]">school</span>
                        <span>{idea.ageGroup}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 bg-[#F5F1E6] text-[#383428] px-2.5 py-1 rounded-full font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[14px]">timer</span>
                        <span>{idea.duration}</span>
                      </span>
                      {idea.groupSize && (
                        <span className="inline-flex items-center gap-1 bg-[#eee1cc] text-[#6E6754] font-label-sm text-label-sm px-2.5 py-1 rounded-full">
                          <span className="material-symbols-outlined text-[14px]">groups</span>
                          <span>{idea.groupSize}</span>
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="font-body-md text-body-md text-secondary leading-relaxed">
                      {idea.description}
                    </p>

                    {/* Card Footer */}
                    <div className="pt-space-xs flex items-center justify-between gap-space-md border-t border-[#E2DACB]/40">
                      <div className="flex items-center gap-1 text-secondary font-label-sm text-label-sm">
                        <span className="material-symbols-outlined text-[16px] text-[#9E825D]">
                          {idea.socialProof?.includes('מאושר') ? 'verified' : 'thumb_up'}
                        </span>
                        <span>{idea.socialProof || 'מומלץ ע״י מדריכי השבט'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenScheduleModal(idea)}
                          className="h-10 px-3 rounded-xl bg-[#DCE3D3] hover:bg-[#d0dbca] text-[#304638] font-label-md text-label-md font-bold flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer border border-[#829B7A]/40"
                          title="שבץ פעולה זו ביומן הפעולות שלי"
                        >
                          <span className="material-symbols-outlined text-[18px] text-[#715b3e]">calendar_add_on</span>
                          <span>הוספה לפעולות שלי</span>
                        </button>

                        <button
                          onClick={() => setActiveIdeaModal(idea)}
                          className="h-10 px-3.5 rounded-xl bg-[#8B7355] hover:bg-[#7A6548] text-white font-label-md text-label-md flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
                        >
                          <span>צפייה</span>
                          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </section>
        </div>
      </main>

      {/* 2. Interactive Slide-up Drawer Preview Modal מתוך activity ideas.html */}
      {activeIdeaModal && (
        <div
          className="fixed inset-0 z-50 bg-[#1c1c17]/60 backdrop-blur-xs flex items-end justify-center animate-fadeIn"
          onClick={() => setActiveIdeaModal(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-lg bg-surface-container-lowest rounded-t-3xl shadow-[0_-8px_30px_rgba(49,49,43,0.25)] max-h-[85vh] overflow-y-auto p-space-lg flex flex-col gap-space-md animate-slideUp"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Drag Handle Pill */}
            <div className="w-12 h-1.5 bg-[#d1c4b9]/80 rounded-full mx-auto -mt-2 mb-1 cursor-pointer"></div>

            {/* Drawer Header */}
            <div className="flex items-start justify-between gap-space-md border-b border-[#E2DACB]/60 pb-3">
              <div>
                <span className="inline-block bg-[#eee1cc] text-[#574329] font-label-sm text-label-sm px-3 py-0.5 rounded-full mb-1.5 font-semibold">
                  {activeIdeaModal.category}
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {activeIdeaModal.title}
                </h3>
              </div>
              <button
                aria-label="סגירה"
                onClick={() => setActiveIdeaModal(null)}
                className="w-10 h-10 rounded-full bg-[#f1eee6] hover:bg-[#e5e2da] flex items-center justify-center text-secondary hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Quick Metrics Grid מתוך activity ideas.html */}
            <div className="grid grid-cols-3 gap-2 bg-[#F6F3EB] p-3 rounded-2xl border border-[#E2DACB]">
              <div className="flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[#8B7355] text-[20px]">timer</span>
                <span className="font-label-sm text-label-sm text-secondary mt-0.5">זמן מומלץ</span>
                <span className="font-label-lg text-label-lg text-on-surface font-bold">
                  {activeIdeaModal.duration}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center border-x border-[#E2DACB]/60">
                <span className="material-symbols-outlined text-[#8B7355] text-[20px]">group</span>
                <span className="font-label-sm text-label-sm text-secondary mt-0.5">גודל קבוצה</span>
                <span className="font-label-lg text-label-lg text-on-surface font-bold">
                  {activeIdeaModal.groupSize || '15-25'}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <span className="material-symbols-outlined text-[#8B7355] text-[20px]">terrain</span>
                <span className="font-label-sm text-label-sm text-secondary mt-0.5">מיקום</span>
                <span className="font-label-lg text-label-lg text-on-surface font-bold">
                  {activeIdeaModal.location || 'חורשה/שבט'}
                </span>
              </div>
            </div>

            {/* מטרות חינוכיות */}
            {activeIdeaModal.goals && activeIdeaModal.goals.length > 0 && (
              <div className="flex flex-col gap-1.5 p-3.5 bg-[#f1eee6]/80 rounded-2xl border border-[#E2DACB]/50">
                <div className="flex items-center gap-1.5 text-on-surface font-label-lg font-bold">
                  <span className="material-symbols-outlined text-[#8B7355] text-[18px]">target</span>
                  <span>מטרות הפעולה:</span>
                </div>
                <ul className="list-disc list-inside text-body-sm text-secondary space-y-1 pr-1">
                  {activeIdeaModal.goals.map((g, idx) => (
                    <li key={idx}>{g}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* ציוד דרוש ומצרכים */}
            <div className="flex flex-col gap-1.5 p-3.5 bg-[#eee1cc]/40 rounded-2xl border border-[#E2DACB]/50">
              <div className="flex items-center gap-1.5 text-on-surface font-label-lg font-bold">
                <span className="material-symbols-outlined text-[#8B7355] text-[18px]">handyman</span>
                <span>ציוד דרוש ומצרכים:</span>
              </div>
              <p className="text-body-sm text-secondary leading-relaxed">
                {activeIdeaModal.equipment}
              </p>
            </div>

            {/* Activity Stages Summary מתוך activity ideas.html */}
            <div className="flex flex-col gap-2.5">
              <h4 className="font-label-lg text-label-lg text-on-surface font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#8B7355] text-[18px]">
                  format_list_numbered
                </span>
                <span>שלבי הפעולה:</span>
              </h4>
              <div className="space-y-2">
                {activeIdeaModal.steps && activeIdeaModal.steps.length > 0 ? (
                  activeIdeaModal.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-[#f1eee6] rounded-xl">
                      <span className="w-6 h-6 rounded-full bg-[#8B7355] text-white text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-label-lg text-label-lg text-on-surface font-bold">
                          {step.title} ({step.duration})
                        </p>
                        <p className="font-body-sm text-body-sm text-secondary mt-0.5 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-body-sm text-secondary">{activeIdeaModal.description}</p>
                )}
              </div>
            </div>

            {/* Action Buttons in Modal מתוך activity ideas.html */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#E2DACB]/60">
              {/* כפתור הוספה לפעולות שלי */}
              <button
                onClick={() => handleOpenScheduleModal(activeIdeaModal)}
                className={`w-full h-12 rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all cursor-pointer ${
                  addedSuccessId === activeIdeaModal.id
                    ? 'bg-[#DCE3D3] text-[#715b3e] font-bold'
                    : 'bg-[#8B7355] text-white hover:bg-[#7A6548]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {addedSuccessId === activeIdeaModal.id ? 'check' : 'calendar_add_on'}
                </span>
                <span>
                  {addedSuccessId === activeIdeaModal.id
                    ? 'נוספה לפעולות שלי!'
                    : 'הוספה לפעולות שלי'}
                </span>
              </button>

              {/* כפתור הורדת PDF */}
              <button
                onClick={() => handleDownloadPdf(activeIdeaModal)}
                disabled={isDownloadingPdf}
                className="w-full h-11 rounded-xl bg-[#ebe8e0] hover:bg-[#e5e2da] text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-secondary">
                  {isDownloadingPdf ? 'progress_activity' : 'picture_as_pdf'}
                </span>
                <span>
                  {isDownloadingPdf ? 'מכין קובץ להורדה...' : 'הורדת קובץ מערך ב-PDF'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. מודאל מסננים מתקדמים (Filter Modal) */}
      {isFilterModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          dir="rtl"
        >
          <div className="bg-[#F6F3EB] w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-[#E2DACB] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#E2DACB] pb-2">
              <h3 className="font-bold text-base text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px] text-[#8B7355]">tune</span>
                <span>מסננים מתקדמים</span>
              </h3>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-secondary hover:bg-[#eee1cc]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* סינון לפי שכבת גיל */}
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-xs text-secondary">שכבת גיל:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'all', label: 'הכל' },
                  { id: 'ד׳', label: 'ד׳–ו׳ (צעירה)' },
                  { id: 'ח׳', label: 'ז׳–ט׳ (נעורים)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setAgeGroupFilter(item.id)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      ageGroupFilter === item.id
                        ? 'bg-[#8B7355] text-white'
                        : 'bg-white text-secondary border border-[#E2DACB]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* סינון לפי משך הפעולה */}
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-xs text-secondary">משך הפעולה:</span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'all', label: 'הכל' },
                  { id: 'short', label: 'עד 45 דק׳' },
                  { id: 'medium', label: '60 דקות' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDurationFilter(item.id)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      durationFilter === item.id
                        ? 'bg-[#8B7355] text-white'
                        : 'bg-white text-secondary border border-[#E2DACB]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* כפתורי פעולה של המודאל */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#E2DACB]">
              <button
                onClick={() => {
                  setAgeGroupFilter('all');
                  setDurationFilter('all');
                  setSelectedCategory('all');
                  setIsFilterModalOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-[#eee1cc] text-[#4e4637] font-bold text-xs cursor-pointer"
              >
                איפוס
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-[#8B7355] text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                החלת סינון
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2b. מודאל קביעת מועד ושיבוץ הפעולה ביומן (ScheduleIdeaModal) */}
      {schedulingIdea && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
          dir="rtl"
        >
          <div className="bg-[#F6F3EB] w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-[#E2DACB] max-h-[92vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* כותרת מודאל שיבוץ */}
            <div className="flex items-center justify-between border-b border-[#E2DACB] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-10 h-10 rounded-2xl bg-[#DCE3D3] flex items-center justify-center text-[#715b3e]">
                  <span className="material-symbols-outlined text-[24px]">calendar_month</span>
                </span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    שיבוץ פעולה ביומן
                  </h3>
                  <p className="font-body-sm text-body-sm text-secondary">
                    בחרו מועד ומיקום לפעולה כדי שתופיע תחת ״פעולות קרובות״
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSchedulingIdea(null)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-secondary hover:bg-[#eee1cc] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* כרטיס תמצית הפעולה הנבחרת */}
            <div className="p-3.5 bg-white rounded-2xl border border-[#E2DACB] shadow-xs mb-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#8B7355] bg-[#DCE3D3]/60 px-2.5 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-[14px]">
                    {schedulingIdea.categoryIcon || 'lightbulb'}
                  </span>
                  <span>{schedulingIdea.category}</span>
                </span>
                <span className="text-xs text-secondary font-semibold">
                  משך: {schedulingIdea.duration}
                </span>
              </div>
              <h4 className="font-bold text-base text-[#1c1c17]">{schedulingIdea.title}</h4>
              <p className="text-xs text-[#665d4d] line-clamp-2 leading-relaxed">
                {schedulingIdea.description}
              </p>
              {schedulingIdea.equipment && (
                <div className="pt-2 border-t border-[#E2DACB]/40 flex items-center gap-1.5 text-xs text-[#4d453c]">
                  <span className="material-symbols-outlined text-[15px] text-[#715b3e]">handyman</span>
                  <span><strong>ציוד דרוש:</strong> {schedulingIdea.equipment}</span>
                </div>
              )}
            </div>

            {/* טופס בחירת תאריך, שעה ומיקום */}
            <form onSubmit={handleConfirmSchedule} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4e4637] mb-1">
                    תאריך הפעולה*
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    required
                    className="w-full h-11 px-3 bg-white rounded-xl border border-[#D1C5B1] text-sm text-[#1c1c17] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4e4637] mb-1">
                    שעת התחלה*
                  </label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    required
                    className="w-full h-11 px-3 bg-white rounded-xl border border-[#D1C5B1] text-sm text-[#1c1c17] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                  />
                </div>
              </div>

              {/* כפתורי בחירה מהירה של מועד צופי מקובל */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-secondary">בחירה מהירה:</span>
                {[
                  {
                    label: 'פעולת שלישי הקרוב',
                    getDate: () => {
                      const d = new Date();
                      const day = d.getDay();
                      const diff = (2 - day + 7) % 7 || 7;
                      d.setDate(d.getDate() + diff);
                      return d.toISOString().split('T')[0];
                    },
                    time: '17:00',
                  },
                  {
                    label: 'פעולת שישי הקרוב',
                    getDate: () => {
                      const d = new Date();
                      const day = d.getDay();
                      const diff = (5 - day + 7) % 7 || 7;
                      d.setDate(d.getDate() + diff);
                      return d.toISOString().split('T')[0];
                    },
                    time: '16:30',
                  },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setScheduleDate(preset.getDate());
                      setScheduleTime(preset.time);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#DCE3D3] hover:bg-[#d0dbca] text-[#304638] text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4e4637] mb-1">
                  מיקום הפעולה
                </label>
                <input
                  type="text"
                  value={scheduleLocation}
                  onChange={(e) => setScheduleLocation(e.target.value)}
                  placeholder="לדוגמה: שבט אופק, חדר שכבת ח׳"
                  className="w-full h-11 px-3 bg-white rounded-xl border border-[#D1C5B1] text-sm text-[#1c1c17] focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 h-12 rounded-xl bg-[#8B7355] hover:bg-[#715b3e] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">event_available</span>
                  <span>אישור ושיבוץ תחת 'פעולות קרובות'</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSchedulingIdea(null)}
                  className="px-5 h-12 rounded-xl bg-[#DCE3D3] hover:bg-[#cfd9c8] text-[#304638] font-bold text-sm transition-colors cursor-pointer"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Micro-interaction / Toast Alert container מתוך activity ideas.html */}
      {toastMessage && (
        <div className="fixed bottom-24 inset-x-4 z-50 flex justify-center animate-fadeIn">
          <div className="bg-[#31312b] text-[#f3f1e9] px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-body-md font-bold max-w-md border border-[#4e4637]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#fcdeba] text-[20px]">
                check_circle
              </span>
              <span>{toastMessage}</span>
            </div>
            {onNavigateTab && (
              <button
                onClick={() => onNavigateTab('activities')}
                className="shrink-0 px-2.5 py-1 rounded-xl bg-[#8B7355] hover:bg-[#715B3E] text-white text-xs font-bold cursor-pointer transition-colors"
              >
                לפעולות שלי
              </button>
            )}
          </div>
        </div>
      )}

      {/* מודאל פרופיל מדריך */}
      <ProfileModal
        user={user}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onSaveProfile={onSaveProfile || (() => {})}
        onLogout={onLogout || (() => {})}
      />

      {/* מודאל התראות ותזכורות */}
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
