import { useState } from 'react';
import type { UserProfile } from '../types';

interface ProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (updated: UserProfile) => void;
  onLogout: () => void;
}

/**
 * מודאל פרופיל מדריך (Profile Menu & Details)
 * מציג את פרטי החשבון המלאים, מאפשר עריכת פרופיל והתנתקות מאובטחת
 */
export default function ProfileModal({
  user,
  isOpen,
  onClose,
  onSaveProfile,
  onLogout,
}: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user.fullName);
  const [shevetName, setShevetName] = useState(user.shevetName);
  const [gdud, setGdud] = useState(user.gdud);
  const [patrol, setPatrol] = useState(user.patrol);
  const [layerName, setLayerName] = useState(user.layerName);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const updated: UserProfile = {
      ...user,
      fullName: fullName.trim(),
      shevetName: shevetName.trim(),
      gdud: gdud.trim(),
      patrol: patrol.trim(),
      layerName: layerName.trim(),
    };

    onSaveProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsEditing(false);
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4"
      dir="rtl"
    >
      <div className="bg-[#F6F3EB] w-full sm:max-w-md max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* כותרת עליונה */}
        <div className="p-4 bg-white border-b border-[#E2DACB] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-full bg-[#DCE3D3] flex items-center justify-center text-[#715b3e]">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </span>
            <h2 className="text-headline-sm font-bold text-on-surface">פרופיל מדריך</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="סגירה"
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container-high text-secondary cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* הודעת הצלחה בשמירה */}
        {savedSuccess && (
          <div className="bg-[#DCE3D3] text-[#304638] px-4 py-2 text-sm font-bold text-center">
            הפרופיל עודכן בהצלחה! ⚜️
          </div>
        )}

        <div className="p-5 overflow-y-auto flex flex-col gap-4">
          {/* כרטיס תמונת פרופיל ושם */}
          <div className="bg-white p-4 rounded-2xl border border-[#E2DACB]/60 shadow-xs flex flex-col items-center text-center">
            <div className="relative mb-3">
              <img
                src={
                  user.avatarUrl ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBOocxAeW088iNI7lMsO5LU3rhluu_Gs0z6k35ya3IAux6C7HwjZl7ovwWEkyG--uodsO3OWoyMm7fTsL0a9R0iiTPjE0RMhFiQtpIdvNEh8QegZh1oYvftMCwk5VGrVUvp9Qjq1woKWRXGj43P_2O7xmsLcThaftjJ1FZyLOpkUnRpqqYpVnPEX859CJGnXgUeTGvvnoHgcwFMtGxz3ILclBRgkCqjoKuhVqQgdTlAmIyEVqAfk_Jm'
                }
                alt={user.fullName}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-[#8B7355]/20 shadow-sm"
              />
              <span className="absolute bottom-0 left-0 w-6 h-6 rounded-full bg-[#8B7355] text-white flex items-center justify-center text-xs shadow-xs">
                ⚜
              </span>
            </div>
            <h3 className="text-lg font-bold text-on-surface">{user.fullName}</h3>
            <span className="text-body-sm text-secondary">{user.email}</span>
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DCE3D3]/70 text-[#4e4637] text-xs font-semibold">
              <span className="material-symbols-outlined text-[15px] text-[#715b3e]">badge</span>
              <span>מדריך בצופים העבריים</span>
            </div>
          </div>

          {!isEditing ? (
            /* תצוגת פרטי הפרופיל */
            <div className="bg-white p-4 rounded-2xl border border-[#E2DACB]/60 shadow-xs flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E2DACB]/40">
                <span className="text-label-sm text-secondary">שבט והנהגה:</span>
                <span className="text-body-md font-semibold text-on-surface">{user.shevetName}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#E2DACB]/40">
                <span className="text-label-sm text-secondary">גדוד:</span>
                <span className="text-body-md font-semibold text-on-surface">{user.gdud || 'לא הוגדר'}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-[#E2DACB]/40">
                <span className="text-label-sm text-secondary">שם הקבוצה:</span>
                <span className="text-body-md font-semibold text-on-surface">{user.patrol}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-label-sm text-secondary">שכבת גיל:</span>
                <span className="text-body-md font-semibold text-on-surface">{user.layerName}</span>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 py-2 px-3 rounded-xl bg-[#eee1cc] hover:bg-[#e4d3b8] text-[#4e4637] font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">edit</span>
                <span>עריכת פרטי חשבון</span>
              </button>
            </div>
          ) : (
            /* טופס עריכת פרטי פרופיל */
            <form onSubmit={handleSave} className="bg-white p-4 rounded-2xl border border-[#E2DACB]/60 shadow-xs flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-label-sm font-semibold text-[#665D4D]">שם מלא</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F6F3EB] rounded-xl text-body-sm text-on-surface border border-[#D1C5B1]/50 focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-label-sm font-semibold text-[#665D4D]">שבט</label>
                <input
                  type="text"
                  value={shevetName}
                  onChange={(e) => setShevetName(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F6F3EB] rounded-xl text-body-sm text-on-surface border border-[#D1C5B1]/50 focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-label-sm font-semibold text-[#665D4D]">גדוד</label>
                  <input
                    type="text"
                    value={gdud}
                    onChange={(e) => setGdud(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F6F3EB] rounded-xl text-body-sm text-on-surface border border-[#D1C5B1]/50 focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-label-sm font-semibold text-[#665D4D]">שם קבוצה</label>
                  <input
                    type="text"
                    value={patrol}
                    onChange={(e) => setPatrol(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F6F3EB] rounded-xl text-body-sm text-on-surface border border-[#D1C5B1]/50 focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-label-sm font-semibold text-[#665D4D]">שכבת גיל</label>
                <input
                  type="text"
                  value={layerName}
                  onChange={(e) => setLayerName(e.target.value)}
                  className="w-full h-10 px-3 bg-[#F6F3EB] rounded-xl text-body-sm text-on-surface border border-[#D1C5B1]/50 focus:outline-none focus:ring-2 focus:ring-[#8B7355]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#8B7355] hover:bg-[#715b3e] text-white text-sm font-semibold cursor-pointer shadow-xs"
                >
                  שמור פרטים
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="py-2 px-4 rounded-xl bg-[#DCE3D3] text-on-surface text-sm font-semibold cursor-pointer"
                >
                  ביטול
                </button>
              </div>
            </form>
          )}

          {/* כפתור התנתקות מאובטחת */}
          <div className="pt-2 pb-safe">
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-label-lg flex items-center justify-center gap-2 border border-red-200 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px]">logout</span>
              <span>התנתקות מהמערכת</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
