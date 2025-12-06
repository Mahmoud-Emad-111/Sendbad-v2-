import { useState } from 'react';
import { Calculator, Sparkles, ArrowRight, Check } from 'lucide-react';
import { Button } from './Button';

interface ModernEstimatorProps {
  onRequestConsultation?: (data: any) => void;
}

export function ModernEstimator({ onRequestConsultation }: ModernEstimatorProps) {
  const [step, setStep] = useState(1);
  const [area, setArea] = useState(10);
  const [material, setMaterial] = useState('wood');
  const [units, setUnits] = useState(8);
  const [style, setStyle] = useState('modern');
  const [estimate, setEstimate] = useState<{ min: number; max: number } | null>(null);

  const calculateEstimate = () => {
    const basePricePerMeter = material === 'mdf' ? 1500 : material === 'wood' ? 2500 : 3500;
    const unitPrice = 800;
    const styleMultiplier = style === 'modern' ? 1.2 : style === 'classic' ? 1.15 : 1;
    
    const min = Math.floor((area * basePricePerMeter + units * unitPrice) * styleMultiplier * 0.9);
    const max = Math.ceil((area * basePricePerMeter + units * unitPrice) * styleMultiplier * 1.1);
    
    setEstimate({ min, max });
    setStep(4);
  };

  const materials = [
    { 
      value: 'mdf', 
      label: 'MDF', 
      desc: 'اقتصادي وعملي',
      price: '1,500 ر.س/م²',
      icon: '🪵'
    },
    { 
      value: 'wood', 
      label: 'خشب طبيعي', 
      desc: 'متوسط الفخامة',
      price: '2,500 ر.س/م²',
      icon: '🌳'
    },
    { 
      value: 'premium', 
      label: 'بريميوم', 
      desc: 'فاخر وراقي',
      price: '3,500 ر.س/م²',
      icon: '✨'
    },
  ];

  const styles = [
    { value: 'modern', label: 'عصري', icon: '🏢' },
    { value: 'classic', label: 'كلاسيكي', icon: '🏛️' },
    { value: 'minimal', label: 'بسيط', icon: '⚪' },
    { value: 'dark', label: 'داكن', icon: '⚫' },
  ];

  return (
    <div className="relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-accent)]/5 rounded-full blur-3xl" />
      </div>

      <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-600)] to-[var(--color-primary-700)] p-8 md:p-10">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.1)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.1)_50%,rgba(255,255,255,0.1)_75%,transparent_75%)] bg-[size:20px_20px] opacity-30" />
          
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white mb-4">
                <Sparkles className="w-4 h-4" />
                <span>تقدير فوري ومجاني</span>
              </div>
              <h2 className="text-white text-3xl md:text-4xl mb-2">احسب تكلفة مطبخك</h2>
              <p className="text-white/80 text-lg">خطوات بسيطة للحصول على تقدير دقيق</p>
            </div>
            <div className="hidden md:block w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Calculator className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Progress Steps */}
          <div className="relative z-10 mt-8 flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-2 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step >= s
                        ? 'bg-white text-[var(--color-primary)] shadow-lg scale-110'
                        : 'bg-white/20 text-white/60'
                    }`}
                  >
                    {step > s ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="font-bold">{s}</span>
                    )}
                  </div>
                  <span className="text-xs text-white/80 hidden sm:block">
                    {s === 1 && 'المساحة'}
                    {s === 2 && 'المادة'}
                    {s === 3 && 'النمط'}
                    {s === 4 && 'التقدير'}
                  </span>
                </div>
                {s < 4 && (
                  <div className={`h-0.5 flex-1 mx-2 transition-all duration-300 ${
                    step > s ? 'bg-white' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10">
          {/* Step 1: Area */}
          {step === 1 && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div>
                <label className="block text-2xl mb-2">
                  ما هي مساحة مطبخك؟
                </label>
                <p className="text-gray-600">حدد المساحة بالمتر المربع</p>
              </div>

              <div className="text-center py-8">
                <div className="text-7xl font-bold text-[var(--color-primary)] mb-2">
                  {area}
                </div>
                <div className="text-xl text-gray-600">متر مربع</div>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-gray-200 via-[var(--color-primary)]/30 to-[var(--color-primary)] rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${((area - 5) / 45) * 100}%, #e5e7eb ${((area - 5) / 45) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>5 م²</span>
                  <span>50 م²</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setStep(2)}
                className="mt-8"
              >
                التالي
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Step 2: Material */}
          {step === 2 && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div>
                <label className="block text-2xl mb-2">
                  اختر نوع المادة
                </label>
                <p className="text-gray-600">المادة تحدد الجودة والسعر</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {materials.map((mat) => (
                  <button
                    key={mat.value}
                    onClick={() => setMaterial(mat.value)}
                    className={`relative p-6 rounded-2xl border-2 transition-all duration-300 text-right group hover:scale-105 ${
                      material === mat.value
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-lg'
                        : 'border-gray-200 hover:border-[var(--color-primary)]/50'
                    }`}
                  >
                    <div className="text-4xl mb-3">{mat.icon}</div>
                    <div className="text-xl font-bold mb-1">{mat.label}</div>
                    <div className="text-sm text-gray-600 mb-3">{mat.desc}</div>
                    <div className="text-lg font-bold text-[var(--color-primary)]">{mat.price}</div>
                    
                    {material === mat.value && (
                      <div className="absolute top-3 left-3 w-6 h-6 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  السابق
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setStep(3)}
                  className="flex-1"
                >
                  التالي
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Style */}
          {step === 3 && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div>
                <label className="block text-2xl mb-2">
                  اختر نمط المطبخ
                </label>
                <p className="text-gray-600">النمط الذي يناسب ذوقك</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {styles.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStyle(s.value)}
                    className={`relative p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                      style === s.value
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-lg'
                        : 'border-gray-200 hover:border-[var(--color-primary)]/50'
                    }`}
                  >
                    <div className="text-4xl mb-3">{s.icon}</div>
                    <div className="font-bold">{s.label}</div>
                    
                    {style === s.value && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div>
                <label className="block mb-3">
                  عدد الوحدات والأدراج: <span className="text-[var(--color-primary)] font-bold">{units}</span>
                </label>
                <input
                  type="range"
                  min="4"
                  max="24"
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer accent-[var(--color-primary)]"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${((units - 4) / 20) * 100}%, #e5e7eb ${((units - 4) / 20) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>4 وحدات</span>
                  <span>24 وحدة</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  السابق
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={calculateEstimate}
                  className="flex-1"
                >
                  <Calculator className="w-5 h-5" />
                  احسب التكلفة
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Result */}
          {step === 4 && estimate && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-success)]/10 text-[var(--color-success)] rounded-full mb-6">
                  <Check className="w-5 h-5" />
                  <span>تم حساب التقدير بنجاح!</span>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-accent)]/10 to-[var(--color-primary)]/5 rounded-3xl p-8 md:p-12 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.5)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.5)_50%,rgba(255,255,255,0.5)_75%,transparent_75%)] bg-[size:20px_20px] opacity-20" />
                
                <div className="relative z-10 text-center">
                  <div className="text-sm text-gray-600 mb-2">التقدير الأولي لمطبخك</div>
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-600)] bg-clip-text text-transparent mb-2">
                    {estimate.min.toLocaleString('ar-SA')} - {estimate.max.toLocaleString('ar-SA')}
                  </div>
                  <div className="text-2xl text-gray-700">ريال سعودي</div>
                  
                  <div className="mt-6 p-4 bg-white/60 backdrop-blur-sm rounded-2xl">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">المساحة</div>
                        <div className="font-bold">{area} م²</div>
                      </div>
                      <div>
                        <div className="text-gray-600">المادة</div>
                        <div className="font-bold">{materials.find(m => m.value === material)?.label}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">النمط</div>
                        <div className="font-bold">{styles.find(s => s.value === style)?.label}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">الوحدات</div>
                        <div className="font-bold">{units} وحدة</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-sm text-gray-700 text-center m-0">
                  💡 هذا تقدير تقريبي. للحصول على عرض سعر نهائي دقيق، احجز معاينة منزلية مجانية
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    setStep(1);
                    setEstimate(null);
                  }}
                  className="flex-1"
                >
                  حساب جديد
                </Button>
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => onRequestConsultation?.({ area, material, style, units, estimate })}
                  className="flex-1"
                >
                  <Sparkles className="w-5 h-5" />
                  احجز استشارة مجانية
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
