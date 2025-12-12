import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export function WhatsAppButton() {
  const phoneNumber = '966501234567'; // رقم واتساب الشركة
  const message = encodeURIComponent('مرحباً Sindbad، أرغب باستشارة مجانية لمطبخ جديد. اسمي:');
  const [showPrompt, setShowPrompt] = useState(false);

  const handleClick = () => {
    // Open WhatsApp chat (restore original behavior)
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    try {
      window.open(url, '_blank');
    } catch (e) {
      // fallback to navigating in the same tab
      window.location.href = url;
    }
  };

  useEffect(() => {
    let hideTimer: any;
    // show the prompt every 5 seconds for 2 seconds
    const showFor = () => {
      setShowPrompt(true);
      hideTimer = setTimeout(() => {
        setShowPrompt(false);
      }, 2000);
    };

    const interval = setInterval(showFor, 5000);
    // schedule first show after 5s as well
    const first = setTimeout(showFor, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(first);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div>
      <button
        onClick={handleClick}
        className="fixed bottom-24 md:bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.5)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
        aria-label="تواصل عبر واتساب"
      >
        <MessageCircle className="w-8 h-8" />

        {/* tooltip removed - timing-based prompt used instead */}

        {/* Pulse Ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>

        {/* Notification Dot */}
        <span className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
      </button>

      {/* Timed prompt bubble */}
      {showPrompt && (
        <div
          data-debug-whatsapp-prompt
          style={{
            position: 'fixed',
            right: '24px',
            bottom: '96px',
            zIndex: 999999,
            pointerEvents: 'auto',
          }}
        >
          <div
            id="__whatsapp_prompt_inner"
            style={{
              background: 'rgba(255,255,255,0.98)',
              color: '#111827',
              padding: '10px 14px',
              borderRadius: '14px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.06)',
              fontSize: '14px',
            }}
            className="flex items-center gap-3"
          >
            <div className="text-sm">How can I help you?</div>
          </div>
        </div>
      )}
    </div>
  );
}