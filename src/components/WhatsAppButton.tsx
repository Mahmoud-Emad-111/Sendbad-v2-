import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const phoneNumber = '966501234567'; // رقم واتساب الشركة
  const message = encodeURIComponent('مرحباً Sindbad، أرغب باستشارة مجانية لمطبخ جديد. اسمي:');

  const handleClick = () => {
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-24 md:bottom-6 left-6 z-40 w-16 h-16 bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_12px_40px_rgba(37,211,102,0.5)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
      aria-label="تواصل عبر واتساب"
    >
      <MessageCircle className="w-8 h-8" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-4 py-2 bg-[var(--color-neutral-dark)] text-white text-sm rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
        تواصل معنا عبر واتساب
      </span>

      {/* Pulse Ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
      
      {/* Notification Dot */}
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
    </button>
  );
}