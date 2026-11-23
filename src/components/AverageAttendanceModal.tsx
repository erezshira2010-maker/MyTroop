import { useState, useMemo } from 'react';
import type { ScoutMember } from '../types';

interface AverageAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: ScoutMember[];
  averageAttendanceRate: number;
}

/**
 * מודאל "נוכחות ממוצעת" (Average Attendance Modal)
 * מוצג בלחיצה על כרטיס "נוכחות ממוצעת" במסך הבית (main.html)
 * מציג אחוז ממוצע קבוצתי מחושב, סיכום סטטיסטי, ורשימת כל החניכים עם אחוזי הנוכחות האישיים שלהם.
 */
export default function AverageAttendanceModal({
  isOpen,
  onClose,
  members,
  averageAttendanceRate,
}: AverageAttendanceModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // סינון חניכים לפי מחרוזת חיפוש
  const filteredMembers = useMemo(() => {
    if (!searchQuery.trim()) return members;
    const q = searchQuery.trim().toLowerCase();
    return members.filter((m) => {
      const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
      return fullName.includes(q) || (m.role && m.role.toLowerCase().includes(q));
    });
  }, [members, searchQuery]);

  // ספירת נתונים סטטיסטיים
  const excellentCount = members.filter((m) => (m.attendanceRate ?? 90) >= 90).length;
  const followUpCount = members.filter((m) => (m.attendanceRate ?? 90) < 85 || m.needsFollowUp).length;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="avg-attendance-title"
    >
      <div className="bg-[#F6F3EB] w-full max-w-lg rounded-3xl shadow-2xl border border-[#E2DACB] flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#E2DACB] flex items-center justify-between bg-surface-container-lowest">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#DCE3D3] flex items-center justify-center text-[#715b3e] shadow-xs">
              <span className="material-symbols-outlined text-[22px]">query_stats</span>
            </div>
            <div>
              <h2 id="avg-attendance-title" className="font-headline-sm text-headline-sm font-bold text-on-surface">
                נוכחות ממוצעת בקבוצה
              </h2>
              <p className="font-body-sm text-body-sm text-secondary">
                שקלול מכלל {members.length} החניכים והפעולות שתועדו
              </p>
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
          {/* Main Average Card */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest shadow-xs border border-[#E2DACB]/60 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-secondary">ממוצע התייצבות כולל לקבוצה</span>
              <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-[#715b3e] bg-[#DCE3D3] px-2 py-0.5 rounded-full font-bold">
                <span className="material-symbols-outlined text-[13px]">trending_up</span>
                נתון חי מחושב
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-display-lg text-display-lg text-on-surface font-extrabold tracking-tight">
                {averageAttendanceRate}%
              </span>
              <span className="font-body-sm text-body-sm text-secondary">
                ממוצע נוכחות כולל בפעולות השבט
              </span>
            </div>

            {/* Visual Bar */}
            <div className="w-full bg-[#eee1cc] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#8B7355] h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.max(0, averageAttendanceRate))}%` }}
              />
            </div>

            {/* Mini Breakdown Cards */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#E2DACB]/40 text-center">
              <div className="p-2 rounded-xl bg-[#F6F3EB]">
                <div className="font-headline-sm font-bold text-on-surface">{members.length}</div>
                <div className="font-label-sm text-[11px] text-secondary">חניכים סה״כ</div>
              </div>
              <div className="p-2 rounded-xl bg-[#DCE3D3]/50">
                <div className="font-headline-sm font-bold text-[#715b3e]">{excellentCount}</div>
                <div className="font-label-sm text-[11px] text-secondary">מעל 90% נוכחות</div>
              </div>
              <div className="p-2 rounded-xl bg-[#eee1cc]">
                <div className="font-headline-sm font-bold text-[#ba1a1a]">{followUpCount}</div>
                <div className="font-label-sm text-[11px] text-secondary">דורשים מעקב</div>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary material-symbols-outlined text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חיפוש חניך לפי שם..."
              className="w-full pr-10 pl-9 py-2.5 rounded-xl bg-surface-container-lowest border border-[#E2DACB] text-body-md text-on-surface placeholder:text-secondary/70 focus:outline-none focus:ring-2 focus:ring-[#8B7355] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Members List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-secondary font-label-md text-label-md px-1">
              <span>רשימת חניכי הקבוצה ({filteredMembers.length})</span>
              <span>אחוז נוכחות</span>
            </div>

            {filteredMembers.length === 0 ? (
              <div className="p-6 text-center text-secondary rounded-2xl bg-surface-container-lowest border border-[#E2DACB]/60">
                <span className="material-symbols-outlined text-[32px] text-secondary/60 mb-1">person_search</span>
                <p className="font-semibold text-body-md">לא נמצאו חניכים התואמים לחיפוש</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[38vh] overflow-y-auto pr-1">
                {filteredMembers.map((member) => {
                  const rate = member.attendanceRate ?? 90;
                  const attended = member.attendedActivities ?? Math.round((rate / 100) * 20);
                  const total = member.totalActivities ?? 20;

                  // צבע המחוון
                  let barColor = 'bg-[#715b3e]';
                  let textColor = 'text-[#715b3e]';
                  let badgeBg = 'bg-[#DCE3D3]';
                  if (rate < 80) {
                    barColor = 'bg-[#ba1a1a]';
                    textColor = 'text-[#ba1a1a]';
                    badgeBg = 'bg-[#ffdad6]';
                  } else if (rate < 90) {
                    barColor = 'bg-[#9E825D]';
                    textColor = 'text-[#705b3b]';
                    badgeBg = 'bg-[#eee1cc]';
                  }

                  return (
                    <div
                      key={member.id}
                      className="p-3 rounded-2xl bg-surface-container-lowest border border-[#E2DACB]/60 shadow-2xs hover:border-[#8B7355]/40 transition-colors flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
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
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] font-label-sm text-[10px] font-bold">
                                  מעקב
                                </span>
                              )}
                            </div>
                            <span className="font-body-sm text-[12px] text-secondary">
                              {member.role || member.gradeClass || 'חניך בקבוצה'} • {attended}/{total} פעולות
                            </span>
                          </div>
                        </div>

                        {/* Percentage Pill */}
                        <div className={`px-2.5 py-1 rounded-full ${badgeBg} ${textColor} font-bold text-sm`}>
                          {rate}%
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-[#eee1cc]/60 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`${barColor} h-full rounded-full transition-all duration-500`}
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2DACB] bg-surface-container-lowest flex items-center justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-5 rounded-xl bg-[#8B7355] hover:bg-[#715b3e] text-white font-bold text-sm shadow-sm transition-all cursor-pointer active:scale-[0.98]"
          >
            חזרה לדשבורד
          </button>
        </div>
      </div>
    </div>
  );
}

