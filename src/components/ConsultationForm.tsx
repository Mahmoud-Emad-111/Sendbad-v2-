import { useState } from 'react';
import { API_BASE } from '../lib/api';
import { X, Upload, MapPin, Phone, User, Home } from 'lucide-react';
import { Button } from './Button';

interface ConsultationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConsultationForm({ isOpen, onClose }: ConsultationFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    area: '',
    style: 'modern',
    images: [] as File[],
  });
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      setApiError(null);
      const fd = new FormData();
      fd.append('fullName', formData.fullName || '');
      fd.append('phone', formData.phone || '');
      fd.append('address', formData.address || '');
      fd.append('area', formData.area || '');
      fd.append('style', formData.style || '');
      if (formData.images && formData.images.length) {
        formData.images.forEach((f) => fd.append('images[]', f));
      }

      const url = `${API_BASE}/consultations`;
      console.log('[ConsultationForm] submitting to', url);
      const res = await fetch(url, {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) {
        let text = await res.text();
        try {
          const json = JSON.parse(text || '{}');
          text = json.message || JSON.stringify(json);
        } catch (e) {}
        setApiError(`Server returned ${res.status}: ${text}`);
        console.error('[ConsultationForm] submit error', res.status, text);
        return;
      }
      // success
      setStep('success');
    } catch (err: any) {
      console.error('[ConsultationForm] submit exception', err);
      setApiError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 4);
    setFormData({ ...formData, images: files });
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      phone: '',
      address: '',
      area: '',
      style: 'modern',
      images: [],
    });
    setStep('form');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-end md:items-center justify-center consultation-modal" style={{ zIndex: 999999 }}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative modal-dialog w-full max-w-md md:max-w-2xl bg-white rounded-t-lg md:rounded-3xl shadow-2xl animate-[slideInRight_0.3s_cubic-bezier(0.34,1.56,0.64,1)] max-h-[80vh] md:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-600)] px-4 py-4 md:px-6 md:py-6 flex items-center justify-between rounded-t-2xl md:rounded-t-3xl z-10 shadow-lg">
          <div>
            <h3 className="m-0 text-white text-xl md:text-2xl">احصل على استشارة مجانية</h3>
            <p className="text-white/80 text-[0.95rem] md:text-sm m-0 mt-1">نرد عليك خلال 24 ساعة</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 hover:rotate-90"
            aria-label="إغلاق"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block mb-2 text-[var(--color-neutral-dark)]">
                  الاسم الكامل <span className="text-[var(--color-error)]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hidden md:block" />
                  <input
                    type="text"
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full pr-10 pl-3 py-2 md:pr-11 md:pl-4 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block mb-2 text-[var(--color-neutral-dark)]">
                  رقم الموبايل <span className="text-[var(--color-error)]">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hidden md:block" />
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pr-10 pl-3 py-2 md:pr-11 md:pl-4 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                    placeholder="05xxxxxxxx"
                    pattern="[0-9]{10,}"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">مثال: 0501234567</p>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block mb-2 text-[var(--color-neutral-dark)]">
                  عنوان السكن <span className="text-[var(--color-error)]">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hidden md:block" />
                  <input
                    type="text"
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pr-10 pl-3 py-2 md:pr-11 md:pl-4 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                    placeholder="المدينة، الحي"
                  />
                </div>
              </div>

              {/* Kitchen Area */}
              <div>
                <label htmlFor="area" className="block mb-2 text-[var(--color-neutral-dark)]">
                  مساحة المطبخ (متر مربع)
                </label>
                <div className="flex gap-2 mb-3">
                  {['0-5', '6-10', '11-20', '>20'].map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setFormData({ ...formData, area: range })}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm md:text-base transition-all ${
                        formData.area === range
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                          : 'border-gray-300 hover:border-[var(--color-primary)]'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div>
                <label htmlFor="style" className="block mb-2 text-[var(--color-neutral-dark)]">
                  النمط المفضل
                </label>
                <div className="relative">
                  <Home className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hidden md:block" />
                  <select
                    id="style"
                    value={formData.style}
                    onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                    className="w-full pr-10 pl-3 py-2 md:pr-11 md:pl-4 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all appearance-none bg-white"
                  >
                    <option value="modern">عصري (Modern)</option>
                    <option value="classic">كلاسيكي (Classic)</option>
                    <option value="minimal">بسيط (Minimal)</option>
                    <option value="dark">داكن (Dark)</option>
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block mb-2 text-[var(--color-neutral-dark)]">
                  رفع صور المطبخ (اختياري، حتى 4 صور)
                </label>
                <label className="flex flex-col items-center justify-center w-full h-24 md:h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[var(--color-primary)] transition-colors bg-gray-50">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">اضغط لرفع الصور</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {formData.images.length > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    تم رفع {formData.images.length} صورة
                  </p>
                )}
              </div>

              {/* Submit */}
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  fullWidth
                  loading={loading}
                >
                  أرسل الطلب
                </Button>
              </div>

              {apiError && (
                <div className="mt-2 p-3 bg-red-50 text-red-700 rounded text-sm">{apiError}</div>
              )}

              <p className="text-center text-sm text-gray-500">
                بإرسال الطلب، أنت توافق على سياسة الخصوصية
              </p>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-[var(--color-success)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mb-3">شكراً! تم استلام طلبك</h3>
              <p className="text-gray-600 mb-6">
                سيصلك رد خلال 24 ساعة. هل ترغب في حجز معاينة منزلية الآن؟
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="primary" size="md" fullWidth>
                  حجز معاينة
                </Button>
                <Button variant="ghost" size="md" fullWidth onClick={resetForm}>
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}