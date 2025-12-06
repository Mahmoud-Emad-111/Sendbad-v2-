import { useState, useEffect } from 'react';
import { X, Sparkles, Star, Trophy, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface WelcomeOfferModalProps {
  onGetOffer: () => void;
}

export function WelcomeOfferModal({ onGetOffer }: WelcomeOfferModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenOffer = sessionStorage.getItem('hasSeenWelcomeOffer');
    
    if (!hasSeenOffer) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        requestAnimationFrame(() => setIsVisible(true));
        sessionStorage.setItem('hasSeenWelcomeOffer', 'true');
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setIsOpen(false), 500);
  };

  const handleClaim = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsOpen(false);
      onGetOffer();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 bg-black/95 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      
      {/* Modal Container */}
      <div className={`
        relative w-full max-w-md mx-4 transform transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)
        ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-12 opacity-0'}
      `}>
        
        {/* Main Card - Solid & Premium */}
        <div className="relative bg-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-800">
          
          {/* Top Decorative Line - Gold Gradient */}
          <div className="h-2 w-full bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728]" />

          {/* Close Button */}
          <button 
            onClick={handleClose}
            className="absolute top-6 right-6 z-20 text-gray-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-10 text-center relative z-10">
            
            {/* Premium Icon Badge */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                {/* Glow behind */}
                <div className="absolute inset-0 bg-[#bf953f]/20 blur-2xl rounded-full" />
                <div className="relative w-20 h-20 bg-gradient-to-b from-[#1a1a1c] to-[#0a0a0c] border border-[#3a3a3e] rounded-2xl flex items-center justify-center shadow-2xl rotate-45 transform transition-transform hover:rotate-0 duration-500">
                  <div className="transform -rotate-45 hover:rotate-0 transition-transform duration-500">
                    <Trophy className="w-8 h-8 text-[#fcf6ba] drop-shadow-[0_0_10px_rgba(252,246,186,0.5)]" />
                  </div>
                </div>
                {/* Star Accent */}
                <div className="absolute -top-4 -right-4">
                  <Star className="w-8 h-8 text-[#bf953f] fill-[#bf953f] animate-spin-slow opacity-80" />
                </div>
              </div>
            </div>

            {/* Typography */}
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
              عرض حصري للأعضاء الجدد
            </h2>
            <p className="text-gray-400 text-sm mb-8 font-light tracking-wide">
              WELCOME EXCLUSIVE OFFER
            </p>

            {/* The Offer */}
            <div className="relative py-8 my-6 bg-black/40 rounded-2xl border border-zinc-800">
               <div className="relative flex flex-col items-center justify-center gap-1">
                 <span className="text-lg text-amber-500 font-medium tracking-widest uppercase text-[10px]">Discount</span>
                 <div className="text-6xl font-black text-amber-400 drop-shadow-sm">
                   17%
                 </div>
                 <span className="text-gray-500 text-xs tracking-wider">ON YOUR FIRST CONSULTATION</span>
               </div>
            </div>

            {/* CTA */}
            <div className="space-y-4 pt-2">
              <Button 
                variant="primary" 
                size="lg" 
                fullWidth
                onClick={handleClaim}
                className="!bg-[#bf953f] hover:!bg-[#aa771c] !text-black font-extrabold tracking-wide !rounded-xl !py-5 shadow-[0_0_20px_rgba(191,149,63,0.3)] hover:shadow-[0_0_30px_rgba(191,149,63,0.5)] transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-center gap-2">
                  <span>احصل على العرض الآن</span>
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
