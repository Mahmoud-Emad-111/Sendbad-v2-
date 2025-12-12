import { useState, useEffect, useRef } from 'react';
import { cn } from "./ui/utils";
import { Globe, Trophy, Briefcase, Zap, Clock } from 'lucide-react';

interface StatItem {
  id: number;
  value: number;
  label: string;
  suffix?: string;
  icon: any;
  featured?: boolean;
}

const stats: StatItem[] = [
  { id: 1, value: 15000, label: "مشاريع ناجحة", suffix: "+", icon: Briefcase, featured: true },
  { id: 2, value: 130, label: "دولة حول العالم", suffix: "+", icon: Globe },
  { id: 3, value: 8700, label: "معارض دولية", suffix: "+", icon: Trophy },
  { id: 4, value: 20, label: "سنة من الخبرة", icon: Clock },
  // { id: 5, value: 3, label: "خطوات سهلة", icon: Zap },
];

const useCounter = (end: number, duration: number = 2000, start: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [end, duration, start]);

  return count;
};

export function Experience() {
  const [inView, setInView] = useState<boolean>(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      dir="rtl"
      className="relative overflow-hidden py-20"
      style={{ background: 'linear-gradient(180deg, #08393b 0%, #0e6166 35%, #4ba3b3 100%)' }}
    >
      {/* Decorative shapes */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 1200 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#4ba3b3" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#08393b" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <rect width="1200" height="600" fill="url(#g1)" />
          <circle cx="1100" cy="80" r="220" fill="#ffffff10" />
          <circle cx="80" cy="520" r="260" fill="#ffffff05" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/8 backdrop-blur-sm border border-white/10 mb-4">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white font-semibold text-sm">رحلة من الإنجازات</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            خبرتنا <span className="text-white/90">في</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/90 to-white/60">أرقام</span>
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">نفخر بما حققناه معكم على مدار السنين — أرقام تروي قصة نجاحنا.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
          <div className="md:col-span-2 md:row-span-2">
            <StatCard stat={stats[0]} inView={inView} index={0} featured />
          </div>
          {stats.slice(1).map((stat, i) => (
            <StatCard key={stat.id} stat={stat} inView={inView} index={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, inView, index, featured = false }: { stat: StatItem; inView: boolean, index: number, featured?: boolean }) {
  const count = useCounter(stat.value, 2000, inView);
  const Icon = stat.icon;
  
  const animationStyle = inView 
    ? { animation: `fadeInUp 0.6s ease-out forwards ${index * 0.1}s`, opacity: 0 } 
    : { opacity: 0 }; 

  return (
    <div 
      className={cn(
        "group relative rounded-3xl transition-all duration-500",
        "bg-white/6 backdrop-blur-sm border border-white/10 text-white",
        "hover:border-white/40 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.35)]",
        "hover:-translate-y-1",
        "overflow-hidden",
        featured ? "p-8 flex flex-col justify-center h-full min-h-[320px]" : "p-4 flex flex-col justify-between h-full"
      )}
      style={animationStyle}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4ba3b3]/0 to-[#4ba3b3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className={cn(
          "inline-flex p-4 rounded-2xl mb-4 transition-all duration-300",
          "bg-white/10 group-hover:bg-white/20 group-hover:scale-110"
        )}>
          <Icon className={cn(
            "text-white transition-transform duration-300 group-hover:rotate-12",
            featured ? "w-10 h-10" : "w-6 h-6"
          )} />
        </div>

        {/* Number */}
        <div className="mb-3">
          <div className={cn(
            "font-black font-sans tracking-tight",
            "transition-all duration-300 group-hover:scale-105",
            featured ? "text-6xl lg:text-7xl" : "text-4xl lg:text-5xl"
          )}>
            <span dir="ltr" className="text-white drop-shadow-lg"   style={{ fontSize: '41px' }}>
              {count.toLocaleString()}{stat.suffix && <span className={featured ? "text-6xl" : "text-4xl"}>{stat.suffix}</span>}
            </span>
          </div>
        </div>
        
        {/* Label */}
        <h3 className={cn(
          "font-bold text-white/90 group-hover:text-white transition-colors duration-300",
          featured ? "text-2xl" : "text-lg"
        )}>
          {stat.label}
        </h3>
      </div>

      {/* Hover Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4ba3b3] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </div>
  );
}
