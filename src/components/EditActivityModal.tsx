import { useState, useEffect } from 'react';
import type { Activity } from '../types';

interface EditActivityModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedActivity: Activity) => void;
}

/**
 * טופס עריכת פעולה (Edit Activity Modal)
 * מאפשר עדכון פרטי הפעולה, ולידציה ושמירה מיידית
 */
export default function EditActivityModal({
  activity,
  isOpen,
  onClose,
  onSave,
}: EditActivityModalProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('צופיות מעשית');
  const [equipment, setEquipment] = useState('');
  const [description, setDescription] = useState('');

  // שגיאות ולידציה
  const [titleError, setTitleError] = useState('');
  const [dateError, setDateError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (activity) {
      setTitle(activity.title || '');
      setLocation(activity.location || '');
      setCategory(activity.category || 'צופיות מעשית');
      setEquipment(activity.equipment || '');
      setDescription(activity.description || '');

      // פיצול תאריך ושעה מתוך מחרוזת ה-ISO
      if (activity.date) {
        try {
          const d = new Date(activity.date);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          const hh = String(d.getHours()).padStart(2, '0');
          const min = String(d.getMinutes()).padStart(2, '0');
          setDate(`${yyyy}-${mm}-${dd}`);
          setTime(`${hh}:${min}`);
        } catch {
          setDate('');
          setTime('17:30');
        }
      }
    }
  }, [activity]);

  if (!isOpen || !activity) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTitleError('');
    setDateError('');
    setLocationError('');

    // בדיקת ולידציה
    let hasError = false;
    if (!title.trim() || title.trim().length < 3) {
      setTitleError('יש להזין שם פעולה תקין (לפחות 3 תווים)');
      hasError = true;
    }
    if (!date) {
      setDateError('יש לבחור תאריך לפעולה');
      hasError = true;
    }
    if (!location.trim() || location.trim().length < 2) {
      setLocationError('יש להזין מיקום לפעולה');
      hasError = true;
    }

    if (hasError) return;

    // יצירת תאריך מלא מתוך יום ושעה
    const [hours, minutes] = (time || '17:30').split(':');
    const fullDate = new Date(date);
    fullDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    const updated: Activity = {
      ...activity,
      title: title.trim(),
      date: fullDate.toISOString(),
      location: location.trim(),
      category: category.trim(),
      equipment: equipment.trim(),
      description: description.trim(),
    };

    onSave(updated);
    setToastMessage('הפעולה עודכנה בהצלחה! ⚜️');

    setTimeout(() => {
      setToastMessage('');
      onClose();
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
      dir="rtl"
    >
      <div className="bg-[#F6F3EB] w-full sm:max-w-lg max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* כותרת הטופס */}
        <div className="p-4 bg-white border-b border-[#E2DACB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-full bg-[#DCE3D3] flex items-center justify-center text-[#715b3e]">
              <span className="material-symbols-outlined text-[20px]">edit_calendar</span>
            </span>
            <h2 className="text-headline-sm font-bold text-on-surface">עריכת פעולה</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="סגירה"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container-high text-secondary cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* הודעת הצלחה אם עודכנה */}
        {toastMessage && (
          <div className="bg-[#DCE3D3] text-[#304638] px-4 py-2.5 font-semibold text-center text-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* טופס עריכה בגלילה */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex flex-col gap-3.5">
          {/* שדה: שם הפעולה */}
          <div className="flex flex-col gap-1">
            <label className="text-label-sm font-semibold text-[#665D4D]" htmlFor="edit-title">
              שם הפעולה
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError('');
              }}
              className={`w-full h-11 px-3.5 bg-white rounded-xl text-body-md text-on-surface border focus:outline-none transition-all ${
                titleError ? 'border-red-500 ring-1 ring-red-500' : 'border-[#D1C5B1]/50 focus:ring-2 focus:ring-[#8B7355]'
              }`}
              placeholder="לדוגמה: פעולת אש ובישול צופי"
            />
            {titleError && <span className="text-[11px] text-red-600 font-medium">{titleError}</span>}
          </div>

          {/* שדה: תאריך ושעה side-by-side */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-label-sm font-semibold text-[#665D4D]" htmlFor="edit-date">
                תאריך
              </label>
              <input
                id="edit-date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (dateError) setDateError('');
                }}
                className={`w-full h-11 px-3 bg-white rounded-xl text-body-sm text-on-surface border focus:outline-none transition-all ${
                  dateError ? 'border-red-500 ring-1 ring-red-500' : 'border-[#D1C5B1]/50 focus:ring-2 focus:ring-[#8B7355]'
                }`}
              />
              {dateError && <span className="text-[11px] text-red-600 font-medium">{dateError}</span>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-label-sm font-semibold text-[#665D4D]" htmlFor="edit-time">
                שעה
              </label>
              <input
                id="edit-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-11 px-3 bg-white rounded-xl text-body-sm text-on-surface border border-[#D1C5B1]/50 focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
              />
            </div>
          </div>

          {/* שדה: קטגוריית פעולה */}
          <div className="flex flex-col gap-1">
            <label className="text-label-sm font-semibold text-[#665D4D]" htmlFor="edit-category">
              קטגוריית פעולה
            </label>
            <select
              id="edit-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-3 bg-white rounded-xl text-body-sm text-on-surface border border-[#D1C5B1]/50 focus:outline-none focus:ring-2 focus:ring-[#8B7355] cursor-pointer"
            >
              <option value="צופיות מעשית">צופיות מעשית</option>
              <option value="גיבוש ועבודת צוות">גיבוש ועבודת צוות</option>
              <option value="ערכים ומנהיגות">ערכים ומנהיגות</option>
              <option value="טבע וקיימות">טבע וקיימות</option>
              <option value="מסורת ומורשת">מסורת ומורשת</option>
            </select>
          </div>

          {/* שדה: מיקום הפעולה */}
          <div className="flex flex-col gap-1">
            <label className="text-label-sm font-semibold text-[#665D4D]" htmlFor="edit-location">
              מיקום הפעולה
            </label>
            <input
              id="edit-location"
              type="text"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                if (locationError) setLocationError('');
              }}
              className={`w-full h-11 px-3.5 bg-white rounded-xl text-body-md text-on-surface border focus:outline-none transition-all ${
                locationError ? 'border-red-500 ring-1 ring-red-500' : 'border-[#D1C5B1]/50 focus:ring-2 focus:ring-[#8B7355]'
              }`}
              placeholder="מתחם החורשה, שבט אופק"
            />
            {locationError && <span className="text-[11px] text-red-600 font-medium">{locationError}</span>}
          </div>

          {/* שדה: ציוד דרוש ומצרכים */}
          <div className="flex flex-col gap-1">
            <label className="text-label-sm font-semibold text-[#665D4D]" htmlFor="edit-equipment">
              ציוד דרוש ומצרכים
            </label>
            <textarea
              id="edit-equipment"
              rows={2}
              value={equipment}
              onChange={(e) => setEquipment(e.target.value)}
              className="w-full p-3 bg-white rounded-xl text-body-sm text-on-surface border border-[#D1C5B1]/50 focus:outline-none focus:ring-2 focus:ring-[#8B7355] resize-none"
              placeholder="קרשים יבשים, מקלות דקים, כירות שדה, תפוחי אדמה..."
            />
          </div>

          {/* שדה: תיאור הפעולה */}
          <div className="flex flex-col gap-1">
            <label className="text-label-sm font-semibold text-[#665D4D]" htmlFor="edit-desc">
              תיאור קצר ומטרות
            </label>
            <textarea
              id="edit-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-white rounded-xl text-body-sm text-on-surface border border-[#D1C5B1]/50 focus:outline-none focus:ring-2 focus:ring-[#8B7355] resize-none"
              placeholder="התנסות מעשית בבניית מדורת שדה..."
            />
          </div>

          {/* כפתורי שמירה וביטול */}
          <div className="flex gap-3 pt-2 pb-safe">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#8B7355] hover:bg-[#715b3e] text-white font-label-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>שמירת שינויים</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl bg-[#DCE3D3] hover:bg-[#d0dbca] text-on-surface font-label-lg cursor-pointer active:scale-[0.98] transition-all"
            >
              ביטול
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
