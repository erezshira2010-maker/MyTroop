
export type NavTab = 'dashboard' | 'members' | 'activities' | 'ideas';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

/**
 * סרגל ניווט תחתון קבוע (Fixed Bottom Navigation Bar)
 * שחזור מדויק של תגית ה-nav מ-main.html עם 4 כפתורי ניווט בעברית והדגשת הלשונית הפעילה
 */
export default function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  const navItems: { id: NavTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'בית', icon: 'home' },
    { id: 'members', label: 'חניכים', icon: 'group' },
    { id: 'activities', label: 'פעולות', icon: 'event' },
    { id: 'ideas', label: 'רעיונות', icon: 'lightbulb' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-white/95 backdrop-blur-xl shadow-[0_-4px_20px_rgba(70,55,30,0.06)] rounded-t-xl border-t border-[#E2DACB]/40">
      <div className="flex justify-around items-center h-16 px-space-xs max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[64px] h-12 transition-all px-space-xs cursor-pointer ${
                isActive
                  ? 'text-[#8B7355] font-bold bg-[#DCE3D3]/80 rounded-xl'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
              <span className="font-label-sm text-label-sm">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
