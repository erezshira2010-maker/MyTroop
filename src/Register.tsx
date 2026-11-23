import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase/config';
import type { UserProfile } from './types';
import { defaultUserProfile } from './data/mockData';
import MyTroopLogo from './components/MyTroopLogo';

interface RegisterProps {
  onAuthSuccess?: (user: UserProfile) => void;
  initialMode?: 'register' | 'login';
}

// רשימת השבטים המוגדרים מראש במערכת
const VALID_TRIBES = ['ofek', 'yuval', 'alon', 'givatayim', 'carmel'];

// רשימת שכבות הגיל הנתמכות בצופים (ד׳–י״ב)
const VALID_LAYERS = [
  'daled',
  'heh',
  'vav',
  'zayin',
  'chet',
  'tet',
  'yod',
  'yod-alef',
  'yod-bet',
];

/**
 * פונקציות ולידציה מפורטות לכל שדה בטופס
 */

// 1. בדיקת שם מלא: שם פרטי ושם משפחה, לפחות 2 אותיות בכל שם, ללא מספרים או אימוג'ים
const validateFullName = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) {
    return 'יש להזין שם פרטי ושם משפחה תקינים, עם לפחות 2 אותיות בכל שם';
  }

  // חלוקה למילים לפי רווחים
  const parts = trimmed.split(/\s+/);
  if (parts.length < 2) {
    return 'יש להזין שם פרטי ושם משפחה תקינים, עם לפחות 2 אותיות בכל שם';
  }

  // תווי שם חוקיים: אותיות עבריות, אנגליות, רווחים, מקפים וגרשים בלבד
  const nameRegex = /^[\u0590-\u05FFa-zA-Z' -]+$/;
  if (!nameRegex.test(trimmed)) {
    return 'יש להזין שם פרטי ושם משפחה תקינים, עם לפחות 2 אותיות בכל שם';
  }

  // בדיקה שבכל חלק (שם פרטי ושם משפחה) יש לפחות 2 אותיות (ללא ספירת מקפים וגרשים)
  const allPartsHaveTwoLetters = parts.every((part) => {
    const lettersOnly = part.replace(/[^a-zA-Z\u0590-\u05FF]/g, '');
    return lettersOnly.length >= 2;
  });

  if (!allPartsHaveTwoLetters) {
    return 'יש להזין שם פרטי ושם משפחה תקינים, עם לפחות 2 אותיות בכל שם';
  }

  return '';
};

// 2. בדיקת אימייל: תבנית חוקית מלאה name@example.com, שטרודל אחד וסיומת דומיין
const validateEmail = (email: string): string => {
  const trimmed = email.trim();
  if (!trimmed) {
    return 'יש להזין כתובת אימייל תקינה';
  }

  // ביטוי רגולרי לאימות כתובת אימייל מלאה ללא רווחים
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmed)) {
    return 'יש להזין כתובת אימייל תקינה';
  }

  return '';
};

// 3. בדיקת סיסמה: לפחות 8 תווים, אות גדולה, אות קטנה ומספר
const validatePassword = (password: string): string => {
  if (!password) {
    return 'הסיסמה חייבת להכיל לפחות 8 תווים, אות גדולה, אות קטנה ומספר';
  }

  if (password.length < 8) {
    return 'הסיסמה חייבת להכיל לפחות 8 תווים, אות גדולה, אות קטנה ומספר';
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return 'הסיסמה חייבת להכיל לפחות 8 תווים, אות גדולה, אות קטנה ומספר';
  }

  return '';
};

// 4. בדיקת שבט: בחירה מתוך רשימת השבטים המוגדרת
const validateShevet = (shevet: string): string => {
  if (!shevet || !VALID_TRIBES.includes(shevet)) {
    return 'יש לבחור שבט מהרשימה';
  }
  return '';
};

// 5. בדיקת שם קבוצה/גדוד: בין 2 ל-50 תווים תקינים, אותיות, מספרים, מקפים ורווחים
const validatePatrol = (patrol: string): string => {
  const trimmed = patrol.trim();
  if (!trimmed || trimmed.length < 2 || trimmed.length > 50) {
    return 'שם הקבוצה חייב להכיל לפחות 2 תווים תקינים';
  }

  // מותר אותיות, מספרים, רווחים ומקפים
  const patrolRegex = /^[\u0590-\u05FFa-zA-Z0-9 -]+$/;
  if (!patrolRegex.test(trimmed)) {
    return 'שם הקבוצה חייב להכיל לפחות 2 תווים תקינים';
  }

  // וידוא שיש לפחות 2 אותיות או ספרות (ולא רק מקפים ורווחים)
  const lettersOrDigits = trimmed.replace(/[^a-zA-Z0-9\u0590-\u05FF]/g, '');
  if (lettersOrDigits.length < 2) {
    return 'שם הקבוצה חייב להכיל לפחות 2 תווים תקינים';
  }

  return '';
};

// 6. בדיקת שכבת גיל: בחירה מתוך הרשימה הנתמכת (ד׳–י״ב)
const validateLayer = (layer: string): string => {
  if (!layer || !VALID_LAYERS.includes(layer)) {
    return 'יש לבחור שכבת גיל תקינה';
  }
  return '';
};

/**
 * קומפוננטת הרשמה והתחברות עם ולידציה מלאה והודעות שגיאה
 */
export default function Register({ onAuthSuccess, initialMode = 'register' }: RegisterProps = {}) {
  // מצב נוכחי: 'register' (הרשמה) או 'login' (התחברות)
  const [currentMode, setCurrentMode] = useState<'register' | 'login'>(initialMode);

  // סנכרון מצב בעת התנתקות או שינוי מצב חיצוני
  useEffect(() => {
    if (initialMode) {
      setCurrentMode(initialMode);
    }
  }, [initialMode]);

  // מצב הצגת סיסמה: מוסתרת (false) או גלויה (true)
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // מצב שליחת הטופס: 'idle' (רגיל), 'loading' (בטעינה), 'success' (הצלחה)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // הודעות כלליות (הצלחה או שגיאת שרת כללית)
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [generalError, setGeneralError] = useState<string>('');

  /* ========================================================
     משתני State נפרדים לערכי השדות (ללא אוסף נתונים)
     ======================================================== */
  const [fullname, setFullname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [shevet, setShevet] = useState<string>('');
  const [patrol, setPatrol] = useState<string>('');
  const [layer, setLayer] = useState<string>('');

  /* ========================================================
     משתני State נפרדים להודעות שגיאה לכל שדה
     ======================================================== */
  const [fullnameError, setFullnameError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [shevetError, setShevetError] = useState<string>('');
  const [patrolError, setPatrolError] = useState<string>('');
  const [layerError, setLayerError] = useState<string>('');

  // בדיקת עזר: האם אנחנו במצב הרשמה
  const isRegister = currentMode === 'register';

  /* ========================================================
     פונקציות עדכון (Handler) שמנקות את השגיאה כשהמשתמש מתקן
     ======================================================== */
  const handleFullnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullname(e.target.value);
    if (fullnameError) {
      setFullnameError(''); // הסרת הודעת השגיאה כשהמשתמש מתקן
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handleShevetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setShevet(e.target.value);
    if (shevetError) {
      setShevetError('');
    }
  };

  const handlePatrolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPatrol(e.target.value);
    if (patrolError) {
      setPatrolError('');
    }
  };

  const handleLayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLayer(e.target.value);
    if (layerError) {
      setLayerError('');
    }
  };

  // החלפת לשונית בין הרשמה להתחברות
  const switchAuthTab = (mode: 'register' | 'login') => {
    setCurrentMode(mode);
    // איפוס שגיאות והודעות במעבר בין לשוניות
    setFullnameError('');
    setEmailError('');
    setPasswordError('');
    setShevetError('');
    setPatrolError('');
    setLayerError('');
    setGeneralError('');
    setSuccessMessage('');
  };

  const toggleModeFromLink = () => {
    switchAuthTab(isRegister ? 'login' : 'register');
  };

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  /**
   * בדיקת כל השדות בעת לחיצה על כפתור השליחה
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');

    if (isRegister) {
      // בדיקת כל השדות ברישום
      const nameErr = validateFullName(fullname);
      const mailErr = validateEmail(email);
      const passErr = validatePassword(password);
      const shevErr = validateShevet(shevet);
      const patrErr = validatePatrol(patrol);
      const layErr = validateLayer(layer);

      // עדכון ה-State של כל שגיאה בנפרד
      setFullnameError(nameErr);
      setEmailError(mailErr);
      setPasswordError(passErr);
      setShevetError(shevErr);
      setPatrolError(patrErr);
      setLayerError(layErr);

      // אם יש שגיאה באחד השדות - חוסמים את השליחה!
      if (nameErr || mailErr || passErr || shevErr || patrErr || layErr) {
        return;
      }
    } else {
      // בדיקות מצב התחברות
      const mailErr = validateEmail(email);
      const passErr = password ? '' : 'יש להזין סיסמה';
      setEmailError(mailErr);
      setPasswordError(passErr);
      if (mailErr || passErr) {
        return;
      }
    }

    // אם כל השדות תקינים, מתחילים תהליך רישום מאובטח
    setSubmitStatus('loading');

    try {
      // בדיקה אם Firebase Auth מוגדר עם מפתחות אמיתיים
      const hasRealFirebaseConfig =
        auth &&
        auth.app.options.apiKey &&
        auth.app.options.apiKey !== 'your_api_key_here' &&
        auth.app.options.apiKey !== 'demo-api-key';

      if (hasRealFirebaseConfig && isRegister) {
        // רישום מאובטח באמצעות Firebase Auth - הסיסמה מוצפנת ולא נשמרת בגלוי!
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        // הדמיית שליחה מקומית כשהמפתחות טרם הוגדרו ב-.env
        await new Promise((resolve) => setTimeout(resolve, 900));
      }

      setSubmitStatus('success');
      setSuccessMessage(isRegister ? 'החשבון נוצר בהצלחה! ברוך הבא למשפחת המדריכים!' : 'התחברת בהצלחה! מעביר ללוח הבקרה...');

      // מיפוי שמות עבריים לשבט ולשכבה
      const tribeNames: Record<string, string> = {
        ofek: 'שבט אופק',
        yuval: 'שבט יובל',
        alon: 'שבט אלון',
        givatayim: 'שבט גבעתיים',
        carmel: 'שבט כרמל',
      };
      const layerNames: Record<string, string> = {
        daled: 'ד׳ - עופרים',
        heh: 'ה׳ - נחשונים',
        vav: 'ו׳ - משוטטים',
        zayin: 'ז׳ - חותרים',
        chet: 'ח׳ - נעורים',
        tet: 'ט׳ - קורס הדרכה',
        yod: 'י׳ - שכבה בוגרת',
        'yod-alef': 'י״א - שכב״ג',
        'yod-bet': 'י״ב - שמיניסטים',
      };

      const userProfile: UserProfile = {
        id: `leader-${Date.now()}`,
        fullName: isRegister ? fullname.trim() : (fullname.trim() || defaultUserProfile.fullName),
        email: email.trim() || defaultUserProfile.email,
        shevet: shevet || defaultUserProfile.shevet,
        shevetName: tribeNames[shevet] || defaultUserProfile.shevetName,
        gdud: defaultUserProfile.gdud,
        patrol: patrol.trim() || defaultUserProfile.patrol,
        layer: layer || defaultUserProfile.layer,
        layerName: layerNames[layer] || defaultUserProfile.layerName,
        avatarUrl: defaultUserProfile.avatarUrl,
      };

      setTimeout(() => {
        setSubmitStatus('idle');
        if (onAuthSuccess) {
          onAuthSuccess(userProfile);
        }
      }, 1200);
    } catch (err: unknown) {
      setSubmitStatus('idle');
      const firebaseError = err as { code?: string; message?: string };

      if (firebaseError?.code === 'auth/email-already-in-use') {
        // הודעת שגיאה מתאימה בעברית אם האימייל כבר רשום
        setEmailError('כתובת האימייל כבר רשומה במערכת');
      } else if (firebaseError?.code === 'auth/weak-password') {
        setPasswordError('הסיסמה חייבת להכיל לפחות 8 תווים, אות גדולה, אות קטנה ומספר');
      } else if (firebaseError?.code === 'auth/invalid-email') {
        setEmailError('יש להזין כתובת אימייל תקינה');
      } else {
        setGeneralError('אירעה שגיאה ברישום. אנא נסה שוב מאוחר יותר.');
      }
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-6 sm:px-6 bg-[#F6F3EB]">
      {/* מיכל ממורכז עם הגבלת רוחב למובייל ולדסקטופ וריווחים נעימים */}
      <div className="w-full max-w-md mx-auto flex flex-col pb-safe">
        {/* Interactive Top Atmosphere / Warm Glow Decor */}
        <div className="relative w-full overflow-hidden pt-2 pb-3">
          {/* Soft Decorative Khaki / Brown Circles */}
          <div className="absolute -top-10 -right-8 w-44 h-44 rounded-full bg-[#DCE3D3]/40 blur-2xl pointer-events-none"></div>
          <div className="absolute top-6 -left-10 w-36 h-36 rounded-full bg-[#9E825D]/20 blur-xl pointer-events-none"></div>

          {/* Centered Brand Identity */}
          <div className="flex flex-col items-center justify-center text-center relative z-10 px-4">
            {/* Scout App Emblem / New Original MyTroop Square Logo */}
            <div className="relative mb-2.5 transition-transform duration-300 hover:scale-105">
              <div className="p-1 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-[#E2DACB]">
                <MyTroopLogo className="w-12 h-12 rounded-xl" />
              </div>
              <span className="absolute -bottom-1 -left-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9E825D] opacity-60"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#8B7355] text-[9px] text-white items-center justify-center">
                  ⚜
                </span>
              </span>
            </div>
            <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight">
              ברוכים הבאים ל־MyTroop
            </h1>
            <p className="font-body-sm text-body-sm text-secondary mt-1 flex items-center gap-1.5 justify-center">
              <span>כל מה שמדריך צריך, במקום אחד</span>
              <span className="text-sm">🏕️</span>
            </p>
          </div>
        </div>

        {/* Main Card Surface Container עם ריווח פנימי ומסגרת מוגדרת */}
        <div className="w-full bg-white rounded-3xl p-5 sm:p-6 shadow-sm mb-4 relative z-10 border border-[#E2DACB]">
          {/* Tab Pill Switcher (הרשמה / התחברות) */}
          <div
            className="bg-[#F1EEE6] p-1 rounded-full flex items-center relative mb-4 border border-[#E2DACB]"
            role="tablist"
          >
            <button
              aria-selected={isRegister}
              className={`flex-1 py-2 px-3 rounded-full font-label-md text-label-md text-center transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                isRegister
                  ? 'bg-[#8B7355] text-white shadow-sm'
                  : 'text-[#665D4D] hover:text-on-surface'
              }`}
              id="tab-register"
              onClick={() => switchAuthTab('register')}
              role="tab"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">how_to_reg</span>
              <span>הרשמת מדריך</span>
            </button>
            <button
              aria-selected={!isRegister}
              className={`flex-1 py-2 px-3 rounded-full font-label-md text-label-md text-center transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                !isRegister
                  ? 'bg-[#8B7355] text-white shadow-sm'
                  : 'text-[#665D4D] hover:text-on-surface'
              }`}
              id="tab-login"
              onClick={() => switchAuthTab('login')}
              role="tab"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">login</span>
              <span>התחברות</span>
            </button>
          </div>

          {/* הודעת הצלחה ראשית */}
          {successMessage && (
            <div className="mb-3.5 p-3 bg-[#DCE3D3]/80 border border-[#8B7355]/40 rounded-xl flex items-center gap-2 text-on-surface">
              <span className="material-symbols-outlined text-[#8B7355] text-[20px]">
                check_circle
              </span>
              <span className="text-body-sm font-semibold">{successMessage}</span>
            </div>
          )}

          {/* הודעת שגיאה כללית */}
          {generalError && (
            <div className="mb-3.5 p-3 bg-red-50 border border-red-300 rounded-xl flex items-center gap-2 text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span className="text-body-sm font-medium">{generalError}</span>
            </div>
          )}

          {/* Live Registration Dynamic Form */}
          <form className="flex flex-col gap-3.5" id="auth-form" noValidate onSubmit={handleSubmit}>
            {/* Field 1: Full Name */}
            <div
              className={`flex flex-col gap-1 transition-all duration-300 ${isRegister ? '' : 'hidden'}`}
              id="field-fullname"
            >
              <label
                className="font-label-sm text-label-sm text-[#665D4D] flex items-center justify-between"
                htmlFor="reg-name"
              >
                <span>שם מלא</span>
                <span className="text-[11px] text-[#8B7355] flex items-center gap-0.5" id="name-status">
                  <span className="material-symbols-outlined text-[13px]">
                    {fullname && !fullnameError ? 'check_circle' : 'info'}
                  </span>
                  <span>שם פרטי ומשפחה</span>
                </span>
              </label>
              <div className="relative flex items-center">
                <input
                  className={`w-full h-11 pr-10 pl-4 bg-[#DCE3D3]/35 text-on-surface rounded-xl font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all placeholder:text-outline border ${
                    fullnameError
                      ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500'
                      : 'border-[#D1C5B1]/40 focus:ring-2 focus:ring-[#8B7355]'
                  }`}
                  id="reg-name"
                  name="fullname"
                  placeholder="נועם לוי"
                  type="text"
                  value={fullname}
                  onChange={handleFullnameChange}
                />
                <div className="absolute right-3 text-[#7A6548] flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[19px]">person</span>
                </div>
              </div>
              {/* הודעת שגיאה ישירות מתחת לשדה */}
              {fullnameError && (
                <span className="text-[11px] text-[#ba1a1a] font-medium flex items-center gap-1 mt-0.5 pr-1">
                  <span className="material-symbols-outlined text-[13px]">error</span>
                  <span>{fullnameError}</span>
                </span>
              )}
            </div>

            {/* Field 2: Email */}
            <div className="flex flex-col gap-1">
              <label
                className="font-label-sm text-label-sm text-[#665D4D] flex items-center justify-between"
                htmlFor="reg-email"
              >
                <span>כתובת אימייל</span>
                <span className="text-[11px] text-secondary">אישי או צופי</span>
              </label>
              <div className="relative flex items-center">
                <input
                  className={`w-full h-11 pr-10 pl-4 text-right bg-[#DCE3D3]/35 text-on-surface rounded-xl font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all placeholder:text-outline border ${
                    emailError
                      ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500'
                      : 'border-[#D1C5B1]/40 focus:ring-2 focus:ring-[#8B7355]'
                  }`}
                  dir="ltr"
                  id="reg-email"
                  name="email"
                  placeholder="noam@tzofim.org.il"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                />
                <div className="absolute right-3 text-[#7A6548] flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[19px]">mail</span>
                </div>
              </div>
              {/* הודעת שגיאה ישירות מתחת לשדה */}
              {emailError && (
                <span className="text-[11px] text-[#ba1a1a] font-medium flex items-center gap-1 mt-0.5 pr-1">
                  <span className="material-symbols-outlined text-[13px]">error</span>
                  <span>{emailError}</span>
                </span>
              )}
            </div>

            {/* Field 3: Password + Toggle Visibility */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="font-label-sm text-label-sm text-[#665D4D]" htmlFor="reg-pass">
                  סיסמה מאובטחת
                </label>
                <a
                  className={`${isRegister ? 'hidden' : ''} text-[11px] text-[#8B7355] hover:underline font-label-sm`}
                  href="#"
                  id="forgot-pass-link"
                >
                  שכחת סיסמה?
                </a>
              </div>
              <div className="relative flex items-center">
                <input
                  className={`w-full h-11 pr-10 pl-10 bg-[#DCE3D3]/35 text-on-surface rounded-xl font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all placeholder:text-outline border ${
                    passwordError
                      ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500'
                      : 'border-[#D1C5B1]/40 focus:ring-2 focus:ring-[#8B7355]'
                  }`}
                  id="reg-pass"
                  name="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                />
                <div className="absolute right-3 text-[#7A6548] flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[19px]">lock</span>
                </div>
                <button
                  aria-label="הצג או הסתר סיסמה"
                  className="absolute left-3 text-[#7A6548] hover:text-on-surface focus:outline-none p-1 flex items-center cursor-pointer"
                  onClick={togglePassword}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[19px]" id="eye-icon">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
              {/* הודעת שגיאה ישירות מתחת לשדה */}
              {passwordError && (
                <span className="text-[11px] text-[#ba1a1a] font-medium flex items-center gap-1 mt-0.5 pr-1">
                  <span className="material-symbols-outlined text-[13px]">error</span>
                  <span>{passwordError}</span>
                </span>
              )}
            </div>

            {/* Field 4: Scout Shevet Dropdown */}
            <div
              className={`flex flex-col gap-1 transition-all duration-300 ${isRegister ? '' : 'hidden'}`}
              id="field-shevet"
            >
              <label
                className="font-label-sm text-label-sm text-[#665D4D] flex items-center justify-between"
                htmlFor="reg-shevet"
              >
                <span>בחירת שבט והנהגה</span>
                <span className="text-[11px] text-secondary">מרחב פעילות</span>
              </label>
              <div className="relative flex items-center">
                <select
                  className={`w-full h-11 pr-10 pl-9 bg-[#DCE3D3]/35 text-on-surface rounded-xl font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none transition-all appearance-none cursor-pointer border ${
                    shevetError
                      ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500'
                      : 'border-[#D1C5B1]/40 focus:ring-2 focus:ring-[#8B7355]'
                  }`}
                  id="reg-shevet"
                  name="shevet"
                  value={shevet}
                  onChange={handleShevetChange}
                >
                  <option value="">בחר/י שבט</option>
                  <option value="ofek">שבט אופק - הנהגת מרכז</option>
                  <option value="yuval">שבט יובל - הנהגת שרון צפון</option>
                  <option value="alon">שבט אלון - הנהגת תל אביב</option>
                  <option value="givatayim">שבט גבעתיים - הנהגת דן</option>
                  <option value="carmel">שבט כרמל - הנהגת חיפה</option>
                </select>
                <div className="absolute right-3 text-[#7A6548] flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[19px]">holiday_village</span>
                </div>
                <div className="absolute left-3 text-[#7A6548] flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
              </div>
              {/* הודעת שגיאה ישירות מתחת לשדה */}
              {shevetError && (
                <span className="text-[11px] text-[#ba1a1a] font-medium flex items-center gap-1 mt-0.5 pr-1">
                  <span className="material-symbols-outlined text-[13px]">error</span>
                  <span>{shevetError}</span>
                </span>
              )}
            </div>

            {/* Field 5 & 6: Patrol Name & Age Layer (Side-by-Side) */}
            <div
              className={`grid grid-cols-2 gap-2.5 transition-all duration-300 ${isRegister ? '' : 'hidden'}`}
              id="field-group-details"
            >
              {/* Field 5: Patrol / Group */}
              <div className="flex flex-col gap-1 min-w-0">
                <label className="font-label-sm text-label-sm text-[#665D4D] truncate" htmlFor="reg-patrol">
                  שם הקבוצה / גדוד
                </label>
                <div className="relative flex items-center">
                  <input
                    className={`w-full h-11 pr-8 pl-2 bg-[#DCE3D3]/35 text-on-surface rounded-xl font-body-sm text-body-sm focus:bg-surface-container-lowest focus:outline-none transition-all placeholder:text-outline border ${
                      patrolError
                        ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500'
                        : 'border-[#D1C5B1]/40 focus:ring-2 focus:ring-[#8B7355]'
                    }`}
                    id="reg-patrol"
                    name="patrol"
                    placeholder="סיירת נשר"
                    type="text"
                    value={patrol}
                    onChange={handlePatrolChange}
                  />
                  <div className="absolute right-2 text-[#7A6548] flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-[16px]">groups</span>
                  </div>
                </div>
                {/* הודעת שגיאה ישירות מתחת לשדה */}
                {patrolError && (
                  <span className="text-[10px] text-[#ba1a1a] font-medium flex items-center gap-0.5 mt-0.5 pr-0.5 leading-tight">
                    <span className="material-symbols-outlined text-[12px] shrink-0">error</span>
                    <span>{patrolError}</span>
                  </span>
                )}
              </div>

              {/* Field 6: Age Layer / Grade (Predefined Dropdown ד׳–י״ב) */}
              <div className="flex flex-col gap-1 min-w-0">
                <label className="font-label-sm text-label-sm text-[#665D4D] truncate" htmlFor="reg-layer">
                  שכבת גיל
                </label>
                <div className="relative flex items-center">
                  <select
                    className={`w-full h-11 pr-8 pl-6 bg-[#DCE3D3]/35 text-on-surface rounded-xl font-body-sm text-body-sm focus:bg-surface-container-lowest focus:outline-none transition-all appearance-none cursor-pointer border ${
                      layerError
                        ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500'
                        : 'border-[#D1C5B1]/40 focus:ring-2 focus:ring-[#8B7355]'
                    }`}
                    id="reg-layer"
                    name="layer"
                    value={layer}
                    onChange={handleLayerChange}
                  >
                    <option value="">בחר/י שכבה</option>
                    <option value="daled">ד׳ - עופרים</option>
                    <option value="heh">ה׳ - נחשונים</option>
                    <option value="vav">ו׳ - משוטטים</option>
                    <option value="zayin">ז׳ - חותרים</option>
                    <option value="chet">ח׳ - נעורים</option>
                    <option value="tet">ט׳ - קורס הדרכה</option>
                    <option value="yod">י׳ - שכבה בוגרת</option>
                    <option value="yod-alef">י״א - שכב״ג</option>
                    <option value="yod-bet">י״ב - שמיניסטים</option>
                  </select>
                  <div className="absolute right-2 text-[#7A6548] flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-[16px]">school</span>
                  </div>
                  <div className="absolute left-2 text-[#7A6548] flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                  </div>
                </div>
                {/* הודעת שגיאה ישירות מתחת לשדה */}
                {layerError && (
                  <span className="text-[10px] text-[#ba1a1a] font-medium flex items-center gap-0.5 mt-0.5 pr-0.5 leading-tight">
                    <span className="material-symbols-outlined text-[12px] shrink-0">error</span>
                    <span>{layerError}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                className="w-full h-12 bg-[#8B7355] hover:bg-[#7A6548] text-white rounded-xl font-label-lg text-label-lg shadow-sm active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                disabled={submitStatus === 'loading'}
                id="btn-submit"
                type="submit"
              >
                {submitStatus === 'loading' && (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">
                      autorenew
                    </span>
                    <span>מתחבר לשבט...</span>
                  </>
                )}
                {submitStatus === 'success' && (
                  <>
                    <span className="material-symbols-outlined text-[20px]">check</span>
                    <span>ברוך הבא למשפחת המדריכים!</span>
                  </>
                )}
                {submitStatus === 'idle' && (
                  <>
                    <span className="material-symbols-outlined text-[20px]">explore</span>
                    <span id="btn-submit-text">
                      {isRegister ? 'יצירת חשבון מדריך' : 'כניסה למערכת המדריך'}
                    </span>
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Switch Mode Link */}
          <div className="mt-4 pt-3 text-center flex flex-col gap-2.5">
            <button
              className="font-body-sm text-body-sm text-[#7A6548] hover:underline transition-colors cursor-pointer"
              id="switch-link"
              onClick={toggleModeFromLink}
              type="button"
            >
              {isRegister ? (
                <>
                  כבר יש לך חשבון מדריך?{' '}
                  <strong className="font-label-sm underline decoration-[#8B7355]">
                    התחברות מהירה
                  </strong>
                </>
              ) : (
                <>
                  מדריך חדש בשבט?{' '}
                  <strong className="font-label-sm underline decoration-[#8B7355]">
                    פתיחת חשבון כאן
                  </strong>
                </>
              )}
            </button>

            {onAuthSuccess && (
              <button
                type="button"
                onClick={() => onAuthSuccess(defaultUserProfile)}
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#eee1cc]/80 hover:bg-[#eee1cc] text-[#4e4637] font-semibold text-xs border border-[#8B7355]/20 transition-all cursor-pointer shadow-2xs"
              >
                <span className="material-symbols-outlined text-[16px] text-[#8B7355]">login</span>
                <span>כניסה מהירה כמדריך לדוגמה (נועם כהן)</span>
              </button>
            )}
          </div>
        </div>

        {/* Trust Seal / Footer Card */}
        <div className="w-full bg-[#DCE3D3]/40 border border-[#D1C5B1]/50 rounded-2xl p-3 flex items-center justify-between gap-3 text-secondary mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#F6F3EB] flex items-center justify-center text-[#8B7355] shrink-0 border border-[#D1C5B1]/40">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-on-surface">
                תנועת הצופים העבריים בישראל
              </span>
              <span className="text-[11px] text-secondary">
                מרחב ניהול מאובטח למדריכים ורשג״דים
              </span>
            </div>
          </div>
          <span className="text-base select-none shrink-0" title="היה נכון">
            ⚜️
          </span>
        </div>
      </div>
    </main>
  );
}
