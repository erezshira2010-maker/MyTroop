import { useState, useMemo } from 'react';
import type { ScoutMember, UserProfile, NotificationItem, Activity } from '../types';
import { getActivities } from '../services/storage';
import ProfileModal from './ProfileModal';
import NotificationsModal from './NotificationsModal';
import MyTroopLogo from './MyTroopLogo';

interface ScoutDirectoryProps {
  members: ScoutMember[];
  user: UserProfile;
  notifications?: NotificationItem[];
  onAddMember: (newMember: ScoutMember) => void;
  onUpdateMember?: (updatedMember: ScoutMember) => void;
  onDeleteMember: (id: string) => void;
  onBackToDashboard: () => void;
  onSaveProfile?: (updated: UserProfile) => void;
  onLogout?: () => void;
}

type QuickFilter = 'all' | 'high_attendance' | 'needs_followup';

/**
 * ולידציה לשם מלא: לפחות 2 אותיות בכל חלק (שם פרטי ושם משפחה)
 */
const validateMemberName = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return 'יש להזין שם פרטי ושם משפחה';
  const parts = trimmed.split(/\s+/);
  if (parts.length < 2) return 'יש להזין שם פרטי ושם משפחה מלאים (לפחות 2 מילים)';
  const allPartsValid = parts.every((p) => {
    const letters = p.replace(/[^a-zA-Z\u0590-\u05FF]/g, '');
    return letters.length >= 2;
  });
  if (!allPartsValid) return 'בכל שם (פרטי ומשפחה) חייבות להיות לפחות 2 אותיות';
  return '';
};

/**
 * קומפוננטת "החניכים שלי" (MyTroop – Scout Directory Screen)
 * ממומשת במלואה בהתאם לאפיון המפורט ולצילום המסך:
 * חיפוש דינמי, סינון מתקדם, כרטיסים נפתחים, חיוג ו-SMS, מודאלי הוספה, עריכה והיסטוריית נוכחות.
 */
export default function ScoutDirectory({
  members,
  user,
  notifications = [],
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onBackToDashboard,
  onSaveProfile,
  onLogout,
}: ScoutDirectoryProps) {
  // חיפוש וסינון
  const [searchQuery, setSearchQuery] = useState('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [genderFilter, setGenderFilter] = useState<'all' | 'boy' | 'girl'>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');

  // ניהול כרטיסים מורחבים - פותח את איתי שפירא כברירת מחדל
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    'm-itay-shapira': true,
  });

  // הודעות הצלחה / טוסט
  const [toastMessage, setToastMessage] = useState<string>('');

  // מודאלים
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ScoutMember | null>(null);
  const [attendanceHistoryMember, setAttendanceHistoryMember] = useState<ScoutMember | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // טופס הוספת חניך
  const [newFullName, setNewFullName] = useState('');
  const [newGradeClass, setNewGradeClass] = useState('כיתה ח׳ 2');
  const [newGender, setNewGender] = useState<'boy' | 'girl'>('boy');
  const [newPhone, setNewPhone] = useState('');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newEmergencyPhone, setNewEmergencyPhone] = useState('');
  const [newAllergies, setNewAllergies] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newAvatarUrl, setNewAvatarUrl] = useState('');
  const [formError, setFormError] = useState('');

  // טופס עריכת חניך
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editGradeClass, setEditGradeClass] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editParentName, setEditParentName] = useState('');
  const [editParentPhone, setEditParentPhone] = useState('');
  const [editMotherName, setEditMotherName] = useState('');
  const [editMotherPhone, setEditMotherPhone] = useState('');
  const [editFatherName, setEditFatherName] = useState('');
  const [editFatherPhone, setEditFatherPhone] = useState('');
  const [editAllergies, setEditAllergies] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [editError, setEditError] = useState('');

  // העלאת תמונת פרופיל לחניך ישירות מהכרטיס ושמירה מיידית
  const handleMemberPhotoUpload = (memberId: string, file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64Url = reader.result as string;
      const targetMember = members.find((m) => m.id === memberId);
      if (targetMember && onUpdateMember) {
        onUpdateMember({
          ...targetMember,
          avatarUrl: base64Url,
        });
        showToast(`תמונת הפרופיל של ${targetMember.firstName} נשמרה בהצלחה! 📸`);
      }
    };
    reader.readAsDataURL(file);
  };

  // טעינת פעולות לצורך הצגת היסטוריית נוכחות אמיתית
  const pastActivities: Activity[] = useMemo(() => {
    return getActivities().filter((a) => a.status === 'completed');
  }, []);

  // פתיחה / סגירה של מגירת כרטיס
  const toggleCard = (id: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // חישוב מונים עבור כפתורי הסינון המהירים
  const totalCount = members.length;
  const highAttendanceCount = members.filter((m) => (m.attendanceRate ?? 90) >= 80).length;
  const needsFollowUpCount = members.filter(
    (m) => m.needsFollowUp || (m.attendanceRate ?? 90) < 80
  ).length;

  // סינון רשימת החניכים
  const filteredMembers = members.filter((m) => {
    // 1. חיפוש לפי שם פרטי, שם משפחה, טלפון או הורה
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
      const phoneClean = (m.phone || '').replace(/[^0-9]/g, '');
      const queryClean = query.replace(/[^0-9]/g, '');
      const matchesName = fullName.includes(query);
      const matchesPhone = queryClean && phoneClean.includes(queryClean);
      const matchesParent = (m.parentName || '').toLowerCase().includes(query);
      if (!matchesName && !matchesPhone && !matchesParent) return false;
    }

    // 2. סינון מהיר (Quick Filters)
    const rate = m.attendanceRate ?? 90;
    if (quickFilter === 'high_attendance') {
      if (rate < 80) return false;
    } else if (quickFilter === 'needs_followup') {
      if (!m.needsFollowUp && rate >= 80) return false;
    }

    // 3. סינון מתקדם
    if (genderFilter !== 'all' && m.gender !== genderFilter) return false;
    if (gradeFilter !== 'all') {
      if (!m.gradeClass || !m.gradeClass.includes(gradeFilter)) return false;
    }

    return true;
  });

  // הצגת הודעת טוסט מעוצבת
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // שליחת טופס הוספת חניך חדש
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // ולידציה מלאה
    const nameErr = validateMemberName(newFullName);
    if (nameErr) {
      setFormError(nameErr);
      return;
    }

    if (!newParentPhone.trim()) {
      setFormError('יש להזין טלפון הורה ליצירת קשר');
      return;
    }

    const parts = newFullName.trim().split(/\s+/);
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ');

    const newMember: ScoutMember = {
      id: `scout-${Date.now()}`,
      firstName,
      lastName,
      gender: newGender,
      gradeClass: newGradeClass.trim() || 'כיתה ח׳',
      role: 'חניך',
      avatarUrl: newAvatarUrl || undefined,
      phone: newPhone.trim() || '050-0000000',
      parentName: newParentName.trim() || 'הורה',
      parentPhone: newParentPhone.trim(),
      allergies: newAllergies.trim(),
      notes: (newNotes + (newEmergencyPhone ? ` | איש קשר לחירום: ${newEmergencyPhone}` : '')).trim(),
      attendanceRate: 100,
      attendedActivities: 1,
      totalActivities: 1,
      isLeaderTeam: false,
      needsFollowUp: false,
    };

    onAddMember(newMember);
    setIsAddModalOpen(false);
    showToast(`החניך/ה ${firstName} ${lastName} נוסף/ה בהצלחה! ⚜️`);

    // איפוס טופס
    setNewFullName('');
    setNewPhone('');
    setNewParentName('');
    setNewParentPhone('');
    setNewEmergencyPhone('');
    setNewAllergies('');
    setNewNotes('');
    setNewAvatarUrl('');
  };

  // פתיחת עריכת חניך
  const handleOpenEdit = (m: ScoutMember) => {
    setEditingMember(m);
    setEditFirstName(m.firstName);
    setEditLastName(m.lastName);
    setEditGradeClass(m.gradeClass || 'כיתה ח׳');
    setEditRole(m.role || 'חניך');
    setEditPhone(m.phone || '');
    setEditParentName(m.parentName || '');
    setEditParentPhone(m.parentPhone || '');
    setEditMotherName(m.motherName || '');
    setEditMotherPhone(m.motherPhone || '');
    setEditFatherName(m.fatherName || '');
    setEditFatherPhone(m.fatherPhone || '');
    setEditAllergies(m.allergies || '');
    setEditNotes(m.notes || '');
    setEditAvatarUrl(m.avatarUrl || '');
    setEditError('');
  };

  // שמירת עריכת חניך
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    if (!editFirstName.trim() || !editLastName.trim()) {
      setEditError('יש להזין שם פרטי ושם משפחה תקינים');
      return;
    }

    const updated: ScoutMember = {
      ...editingMember,
      firstName: editFirstName.trim(),
      lastName: editLastName.trim(),
      gradeClass: editGradeClass.trim(),
      role: editRole.trim(),
      avatarUrl: editAvatarUrl || editingMember.avatarUrl,
      phone: editPhone.trim(),
      parentName: editParentName.trim(),
      parentPhone: editParentPhone.trim(),
      motherName: editMotherName.trim(),
      motherPhone: editMotherPhone.trim(),
      fatherName: editFatherName.trim(),
      fatherPhone: editFatherPhone.trim(),
      allergies: editAllergies.trim(),
      notes: editNotes.trim(),
    };

    if (onUpdateMember) {
      onUpdateMember(updated);
    }
    setEditingMember(null);
    showToast(`פרטי ${updated.firstName} עודכנו בהצלחה! ⚜️`);
  };

  // פורמט מסכת טלפון מאובטחת: 054-***-4921
  const formatMasked = (p?: string): string => {
    if (!p) return '050-***-0000';
    const nums = p.replace(/[^0-9]/g, '');
    if (nums.length >= 7) {
      return `${nums.slice(0, 3)}-***-${nums.slice(-4)}`;
    }
    return p;
  };

  // קבלת תגית סטטוס נוכחות לפי אחוז
  const getAttendanceBadge = (member: ScoutMember) => {
    const rate = member.attendanceRate;
    if (rate === undefined) {
      return { text: 'אין נתוני נוכחות', style: 'bg-gray-100 text-gray-700' };
    }
    if (member.needsFollowUp || rate < 80) {
      return { text: 'דורש מעקב', style: 'bg-[#ffdad6] text-[#93000a] font-bold' };
    }
    if (rate >= 90) {
      return { text: 'נוכחות מצוינת', style: 'bg-[#DCE3D3] text-[#304638] font-bold' };
    }
    return { text: 'נוכחות טובה', style: 'bg-[#eee1cc] text-[#705b3b] font-medium' };
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-[#F6F3EB] text-[#1c1c17] font-body-md text-body-md flex flex-col min-h-screen">
      {/* 1. Header עליון זהה למסך הבית */}
      <header className="fixed top-0 inset-x-0 z-50 bg-[#F6F3EB]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(70,55,40,0.06)] pt-safe">
        <div className="h-16 px-gutter flex items-center justify-between max-w-lg mx-auto w-full">
          {/* Logo & Application Name - New Original MyTroop Logo */}
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-space-sm cursor-pointer group border-none bg-transparent"
          >
            <div className="relative flex items-center justify-center">
              <MyTroopLogo className="w-8 h-8 rounded-xl shadow-xs transition-transform group-hover:scale-105" />
            </div>
            <span className="font-headline-sm text-headline-sm text-[#1c1c17] font-bold tracking-tight">
              MyTroop
            </span>
          </button>

          {/* Action Buttons: Notifications & Profile */}
          <div className="flex items-center gap-space-xs">
            <button
              onClick={() => setIsNotificationsOpen(true)}
              aria-label="התראות"
              className="relative w-11 h-11 flex items-center justify-center rounded-full text-[#665d4d] hover:bg-[#ebe8e0] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 left-2 w-2.5 h-2.5 bg-[#8B7355] rounded-full ring-2 ring-[#F6F3EB] animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setIsProfileOpen(true)}
              aria-label="פרופיל מדריך"
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

      {/* הודעת טוסט צפה על שמירה / עדכון */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#304638] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full px-gutter pt-20 pb-28 bg-[#F6F3EB] max-w-lg mx-auto">
        <div className="flex flex-col w-full gap-space-md" dir="rtl">
          {/* Overview Summary & Top Action */}
          <section className="flex flex-col gap-space-sm pt-space-xs">
            <div className="flex items-center justify-between gap-space-sm">
              <div className="flex flex-col min-w-0">
                <h1 className="font-headline-md text-headline-md text-[#1c1c17] tracking-tight">
                  החניכים שלי
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#829B7A] animate-pulse"></span>
                  <p className="font-label-md text-label-md text-[#665d4d] truncate">
                    {totalCount} חניכים רשומים • שכבת כיתה {user.layerName?.split('-')[0]?.trim() || 'ח׳'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="shrink-0 flex items-center gap-1.5 bg-[#8B7355] hover:bg-[#715b3e] text-white px-3.5 py-2.5 rounded-xl font-label-md text-label-md shadow-sm transition-all active:scale-95 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                <span>+ הוספת חניך</span>
              </button>
            </div>

            {/* שורת חיפוש חכמה */}
            <div className="relative w-full mt-space-xs">
              <span className="material-symbols-outlined absolute right-3.5 top-1/2 -translate-y-1/2 text-[#665d4d] pointer-events-none text-[20px]">
                search
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-[#1c1c17] font-body-md text-body-md placeholder:text-[#665d4d]/70 pr-10 pl-10 py-3 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 border border-[#E8D8B8]"
                placeholder="חיפוש חניך לפי שם או טלפון..."
                type="search"
              />

              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="נקה חיפוש"
                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#665d4d] p-1 rounded-lg hover:bg-[#DCE3D3]/40 cursor-pointer text-[20px]"
                >
                  close
                </button>
              ) : (
                <button
                  onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
                  aria-label="סינון מתקדם"
                  className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors text-[20px] cursor-pointer ${
                    isAdvancedFilterOpen || genderFilter !== 'all' || gradeFilter !== 'all'
                      ? 'bg-[#8B7355] text-white'
                      : 'text-[#665d4d] hover:bg-[#DCE3D3]'
                  }`}
                >
                  tune
                </button>
              )}
            </div>

            {/* פאנל סינון מתקדם נפתח בלחיצה על אייקון tune */}
            {isAdvancedFilterOpen && (
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8D8B8] shadow-sm flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#E8D8B8]/50">
                  <span className="text-xs font-bold text-[#304638]">סינון מתקדם</span>
                  <button
                    onClick={() => {
                      setGenderFilter('all');
                      setGradeFilter('all');
                      setQuickFilter('all');
                      setSearchQuery('');
                    }}
                    className="text-xs text-[#8B7355] hover:underline font-semibold cursor-pointer"
                  >
                    איפוס סינונים
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] text-[#665d4d] font-semibold block mb-1">מין החניך:</label>
                    <select
                      value={genderFilter}
                      onChange={(e) => setGenderFilter(e.target.value as 'all' | 'boy' | 'girl')}
                      className="w-full h-8 px-2 bg-[#F6F3EB] rounded-lg border border-[#E8D8B8] text-xs"
                    >
                      <option value="all">הכל (בנים ובנות)</option>
                      <option value="boy">בנים בלבד</option>
                      <option value="girl">בנות בלבד</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#665d4d] font-semibold block mb-1">כיתה / קבוצה:</label>
                    <select
                      value={gradeFilter}
                      onChange={(e) => setGradeFilter(e.target.value)}
                      className="w-full h-8 px-2 bg-[#F6F3EB] rounded-lg border border-[#E8D8B8] text-xs"
                    >
                      <option value="all">כל הכיתות</option>
                      <option value="ח׳ 1">ח׳ 1</option>
                      <option value="ח׳ 2">ח׳ 2</option>
                      <option value="ח׳ 3">ח׳ 3</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Filter Buttons (הכל, נוכחות גבוהה, דורש מעקב) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar -mx-gutter px-gutter">
              {/* Filter 1: All */}
              <button
                onClick={() => setQuickFilter('all')}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm transition-all cursor-pointer ${
                  quickFilter === 'all'
                    ? 'bg-[#8B7355] text-white'
                    : 'bg-white text-[#665d4d] hover:text-[#1c1c17] border border-[#E8D8B8]'
                }`}
                type="button"
              >
                <span>הכל</span>
                <span
                  className={`text-label-sm px-1.5 py-0.2 rounded-full font-bold ${
                    quickFilter === 'all' ? 'bg-white/20 text-white' : 'bg-[#DCE3D3] text-[#304638]'
                  }`}
                >
                  {totalCount}
                </span>
              </button>

              {/* Filter 2: High Attendance (>=80%) */}
              <button
                onClick={() => setQuickFilter('high_attendance')}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm transition-all cursor-pointer ${
                  quickFilter === 'high_attendance'
                    ? 'bg-[#8B7355] text-white'
                    : 'bg-white text-[#665d4d] hover:text-[#1c1c17] border border-[#E8D8B8]'
                }`}
                type="button"
              >
                <span>נוכחות גבוהה</span>
                <span className="bg-[#DCE3D3] text-[#304638] text-label-sm px-1.5 py-0.2 rounded-full font-semibold">
                  {highAttendanceCount}
                </span>
              </button>

              {/* Filter 3: Needs Follow-Up (<80% or flagged) */}
              <button
                onClick={() => setQuickFilter('needs_followup')}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-label-md text-label-md shadow-sm transition-all cursor-pointer ${
                  quickFilter === 'needs_followup'
                    ? 'bg-[#8B7355] text-white'
                    : 'bg-white text-[#665d4d] hover:text-[#1c1c17] border border-[#E8D8B8]'
                }`}
                type="button"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
                <span>דורש מעקב</span>
                <span className="bg-[#ffdad6] text-[#93000a] text-label-sm px-1.5 py-0.2 rounded-full font-bold">
                  {needsFollowUpCount}
                </span>
              </button>
            </div>
          </section>

          {/* רשימת כרטיסי החניכים (Scout Member Cards) */}
          <section className="flex flex-col gap-3">
            {members.length === 0 ? (
              /* מצב שאין בכלל חניכים בקבוצה */
              <div className="bg-white rounded-2xl p-8 text-center border border-[#E8D8B8] shadow-sm flex flex-col items-center gap-2.5">
                <span className="w-12 h-12 rounded-full bg-[#DCE3D3] flex items-center justify-center text-[#715b3e]">
                  <span className="material-symbols-outlined text-[26px]">groups</span>
                </span>
                <h3 className="font-bold text-base text-[#1c1c17]">עדיין אין חניכים בקבוצה</h3>
                <p className="text-body-sm text-[#665d4d] max-w-xs">
                  התחל לבנות את הקבוצה שלך על ידי הוספת החניך הראשון.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-2 py-2.5 px-5 rounded-xl bg-[#8B7355] text-white font-bold text-sm cursor-pointer shadow-xs"
                >
                  הוספת חניך ראשון
                </button>
              </div>
            ) : filteredMembers.length === 0 ? (
              /* מצב שאין תוצאות תואמות לחיפוש או לסינון */
              <div className="bg-white rounded-2xl p-8 text-center border border-[#E8D8B8] shadow-sm flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-[36px] text-[#715b3e]">
                  person_search
                </span>
                <p className="font-bold text-[#1c1c17] text-base">לא נמצאו חניכים התואמים לחיפוש</p>
                <p className="text-body-sm text-[#665d4d]">
                  נסה לשנות את מילות החיפוש או לאפס את הסינונים.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setQuickFilter('all');
                    setGenderFilter('all');
                    setGradeFilter('all');
                  }}
                  className="mt-2 px-4 py-2 bg-[#DCE3D3] text-[#304638] rounded-xl font-bold text-xs cursor-pointer"
                >
                  הצג את כל החניכים
                </button>
              </div>
            ) : (
              filteredMembers.map((member) => {
                const isExpanded = Boolean(expandedCards[member.id]);
                const badge = getAttendanceBadge(member);
                const attendance = member.attendanceRate;
                const attended = member.attendedActivities ?? 18;
                const total = member.totalActivities ?? 20;
                const isNeedsFollowUp = member.needsFollowUp || (attendance !== undefined && attendance < 80);
                const cleanPhone = (member.phone || '').replace(/[^0-9]/g, '');

                return (
                  <article
                    key={member.id}
                    className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3 transition-all duration-200 border border-[#E8D8B8]/60 hover:border-[#8B7355]/40"
                  >
                    {/* שורת ראש הכרטיס */}
                    <div className="flex items-start justify-between gap-3">
                      <div
                        onClick={() => toggleCard(member.id)}
                        className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                        role="button"
                        tabIndex={0}
                      >
                        {/* תמונת פרופיל עם אפשרות העלאת תמונה ישירה */}
                        <div
                          className="relative shrink-0 group/avatar cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            const input = document.getElementById(`avatar-file-${member.id}`) as HTMLInputElement;
                            if (input) input.click();
                          }}
                          title="לחץ להעלאת תמונת פרופיל לחניך 📸"
                        >
                          {member.avatarUrl ? (
                            <img
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-[#8B7355]/30 group-hover/avatar:ring-[#8B7355] transition-all"
                              src={member.avatarUrl}
                              alt={`${member.firstName} ${member.lastName}`}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-[#DCE3D3] flex items-center justify-center text-[#304638] font-headline-sm font-bold ring-2 ring-[#8B7355]/20 group-hover/avatar:ring-[#8B7355] transition-all">
                              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                            </div>
                          )}

                          {/* אייקון מצלמה צף להחלפת תמונה */}
                          <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-[#8B7355] hover:bg-[#715b3e] text-white flex items-center justify-center shadow-xs transition-transform group-hover/avatar:scale-110">
                            <span className="material-symbols-outlined text-[12px]">photo_camera</span>
                          </div>

                          {member.isLeaderTeam && (
                            <span className="absolute -top-1 -right-1 bg-[#8B7355] text-white p-0.5 rounded-full flex items-center justify-center shadow-xs">
                              <span className="material-symbols-outlined text-[10px]">star</span>
                            </span>
                          )}

                          {/* שדה קובץ מוסתר לכל חניך */}
                          <input
                            id={`avatar-file-${member.id}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleMemberPhotoUpload(member.id, file);
                              }
                            }}
                          />
                        </div>

                        {/* שם, תפקיד וכיתה */}
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h2 className="font-headline-sm text-headline-sm text-[#1c1c17] truncate">
                              {member.firstName} {member.lastName}
                            </h2>
                            <span className={`text-label-sm font-label-sm px-2 py-0.5 rounded-full shrink-0 ${badge.style}`}>
                              {badge.text}
                            </span>
                          </div>
                          <p className="font-body-sm text-body-sm text-[#665d4d] truncate mt-0.5">
                            {member.gradeClass || 'כיתה ח׳'} {member.role ? `• ${member.role}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* כפתורי פעולה: הודעת SMS וחיוג טלפוני (מוצגים רק אם קיים מספר תקין) */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {cleanPhone ? (
                          <>
                            {/* Message Button: פותח ממשק SMS במכשיר ללא שליחה אוטומטית */}
                            <a
                              aria-label={`שלח הודעה ל${member.firstName}`}
                              className="w-9 h-9 rounded-full bg-[#DCE3D3]/60 text-[#8B7355] flex items-center justify-center hover:bg-[#DCE3D3] transition-transform active:scale-90"
                              href={`sms:${member.phone}`}
                            >
                              <span className="material-symbols-outlined text-[18px]">chat</span>
                            </a>

                            {/* Phone Button: פותח חיוג טלפוני באמצעות tel: */}
                            <a
                              aria-label={`התקשר ל${member.firstName}`}
                              className="w-10 h-10 shrink-0 rounded-full bg-[#DCE3D3]/60 text-[#8B7355] flex items-center justify-center hover:bg-[#DCE3D3] transition-transform active:scale-90"
                              href={`tel:${member.phone}`}
                            >
                              <span className="material-symbols-outlined text-[20px]">call</span>
                            </a>
                          </>
                        ) : null}
                      </div>
                    </div>

                    {/* סרגל נוכחות ומספר מוסתר */}
                    <div className="flex items-center justify-between bg-[#DCE3D3]/40 rounded-xl px-3 py-2 text-[#1c1c17] gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-[#715b3e]">
                          {attendance !== undefined && attendance >= 90 ? 'verified' : attendance !== undefined && attendance >= 80 ? 'done_all' : 'warning'}
                        </span>
                        {attendance !== undefined ? (
                          <>
                            <span className="font-label-md text-label-md text-[#715b3e] font-bold">
                              {attendance}% נוכחות
                            </span>
                            <span className="font-body-sm text-body-sm text-[#665d4d]">
                              ({attended} מתוך {total})
                            </span>
                          </>
                        ) : (
                          <span className="font-label-md text-label-md text-[#665d4d]">
                            אין נתוני נוכחות
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-[#665d4d] text-body-sm font-mono dir-ltr">
                        <span className="material-symbols-outlined text-[15px]">lock</span>
                        <span>{formatMasked(member.phone)}</span>
                      </div>
                    </div>

                    {/* התראת מעקב לחניך הזקוק לתשומת לב */}
                    {isNeedsFollowUp && (
                      <div className="flex items-center justify-between bg-[#ffdad6]/40 rounded-xl px-3 py-2 text-[#93000a]">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">warning</span>
                          <span className="font-label-md text-label-md font-semibold">
                            {member.followUpReason || 'פספס 2 פעולות אחרונות'}
                          </span>
                        </div>
                        <a
                          href={`tel:${member.parentPhone || member.phone}`}
                          className="text-xs font-bold text-[#ba1a1a] hover:underline flex items-center gap-0.5"
                        >
                          <span>חייג להורה</span>
                          <span className="material-symbols-outlined text-[14px]">call</span>
                        </a>
                      </div>
                    )}

                    {/* מגירת פרטים מורחבת (Expandable Member Details) */}
                    {isExpanded && (
                      <div className="flex flex-col gap-2.5 pt-1 animate-in fade-in duration-200">
                        {/* פרטי הורים ויצירת קשר */}
                        <div className="bg-[#f6f3eb] rounded-xl p-3 flex flex-col gap-1.5 border border-[#E8D8B8]/50">
                          <div className="flex items-center gap-1.5 font-label-md text-label-md text-[#1c1c17] font-semibold">
                            <span className="material-symbols-outlined text-[17px] text-[#9E825D]">
                              family_restroom
                            </span>
                            <span>פרטי הורים ויצירת קשר:</span>
                          </div>

                          <div className="flex flex-col gap-1 pr-5 text-body-sm text-[#665d4d]">
                            {member.motherName && (
                              <div className="flex items-center justify-between">
                                <span>אמא: {member.motherName}</span>
                                <a
                                  className="text-[#8B7355] font-label-md hover:underline dir-ltr font-mono font-medium"
                                  href={`tel:${member.motherPhone}`}
                                >
                                  {member.motherPhone}
                                </a>
                              </div>
                            )}

                            {member.fatherName && (
                              <div className="flex items-center justify-between">
                                <span>אבא: {member.fatherName}</span>
                                <a
                                  className="text-[#8B7355] font-label-md hover:underline dir-ltr font-mono font-medium"
                                  href={`tel:${member.fatherPhone}`}
                                >
                                  {member.fatherPhone}
                                </a>
                              </div>
                            )}

                            {!member.motherName && !member.fatherName && member.parentName && (
                              <div className="flex items-center justify-between">
                                <span>הורה: {member.parentName}</span>
                                <a
                                  className="text-[#8B7355] font-label-md hover:underline dir-ltr font-mono font-medium"
                                  href={`tel:${member.parentPhone}`}
                                >
                                  {member.parentPhone}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* אלרגיות והנחיות רפואיות */}
                        {member.allergies && (
                          <div className="bg-[#ffdad6]/30 rounded-xl p-2.5 flex items-start gap-2 border border-[#ffdad6]">
                            <span className="material-symbols-outlined text-[#ba1a1a] text-[18px] shrink-0 mt-0.5">
                              medical_information
                            </span>
                            <div className="flex flex-col">
                              <span className="font-label-md text-label-md text-[#93000a] font-semibold">
                                אלרגיות והנחיות רפואיות
                              </span>
                              <span className="font-body-sm text-body-sm text-[#93000a]/90">
                                {member.allergies}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* הערות נוספות אם קיימות */}
                        {member.notes && (
                          <div className="bg-[#f6f3eb] rounded-xl p-2.5 flex items-start gap-2 border border-[#E8D8B8]/40 text-xs text-[#665d4d]">
                            <span className="material-symbols-outlined text-[16px] text-[#715b3e] shrink-0 mt-0.5">
                              notes
                            </span>
                            <span>{member.notes}</span>
                          </div>
                        )}

                        {/* כפתורי פעולה בתחתית הכרטיס (עריכת פרטים והיסטוריית נוכחות) */}
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <button
                            onClick={() => handleOpenEdit(member)}
                            className="w-full py-2 px-3 rounded-xl bg-[#DCE3D3] text-[#304638] font-label-md text-label-md flex items-center justify-center gap-1.5 hover:bg-[#d0dbca] transition-colors active:scale-98 cursor-pointer font-bold"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[17px]">edit</span>
                            <span>עריכת פרטים</span>
                          </button>

                          <button
                            onClick={() => setAttendanceHistoryMember(member)}
                            className="w-full py-2 px-3 rounded-xl bg-[#eee1cc] text-[#705b3b] font-label-md text-label-md flex items-center justify-center gap-1.5 hover:bg-[#e4d3b8] transition-colors active:scale-98 cursor-pointer font-bold"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[17px]">history</span>
                            <span>היסטוריית נוכחות</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </section>

          {/* 6. כפתור הוספת חניך גדול ודביק בתחתית הדף */}
          <div className="sticky bottom-20 z-30 pt-2 pb-1">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-[#8B7355] hover:bg-[#715b3e] text-white py-3.5 px-5 rounded-2xl font-label-lg text-label-lg font-bold shadow-lg shadow-[#8B7355]/25 transition-all active:scale-98 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">group_add</span>
              <span>הוספת חניך חדש לקבוצה 👥</span>
            </button>
          </div>
        </div>
      </main>

      {/* מודאל הוספת חניך חדש */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-0 sm:p-4"
          dir="rtl"
        >
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-3.5 border border-[#E8D8B8] max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-[#DCE3D3] flex items-center justify-center text-[#715b3e]">
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                </span>
                <h2 className="font-headline-sm text-headline-sm text-[#1c1c17] font-bold">
                  הוספת חניך לקבוצה
                </h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#665d4d] hover:bg-[#ebe8e0] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {formError && (
              <div className="p-2.5 rounded-xl bg-[#ffdad6] text-[#93000a] text-xs font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-3">
              {/* העלאת תמונת פרופיל לחניך חדש (אופציונלי) */}
              <div className="flex items-center gap-3 p-3 bg-[#F6F3EB] rounded-2xl border border-[#E8D8B8]">
                <div className="relative shrink-0">
                  {newAvatarUrl ? (
                    <img
                      src={newAvatarUrl}
                      alt="תצוגה מקדימה"
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-[#8B7355]"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#DCE3D3] flex items-center justify-center text-[#715b3e]">
                      <span className="material-symbols-outlined text-[24px]">add_a_photo</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-xs font-semibold text-[#1c1c17]">תמונת פרופיל לחניך (אופציונלי)</span>
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 rounded-xl bg-[#8B7355] text-white text-xs font-bold cursor-pointer hover:bg-[#715b3e] transition-colors">
                      בחר תמונה
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => setNewAvatarUrl(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {newAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => setNewAvatarUrl('')}
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        הסר
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#665d4d] mb-1">
                  שם מלא של החניך/ה (שם פרטי ושם משפחה)*
                </label>
                <input
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full bg-[#F6F3EB] text-[#1c1c17] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 border border-[#E8D8B8]"
                  placeholder="לדוגמה: יונתן פרידמן"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#665d4d] mb-1">שכבה וכיתה*</label>
                  <input
                    value={newGradeClass}
                    onChange={(e) => setNewGradeClass(e.target.value)}
                    className="w-full bg-[#F6F3EB] text-[#1c1c17] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 border border-[#E8D8B8]"
                    placeholder="כיתה ח׳ 2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#665d4d] mb-1">מין החניך</label>
                  <div className="flex gap-1.5 h-10 items-center">
                    <button
                      type="button"
                      onClick={() => setNewGender('boy')}
                      className={`flex-1 h-full rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        newGender === 'boy'
                          ? 'bg-[#8B7355] text-white border-[#8B7355]'
                          : 'bg-[#F6F3EB] text-[#665d4d] border-[#E8D8B8]'
                      }`}
                    >
                      בן 👦
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewGender('girl')}
                      className={`flex-1 h-full rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        newGender === 'girl'
                          ? 'bg-[#8B7355] text-white border-[#8B7355]'
                          : 'bg-[#F6F3EB] text-[#665d4d] border-[#E8D8B8]'
                      }`}
                    >
                      בת 👧
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#665d4d] mb-1">טלפון חניך (אופציונלי)</label>
                  <input
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-[#F6F3EB] text-[#1c1c17] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 dir-ltr text-right border border-[#E8D8B8]"
                    placeholder="050-1234567"
                    type="tel"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#665d4d] mb-1">שם הורה ליצירת קשר</label>
                  <input
                    value={newParentName}
                    onChange={(e) => setNewParentName(e.target.value)}
                    className="w-full bg-[#F6F3EB] text-[#1c1c17] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 border border-[#E8D8B8]"
                    placeholder="למשל: מיכל פרידמן"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#665d4d] mb-1">טלפון הורה ליצירת קשר*</label>
                  <input
                    value={newParentPhone}
                    onChange={(e) => setNewParentPhone(e.target.value)}
                    className="w-full bg-[#F6F3EB] text-[#1c1c17] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 dir-ltr text-right border border-[#E8D8B8]"
                    placeholder="052-7654321"
                    required
                    type="tel"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#665d4d] mb-1">איש קשר לחירום (אם קיים)</label>
                  <input
                    value={newEmergencyPhone}
                    onChange={(e) => setNewEmergencyPhone(e.target.value)}
                    className="w-full bg-[#F6F3EB] text-[#1c1c17] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 dir-ltr text-right border border-[#E8D8B8]"
                    placeholder="טלפון חירום"
                    type="tel"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#665d4d] mb-1">אלרגיות והנחיות רפואיות</label>
                <input
                  value={newAllergies}
                  onChange={(e) => setNewAllergies(e.target.value)}
                  className="w-full bg-[#F6F3EB] text-[#1c1c17] rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 border border-[#E8D8B8]"
                  placeholder="רגישות לבוטנים, צליאק, אסתמה..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#665d4d] mb-1">הערות נוספות על החניך</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-[#F6F3EB] text-[#1c1c17] rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B7355]/30 border border-[#E8D8B8] resize-none"
                  placeholder="הערות אישיות למדריך..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-[#8B7355] hover:bg-[#715b3e] text-white py-3 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-xs"
                >
                  שמירה
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-3 px-5 rounded-xl bg-[#DCE3D3] text-[#304638] font-bold text-sm cursor-pointer"
                >
                  ביטול
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* מודאל עריכת פרטי חניך */}
      {editingMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          dir="rtl"
        >
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl flex flex-col gap-3 border border-[#E8D8B8] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-lg text-[#1c1c17]">עריכת פרטי חניך</h3>
              <button
                onClick={() => setEditingMember(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#665d4d] hover:bg-gray-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {editError && (
              <div className="p-2 rounded-lg bg-[#ffdad6] text-[#93000a] text-xs font-semibold">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-2.5">
              {/* עדכון תמונת פרופיל בעריכת חניך */}
              <div className="flex items-center gap-3 p-2.5 bg-[#F6F3EB] rounded-xl border border-[#E8D8B8]">
                <div className="relative shrink-0">
                  {editAvatarUrl ? (
                    <img
                      src={editAvatarUrl}
                      alt="תמונת חניך"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#8B7355]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#DCE3D3] flex items-center justify-center text-[#304638] font-bold text-sm">
                      {editFirstName.charAt(0)}{editLastName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-xs font-semibold text-[#1c1c17]">תמונת פרופיל של החניך</span>
                  <div className="flex items-center gap-2">
                    <label className="px-2.5 py-1 rounded-lg bg-[#8B7355] text-white text-xs font-bold cursor-pointer hover:bg-[#715b3e] transition-colors">
                      החלף תמונה
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => setEditAvatarUrl(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {editAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => setEditAvatarUrl('')}
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        הסר תמונה
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-[#665d4d]">שם פרטי</label>
                  <input
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full h-9 px-3 bg-[#F6F3EB] rounded-lg text-sm border border-[#E8D8B8]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#665d4d]">שם משפחה</label>
                  <input
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full h-9 px-3 bg-[#F6F3EB] rounded-lg text-sm border border-[#E8D8B8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-[#665d4d]">כיתה ושכבה</label>
                  <input
                    value={editGradeClass}
                    onChange={(e) => setEditGradeClass(e.target.value)}
                    className="w-full h-9 px-3 bg-[#F6F3EB] rounded-lg text-sm border border-[#E8D8B8]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#665d4d]">תפקיד בקבוצה</label>
                  <input
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full h-9 px-3 bg-[#F6F3EB] rounded-lg text-sm border border-[#E8D8B8]"
                    placeholder="חניך / ראש צוות"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#665d4d]">טלפון חניך</label>
                <input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full h-9 px-3 bg-[#F6F3EB] rounded-lg text-sm border border-[#E8D8B8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-[#665d4d]">אמא - שם וטלפון</label>
                  <input
                    value={editMotherPhone}
                    onChange={(e) => setEditMotherPhone(e.target.value)}
                    className="w-full h-9 px-3 bg-[#F6F3EB] rounded-lg text-sm border border-[#E8D8B8]"
                    placeholder="טלפון אמא"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#665d4d]">אבא - שם וטלפון</label>
                  <input
                    value={editFatherPhone}
                    onChange={(e) => setEditFatherPhone(e.target.value)}
                    className="w-full h-9 px-3 bg-[#F6F3EB] rounded-lg text-sm border border-[#E8D8B8]"
                    placeholder="טלפון אבא"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#665d4d]">אלרגיות והנחיות רפואיות</label>
                <input
                  value={editAllergies}
                  onChange={(e) => setEditAllergies(e.target.value)}
                  className="w-full h-9 px-3 bg-[#F6F3EB] rounded-lg text-sm border border-[#E8D8B8]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#665d4d]">הערות אישיות</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-2 bg-[#F6F3EB] rounded-lg text-sm border border-[#E8D8B8] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#8B7355] text-white font-bold text-sm cursor-pointer"
                >
                  שמירת שינויים
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteMember(editingMember.id);
                    setEditingMember(null);
                    showToast('החניך נמחק מהקבוצה');
                  }}
                  className="px-3 py-2 rounded-xl bg-[#ffdad6] text-[#93000a] font-bold text-sm cursor-pointer"
                >
                  מחיקה
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* מודאל היסטוריית נוכחות */}
      {attendanceHistoryMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          dir="rtl"
        >
          <div className="bg-white w-full max-w-md rounded-2xl p-5 shadow-2xl flex flex-col gap-3 border border-[#E8D8B8]">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="font-bold text-base text-[#1c1c17]">
                  היסטוריית נוכחות: {attendanceHistoryMember.firstName}{' '}
                  {attendanceHistoryMember.lastName}
                </h3>
                <span className="text-xs text-[#715b3e] font-semibold">
                  אחוז נוכחות מחושב: {attendanceHistoryMember.attendanceRate ?? 90}%
                </span>
              </div>
              <button
                onClick={() => setAttendanceHistoryMember(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#665d4d] hover:bg-gray-100 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {pastActivities.length === 0 ? (
                <p className="text-xs text-[#665d4d] text-center py-4">אין היסטוריית פעולות קודמות מתועדת</p>
              ) : (
                pastActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-2.5 rounded-xl bg-[#DCE3D3]/40 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="material-symbols-outlined text-[16px] text-[#304638]">
                        check_circle
                      </span>
                      <span className="font-semibold text-[#1c1c17] truncate">{act.title}</span>
                    </div>
                    <span className="text-[#304638] font-bold shrink-0">התייצב/ה ✓</span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setAttendanceHistoryMember(null)}
              className="w-full py-2.5 rounded-xl bg-[#8B7355] text-white font-bold text-sm cursor-pointer mt-1"
            >
              סגור
            </button>
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
