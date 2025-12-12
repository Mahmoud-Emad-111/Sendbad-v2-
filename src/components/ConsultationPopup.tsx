import { useEffect, useState } from 'react';

interface ConsultationPopupProps {
  onOpenConsultation: () => void;
  delayMs?: number; // delay before showing popup (default 5000)
  countdownSec?: number; // seconds to show before auto-dismiss (default 4)
}

export function ConsultationPopup({ onOpenConsultation, delayMs = 5000, countdownSec = 4 }: ConsultationPopupProps) {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState<number>(countdownSec);

  useEffect(() => {
    // don't show if previously shown this session
    try {
      if (localStorage.getItem('consultPopupShown')) return;
    } catch (e) {}

    const t = setTimeout(() => setVisible(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  useEffect(() => {
    if (!visible) return;
    setCount(countdownSec);
    const iv = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          // hide and mark shown
          setVisible(false);
          try { localStorage.setItem('consultPopupShown', '1'); } catch (e) {}
          clearInterval(iv);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [visible, countdownSec]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto"
      onClick={() => console.log('[ConsultationPopup] wrapper clicked')}
      onPointerDown={() => console.log('[ConsultationPopup] wrapper pointerdown')}
    >
      <div
        className="w-full max-w-md mx-4 pointer-events-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100 p-6 flex items-start gap-4 transform transition-all duration-300"
        onClick={() => console.log('[ConsultationPopup] inner box clicked')}
      >
        <div className="flex-1">
          <div className="font-bold text-lg text-gray-900">هل ترغب باستشارة مجانية؟</div>
          <div className="text-sm text-gray-600 mt-1">أخبرنا ببعض التفاصيل وسنعاود الاتصال خلال 24 ساعة.</div>

          <div className="mt-4 flex items-center gap-3">
            <button
              id="consult-popup-cta"
              onClick={() => {
                console.log('[ConsultationPopup] CTA clicked');
                try { localStorage.setItem('consultPopupShown', '1'); } catch (e) {}
                setVisible(false);
                try { onOpenConsultation(); console.log('[ConsultationPopup] called onOpenConsultation'); } catch (e) { console.error(e); }
                // dispatch global event as a fallback so other code can listen
                try { window.dispatchEvent(new Event('open:consultation')); console.log('[ConsultationPopup] dispatched open:consultation'); } catch (e) { console.error(e); }
              }}
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:brightness-105 transition"
            >
              احجز استشارتك المجانية الآن
            </button>

            <div className="ml-auto flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center">
                <div className="text-red-600 font-semibold">{count}</div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => { try { localStorage.setItem('consultPopupShown', '1'); } catch (e) {} setVisible(false); }}
          className="text-gray-400 hover:text-gray-600 p-2 rounded-full"
          aria-label="اغلاق"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default ConsultationPopup;
