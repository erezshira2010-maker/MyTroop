import { useState, useMemo, useEffect } from 'react';
import type { Activity, ScoutMember } from '../types';
import { formatActivityDateTime } from '../services/storage';

interface PreviousActivityModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  members: ScoutMember[];
  onSaveAttendance: (actId: string, presentIds: string[], absentIds: string[]) => void;
  onViewPlan?: (act: Activity) => void;
}

type FilterView = 'all' | 'present' | 'absent';

/**
 * מודאל "בפעולה הקודמת" (Previous Activity Attendance Modal)
 * מוצג בלחיצה על כרטיס "בפעולה הקודמת" במסך הבית (main.html)
 * מציג את פרטי הפעולה, כמות החניכים שהתייצבו, אחוז נוכחות,
 * רשימת החניכים שנכחו ורשימת החניכים שנעדרו,
 * ומאפשר עריכת נוכחות מלאה ודינמית המעדכנת את הסטטיסטיקות בדשבורד.
 */
export default function PreviousActivityModal({
  activity,
  isOpen,
  onClose,
  members,
  onSaveAttendance,
  onViewPlan,
}: PreviousActivityModalProps) {
  // מצב עריכת נוכחות
  const [isEditing, setIsEditing] = useState(false);

  // סינון רשימת חניכים: הכל / נוכחים / נעדרים
  const [filterView, setFilterView] = useState<FilterView>('all');

  // מפת נוכחות מקומית: memberId -> boolean
  const [presenceMap, setPresenceMap] = useState<Record<string, boolean>>({});

  // אתחול מפת הנוכחות לפי הפעולה בעת פתיחת המודאל
  useEffect(() => {
    if (!activity) return;

    const initialMap: Record<string, boolean> = {};

    // 1. אם יש מזהים שמורים של נוכחים
    if (activity.presentMemberIds && activity.presentMemberIds.length > 0) {
      members.forEach((m) => {
        initialMap[m.id] = activity.presentMemberIds!.includes(m.id);
      });
    } else if (activity.absentMemberIds && activity.absentMemberIds.length > 0) {
      members.forEach((m) => {
        initialMap[m.id] = !activity.absentMemberIds!.includes(m.id);
      });
    } else if (activity.attendedCount !== undefined) {
      // אם יש ספירה בלבד - מחלקים לפי הספירה (חניכים שדורשים מעקב כברירת מחדל נעדרים)
      const count = activity.attendedCount;
      let assignedPresent = 0;

      // קודם נותנים נוכחות לחניכים שאינם דורשים מעקב
      members.forEach((m) => {
        if (!m.needsFollowUp && assignedPresent < count) {
          initialMap[m.id] = true;
          assignedPresent++;
        } else {
          initialMap[m.id] = false;
        }
      });

      // אם עדיין חסר כדי להגיע ל-count
      if (assignedPresent < count) {
        members.forEach((m) => {
          if (!initialMap[m.id] && assignedPresent < count) {
            initialMap[m.id] = true;
            assignedPresent++;
          }
        });
      }
    } else {
      // ברירת מחדל: רוב החניכים נוכחים
      members.forEach((m) => {
        initialMap[m.id] = (m.attendanceRate ?? 90) >= 80;
      });
    }

    setPresenceMap(initialMap);
    setIsEditing(false);
    setFilterView('all');
  }, [activity, members, isOpen]);

  // רשימת נוכחים ונעדרים
  const presentMembers = useMemo(() => {
    return members.filter((m) => presenceMap[m.id] === true);
  }, [members, presenceMap]);

  const absentMembers = useMemo(() => {
    return members.filter((m) => !presenceMap[m.id]);
  }, [members, presenceMap]);

  // סטטיסטיקה מחושבת בזמן אמת
  const totalCount = members.length || (activity?.totalExpected ?? 24);
  const presentCount = presentMembers.length;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  // חניכים מוצגים בהתאם לסינון
  const displayedMembers = useMemo(() => {
    if (filterView === 'present') return presentMembers;
    if (filterView === 'absent') return absentMembers;
    return members;
  }, [filterView, presentMembers, absentMembers, members]);

  // החלפת סטטוס נוכחות של חניך
  const handleToggleMember = (memberId: string) => {
    setPresenceMap((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }));
  };

  // סימון כל החניכים כנוכחים
  const handleMarkAllPresent = () => {
    const allTrue: Record<string, boolean> = {};
    members.forEach((m) => {
      allTrue[m.id] = true;
    });
    setPresenceMap(allTrue);
  };

  // שמירת הנוכחות
  const handleSave = () => {
    if (!activity) return;
    const presentIds = members.filter((m) => presenceMap[m.id]).map((m) => m.id);
    const absentIds = members.filter((m) => !presenceMap[m.id]).map((m) => m.id);

    onSaveAttendance(activity.id, presentIds, absentIds);
    setIsEditing(false);
  };

  // ביטול עריכה
  const handleCancelEdit = () => {
    // שחזור המצב המקורי
    if (activity) {
      const origMap: Record<string, boolean> = {};
      members.forEach((m) => {
        if (activity.presentMemberIds) {
          origMap[m.id] = activity.presentMemberIds.includes(m.id);
        } else if (activity.attendedCount !== undefined) {
          origMap[m.id] = (m.attendanceRate ?? 90) >= 80;
        } else {
          origMap[m.id] = true;
        }
      });
      setPresenceMap(origMap);
    }
    setIsEditing(false);
  };

  if (!isOpen || !activity) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prev-activity-title"
    >
      <div className="bg-[#F6F3EB] w-full max-w-lg rounded-3xl shadow-2xl border border-[#E2DACB] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#E2DACB] flex items-center justify-between bg-surface-container-lowest">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DCE3D3] flex items-center justify-center text-[#715b3e] shadow-xs">
              <span className="material-symbols-outlined text-[22px]">how_to_reg</span>
            </div>
            <div>
              <div className="inline-flex items-center gap-1 font-label-sm text-[11px] text-[#715b3e] font-bold">
                <span>פעולה שהסתיימה</span>
                <span>•</span>
                <span>{formatActivityDateTime(activity.date)}</span>
              </div>
              <h2 id="prev-activity-title" className="font-headline-sm text-headline-sm font-bold text-on-surface line-clamp-1">
                {activity.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="סגירת חלון"
            className="w-9 h-9 rounded-full flex items-center justify-center text-secondary hover:bg-[#eee1cc] hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Activity Metadata Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eee1cc] text-[#4e4637] font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[15px] text-[#715b3e]">location_on</span>
              <span>{activity.location}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#DCE3D3] text-[#4d453c] font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[14px]">
                {activity.categoryIcon || 'groups'}
              </span>
              <span>{activity.category}</span>
            </span>
          </div>

          {/* Attendance Stats Card */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-xs border border-[#E2DACB]/60 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-secondary">
                {isEditing ? 'עדכון נתוני התייצבות בזמן אמת' : 'סיכום התייצבות בפעולה'}
              </span>
              <span className="font-label-sm text-label-sm text-[#715b3e] flex items-center gap-0.5 font-bold">
                <span className="material-symbols-outlined text-[14px]">done_all</span>
                {attendanceRate}% התייצבות
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display-lg text-display-lg text-on-surface font-extrabold tracking-tight">
                  {presentCount}
                </span>
                <span className="font-body-md text-body-md text-secondary">
                  חניכים התייצבו מתוך {totalCount}
                </span>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-[#8B7355] text-white hover:bg-[#715b3e] font-label-md text-label-md font-bold shadow-2xs transition-all cursor-pointer active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">edit_note</span>
                  <span>עריכת נוכחות</span>
                </button>
              )}
            </div>

            {/* Attendance Progress Bar */}
            <div className="w-full bg-[#eee1cc] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#8B7355] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, attendanceRate))}%` }}
              />
            </div>

            {/* Attendance Ratio Badges */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E2DACB]/40 text-center">
              <div className="p-2 rounded-xl bg-[#DCE3D3]/60 flex items-center justify-center gap-1.5 text-[#715b3e]">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span className="font-bold text-sm">{presentCount} נוכחים</span>
              </div>
              <div className="p-2 rounded-xl bg-[#ffdad6]/60 flex items-center justify-center gap-1.5 text-[#ba1a1a]">
                <span className="material-symbols-outlined text-[16px]">cancel</span>
                <span className="font-bold text-sm">{absentMembers.length} חיסורים</span>
              </div>
            </div>
          </div>

          {/* Edit Mode Instruction & Mark All Present */}
          {isEditing && (
            <div className="p-3 rounded-2xl bg-[#eee1cc] border border-[#E2DACB] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#715b3e]">touch_app</span>
                <span className="font-body-sm text-body-sm text-[#4e4637] font-semibold">
                  לחץ על חניך כדי לשנות בין נוכח לנעדר
                </span>
              </div>
              <button
                type="button"
                onClick={handleMarkAllPresent}
                className="py-1 px-2.5 rounded-lg bg-surface-container-lowest text-[#715b3e] hover:bg-[#DCE3D3] font-label-sm text-label-sm font-bold border border-[#E2DACB] transition-colors cursor-pointer"
              >
                סמן הכל כנוכח
              </button>
            </div>
          )}

          {/* Segmented Filter Tabs (רק במצב צפייה) */}
          {!isEditing && (
            <div className="flex items-center gap-1 bg-[#F1EEE6] p-1 rounded-2xl border border-[#E2DACB]">
              <button
                onClick={() => setFilterView('all')}
                className={`flex-1 py-1.5 px-3 rounded-xl font-label-md text-label-md font-bold transition-all ${
                  filterView === 'all'
                    ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                כל החניכים ({members.length})
              </button>
              <button
                onClick={() => setFilterView('present')}
                className={`flex-1 py-1.5 px-3 rounded-xl font-label-md text-label-md font-bold transition-all flex items-center justify-center gap-1 ${
                  filterView === 'present'
                    ? 'bg-[#DCE3D3] text-[#715b3e] shadow-xs'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                <span>נכחו ({presentCount})</span>
              </button>
              <button
                onClick={() => setFilterView('absent')}
                className={`flex-1 py-1.5 px-3 rounded-xl font-label-md text-label-md font-bold transition-all flex items-center justify-center gap-1 ${
                  filterView === 'absent'
                    ? 'bg-[#ffdad6] text-[#ba1a1a] shadow-xs'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                <span>נעדרו ({absentMembers.length})</span>
              </button>
            </div>
          )}

          {/* Member List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-secondary font-label-md text-label-md px-1">
              <span>רשימת חניכים ({displayedMembers.length})</span>
              <span>{isEditing ? 'שינוי סטטוס' : 'סטטוס בפעולה'}</span>
            </div>

            <div className="space-y-2 max-h-[36vh] overflow-y-auto pr-1">
              {displayedMembers.map((member) => {
                const isPresent = Boolean(presenceMap[member.id]);

                return (
                  <div
                    key={member.id}
                    onClick={() => {
                      if (isEditing) handleToggleMember(member.id);
                    }}
                    className={`p-3 rounded-2xl bg-surface-container-lowest border shadow-2xs transition-all flex items-center justify-between gap-3 ${
                      isEditing
                        ? 'cursor-pointer hover:border-[#8B7355] active:scale-[0.99]'
                        : 'border-[#E2DACB]/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={`${member.firstName} ${member.lastName}`}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-[#E2DACB]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#DCE3D3] text-[#715b3e] font-bold text-sm flex items-center justify-center">
                          {member.firstName[0]}
                          {member.lastName[0]}
                        </div>
                      )}

                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-on-surface text-body-md">
                            {member.firstName} {member.lastName}
                          </span>
                          {member.needsFollowUp && (
                            <span className="px-1.5 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] font-label-sm text-[10px] font-bold">
                              מעקב
                            </span>
                          )}
                        </div>
                        <span className="font-body-sm text-[12px] text-secondary">
                          {member.role || member.gradeClass || 'חניך בקבוצה'}
                        </span>
                      </div>
                    </div>

                    {/* Status Pill or Interactive Button */}
                    {isEditing ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleMember(member.id);
                        }}
                        className={`py-1.5 px-3 rounded-xl font-label-md text-label-md font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isPresent
                            ? 'bg-[#DCE3D3] text-[#715b3e] ring-1 ring-[#8B7355]/30'
                            : 'bg-[#ffdad6] text-[#ba1a1a] ring-1 ring-[#ba1a1a]/30'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {isPresent ? 'check_circle' : 'cancel'}
                        </span>
                        <span>{isPresent ? 'נוכח' : 'נעדר'}</span>
                      </button>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-sm text-label-sm font-bold ${
                          isPresent
                            ? 'bg-[#DCE3D3] text-[#715b3e]'
                            : 'bg-[#ffdad6] text-[#ba1a1a]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {isPresent ? 'check' : 'close'}
                        </span>
                        <span>{isPresent ? 'נכח/ה' : 'נעדר/ה'}</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E2DACB] bg-surface-container-lowest flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#8B7355] hover:bg-[#715b3e] text-white font-bold text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>שמירת שינויים ועדכון דשבורד</span>
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="py-2.5 px-4 rounded-xl bg-[#eee1cc] text-[#4e4637] hover:bg-[#e4d4bd] font-bold text-sm transition-all cursor-pointer"
              >
                ביטול
              </button>
            </>
          ) : (
            <>
              {onViewPlan && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onViewPlan(activity);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#DCE3D3] hover:bg-[#d0dbca] text-on-surface font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  <span>צפייה במערך הפעולה</span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-5 rounded-xl bg-[#8B7355] hover:bg-[#715b3e] text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
              >
                חזרה לדשבורד
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

