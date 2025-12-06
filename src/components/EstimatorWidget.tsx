import { useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';
import { Button } from './Button';

interface EstimatorWidgetProps {
  onRequestConsultation?: (data: any) => void;
}

export function EstimatorWidget({ onRequestConsultation }: EstimatorWidgetProps) {
  const [area, setArea] = useState(10);
  const [material, setMaterial] = useState('mdf');
  const [units, setUnits] = useState(8);
  const [estimate, setEstimate] = useState<{ min: number; max: number } | null>(null);

  const calculateEstimate = () => {
    // Mock calculation - في التطبيق الحقيقي، هذا سيكون API call
    const basePricePerMeter = material === 'mdf' ? 1500 : material === 'wood' ? 2500 : 3500;
    const unitPrice = 800;
    
    const min = Math.floor((area * basePricePerMeter + units * unitPrice) * 0.9);
    const max = Math.ceil((area * basePricePerMeter + units * unitPrice) * 1.1);
    
    setEstimate({ min, max });
  };

  const handleRequestConsultation = () => {
    if (onRequestConsultation) {
      onRequestConsultation({ area, material, units, estimate });
    }
  };

  return (
    <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center">
          <Calculator className="w-6 h-6 text-[var(--color-primary)]" />
        </div>
        <div>
          <h3 className="m-0">احسب تكلفة مطبخك</h3>
          <p className="text-sm text-gray-600 m-0">تقدير أولي فوري</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Area Slider */}
        <div>
          <label className="block mb-3">
            <span className="">مساحة المطبخ</span>
            <span className="text-[var(--color-primary)] mr-2">{area} متر مربع</span>
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>5 م²</span>
            <span>50 م²</span>
          </div>
        </div>

        {/* Material Selection */}
        <div>
          <label className="block mb-3">نوع المادة</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'mdf', label: 'MDF', price: 'اقتصادي' },
              { value: 'wood', label: 'خشب', price: 'متوسط' },
              { value: 'premium', label: 'بريميوم', price: 'فاخر' },
            ].map((mat) => (
              <button
                key={mat.value}
                type="button"
                onClick={() => setMaterial(mat.value)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  material === mat.value
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                    : 'border-gray-300 hover:border-[var(--color-primary)]'
                }`}
              >
                <div className="">{mat.label}</div>
                <div className="text-xs text-gray-600">{mat.price}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Units Slider */}
        <div>
          <label className="block mb-3">
            <span className="">عدد الوحدات/الأدراج</span>
            <span className="text-[var(--color-primary)] mr-2">{units} وحدة</span>
          </label>
          <input
            type="range"
            min="4"
            max="24"
            value={units}
            onChange={(e) => setUnits(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>4</span>
            <span>24</span>
          </div>
        </div>

        {/* Calculate Button */}
        <Button
          variant="primary"
          size="md"
          fullWidth
          onClick={calculateEstimate}
        >
          <Calculator className="w-5 h-5" />
          احسب التكلفة
        </Button>

        {/* Estimate Result */}
        {estimate && (
          <div className="bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 rounded-xl p-5 animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-[var(--color-primary)]" />
              <span className="">التقدير الأولي</span>
            </div>
            <div className="text-center">
              <div className="text-3xl text-[var(--color-primary)] mb-1">
                {estimate.min.toLocaleString('ar-SA')} - {estimate.max.toLocaleString('ar-SA')} ريال
              </div>
              <p className="text-sm text-gray-600 m-0">
                * التسعير النهائي يتم بعد المعاينة المنزلية
              </p>
            </div>
            <Button
              variant="accent"
              size="md"
              fullWidth
              onClick={handleRequestConsultation}
              className="mt-4"
            >
              اطلب استشارة مجانية
            </Button>
          </div>
        )}
      </div>

      <p className="text-xs text-center text-gray-500 mt-4 m-0">
        هذا تقدير تقريبي. للحصول على عرض سعر دقيق، يرجى حجز معاينة منزلية مجانية.
      </p>
    </div>
  );
}
