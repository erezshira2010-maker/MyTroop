import type { Activity } from '../types';
import { formatActivityDateTime } from '../services/storage';

interface ViewPlanModalProps {
  activity: Activity | null;
  onClose: () => void;
  onEdit: (activity: Activity) => void;
}

/**
 * מודאל צפייה במערך פעולה מלא (View Activity Plan)
 * מציג את כל פרטי הפעולה: זמנים, מיקום, מטרות, ציוד ומהלך שלבי הפעולה
 */
export default function ViewPlanModal({ activity, onClose, onEdit }: ViewPlanModalProps) {
  if (!activity) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 transition-all"
      dir="rtl"
    >
      <div className="bg-[#F6F3EB] w-full sm:max-w-xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* כותרת עליונה של המודאל */}
        <div className="p-4 bg-white border-b border-[#E2DACB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-full bg-[#DCE3D3] flex items-center justify-center text-[#715b3e]">
              <span className="material-symbols-outlined text-[20px]">description</span>
            </span>
            <div>
              <h2 className="text-headline-sm font-bold text-on-surface">מערך פעולה מלא</h2>
              <span className="text-label-sm text-secondary">{activity.category}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="סגירה"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors text-secondary cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* תוכן המערך בגלילה */}
        <div className="p-5 overflow-y-auto flex flex-col gap-4">
          {/* כותרת הפעולה ומועד */}
          <div className="bg-white p-4 rounded-2xl border border-[#E2DACB]/60 shadow-xs">
            <h3 className="text-xl font-bold text-on-surface mb-2">{activity.title}</h3>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#eee1cc] text-[#4e4637] font-medium">
                <span className="material-symbols-outlined text-[15px] text-[#715b3e]">schedule</span>
                <span>{formatActivityDateTime(activity.date)}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#DCE3D3] text-[#4d453c] font-medium">
                <span className="material-symbols-outlined text-[15px] text-[#715b3e]">location_on</span>
                <span>{activity.location}</span>
              </span>
            </div>

            {activity.description && (
              <p className="mt-3 text-body-md text-secondary leading-relaxed border-t border-[#E2DACB]/40 pt-2.5">
                {activity.description}
              </p>
            )}
          </div>

          {/* מטרות הפעולה */}
          {activity.goals && activity.goals.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-[#E2DACB]/60 shadow-xs">
              <div className="flex items-center gap-2 mb-2.5 text-[#715b3e] font-semibold text-label-lg">
                <span className="material-symbols-outlined text-[18px]">target</span>
                <h4>מטרות הפעולה</h4>
              </div>
              <ul className="flex flex-col gap-2">
                {activity.goals.map((goal, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-body-sm text-on-surface">
                    <span className="w-5 h-5 rounded-full bg-[#DCE3D3] text-[#715b3e] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ציוד דרוש */}
          <div className="bg-white p-4 rounded-2xl border border-[#E2DACB]/60 shadow-xs">
            <div className="flex items-center gap-2 mb-2 text-[#715b3e] font-semibold text-label-lg">
              <span className="material-symbols-outlined text-[18px]">handyman</span>
              <h4>ציוד ומצרכים</h4>
            </div>
            <p className="text-body-sm text-[#4d453c] bg-[#DCE3D3]/40 p-3 rounded-xl leading-relaxed">
              {activity.equipment || 'לא נדרש ציוד מיוחד לפעולה זו.'}
            </p>
          </div>

          {/* מהלך הפעולה שלב אחר שלב */}
          {activity.steps && activity.steps.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-[#E2DACB]/60 shadow-xs">
              <div className="flex items-center gap-2 mb-3 text-[#715b3e] font-semibold text-label-lg">
                <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
                <h4>מהלך הפעולה (שלב אחר שלב)</h4>
              </div>
              <div className="flex flex-col gap-3">
                {activity.steps.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#F6F3EB] border border-[#E2DACB]/40 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-body-md text-on-surface">
                        שלב {idx + 1}: {step.title}
                      </span>
                      <span className="text-[11px] font-semibold bg-[#eee1cc] text-[#705b3b] px-2 py-0.5 rounded-full">
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-body-sm text-secondary leading-relaxed">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* כפתורי פעולה תחתונים */}
        <div className="p-4 bg-white border-t border-[#E2DACB] flex gap-3 pb-safe">
          <button
            onClick={() => {
              onClose();
              onEdit(activity);
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#8B7355] hover:bg-[#715b3e] text-white font-label-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            <span>עריכת פעולה</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-[#DCE3D3] hover:bg-[#d0dbca] text-on-surface font-label-lg cursor-pointer active:scale-[0.98] transition-all"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
}
