interface MyTroopLogoProps {
  className?: string;
  size?: number | string;
}

/**
 * לוגו MyTroop הרשמי החדש (New Original MyTroop Logo)
 * עיצוב מודרני מרובע בגווני ירוק מרווה (Sage Green #829B7A), ירוק יער כהה (Dark Forest Green #304638),
 * חום צופי עמוק (Warm Brown #8B7355) וזהב חולי (#E8D8B8).
 * כולל את שושן הצופים המסורתי (Fleur-de-lis ⚜️) ושני כוכבי התנועה (הבטחה וחוקה).
 */
export default function MyTroopLogo({ className = 'w-9 h-9', size }: MyTroopLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={`shrink-0 select-none ${className}`}
      style={size ? { width: size, height: size } : undefined}
      aria-label="לוגו MyTroop"
      role="img"
    >
      <defs>
        {/* שיפוע ירוק מרווה אל ירוק יער כהה */}
        <linearGradient id="mytroop-sage-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#829B7A" />
          <stop offset="100%" stopColor="#304638" />
        </linearGradient>

        {/* שיפוע זהב חולי עדין עבור שושן הצופים */}
        <linearGradient id="mytroop-gold-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF4DE" />
          <stop offset="100%" stopColor="#E8D8B8" />
        </linearGradient>

        {/* שיפוע חום צופי עמוק לקשר החבל */}
        <linearGradient id="mytroop-brown-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9E825D" />
          <stop offset="100%" stopColor="#715B3E" />
        </linearGradient>

        {/* צל פנימי רך */}
        <filter id="mytroop-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* רקע מרובע מודרני עם פינות מעוגלות (Squircle) */}
      <rect
        x="3"
        y="3"
        width="94"
        height="94"
        rx="22"
        fill="url(#mytroop-sage-grad)"
        stroke="#8B7355"
        strokeWidth="2"
      />

      {/* מסגרת פנימית חולית עדינה */}
      <rect
        x="7.5"
        y="7.5"
        width="85"
        height="85"
        rx="18"
        fill="none"
        stroke="#E8D8B8"
        strokeWidth="1.2"
        strokeOpacity="0.45"
      />

      {/* שושן הצופים (Fleur-de-lis ⚜️) במרכז */}
      <g filter="url(#mytroop-shadow)" transform="translate(0, 2)">
        {/* עלה מרכזי עליון */}
        <path
          d="M50 16 C53 28 58 36 61 51 C55 53 52 49 50 49 C48 49 45 53 39 51 C42 36 47 28 50 16 Z"
          fill="url(#mytroop-gold-grad)"
        />
        {/* קו שדרה מרכזי */}
        <path d="M50 18 L50 48" stroke="#715B3E" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

        {/* כנף שמאל מעוקלת */}
        <path
          d="M47 49 C40 49 24 45 22 34 C21 28 27 24 33 28 C37 31 38 37 39 44 C42 45 45 47 47 49 Z"
          fill="url(#mytroop-gold-grad)"
        />
        <path
          d="M25 33 C26 39 33 44 40 46"
          stroke="#715B3E"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />

        {/* כנף ימין מעוקלת */}
        <path
          d="M53 49 C60 49 76 45 78 34 C79 28 73 24 67 28 C63 31 62 37 61 44 C58 45 55 47 53 49 Z"
          fill="url(#mytroop-gold-grad)"
        />
        <path
          d="M75 33 C74 39 67 44 60 46"
          stroke="#715B3E"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />

        {/* קשר חבל צופי חום המאחד את העלים */}
        <rect
          x="35"
          y="50"
          width="30"
          height="8"
          rx="3"
          fill="url(#mytroop-brown-grad)"
          stroke="#E8D8B8"
          strokeWidth="1"
        />
        <circle cx="50" cy="54" r="2.2" fill="#E8D8B8" />

        {/* גבעול תחתון */}
        <path d="M44 58 C44 70 48 74 50 80 C52 74 56 70 56 58 Z" fill="url(#mytroop-gold-grad)" />
        {/* קשתות תחתונות */}
        <path d="M42 59 C37 62 35 68 38 71 C41 73 44 69 44 62 Z" fill="url(#mytroop-gold-grad)" opacity="0.9" />
        <path d="M58 59 C63 62 65 68 62 71 C59 73 56 69 56 62 Z" fill="url(#mytroop-gold-grad)" opacity="0.9" />

        {/* שני כוכבי הצופים: הבטחה וחוקה */}
        <circle cx="31" cy="35" r="1.6" fill="#304638" />
        <circle cx="69" cy="35" r="1.6" fill="#304638" />
      </g>
    </svg>
  );
}

