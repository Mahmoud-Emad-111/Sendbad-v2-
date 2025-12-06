import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from './Button';

export function Contact() {
  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2>تواصل معنا</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            نحن هنا للإجابة على جميع استفساراتك
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Map */}
          <div className="rounded-[var(--radius-card)] overflow-hidden shadow-[var(--shadow-soft)]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.9481657417145!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsKwNDAnMzEuMSJF!5e0!3m2!1sen!2ssa!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="موقع Sindbad"
            ></iframe>
            <div className="p-4 bg-[var(--color-primary)] text-white">
              <Button
                variant="accent"
                size="sm"
                fullWidth
                onClick={() => window.open('https://maps.google.com', '_blank')}
              >
                <MapPin className="w-4 h-4" />
                احصل على الاتجاهات
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Phone */}
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-[var(--radius-card)] hover:shadow-[var(--shadow-soft)] transition-shadow">
              <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <h4 className="mb-2">الهاتف</h4>
                <a href="tel:+966501234567" className="text-[var(--color-primary)] hover:underline block mb-1">
                  +966 50 123 4567
                </a>
                <a href="tel:+966112345678" className="text-[var(--color-primary)] hover:underline block">
                  +966 11 234 5678
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-[var(--radius-card)] hover:shadow-[var(--shadow-soft)] transition-shadow">
              <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <h4 className="mb-2">البريد الإلكتروني</h4>
                <a href="mailto:info@sindbad.sa" className="text-[var(--color-primary)] hover:underline block mb-1">
                  info@sindbad.sa
                </a>
                <a href="mailto:sales@sindbad.sa" className="text-[var(--color-primary)] hover:underline block">
                  sales@sindbad.sa
                </a>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-[var(--radius-card)] hover:shadow-[var(--shadow-soft)] transition-shadow">
              <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <h4 className="mb-2">العنوان</h4>
                <p className="text-gray-600 m-0">
                  طريق الملك فهد، حي العليا<br />
                  الرياض 12211، المملكة العربية السعودية
                </p>
              </div>
            </div>

            {/* Working Hours */}
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-[var(--radius-card)] hover:shadow-[var(--shadow-soft)] transition-shadow">
              <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-[var(--color-primary)]" />
              </div>
              <div>
                <h4 className="mb-2">ساعات العمل</h4>
                <p className="text-gray-600 m-0">
                  السبت - الخميس: 9:00 ص - 6:00 م<br />
                  الجمعة: مغلق
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="p-6 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 rounded-[var(--radius-card)]">
              <h4 className="mb-4">تابعنا على</h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors shadow-sm"
                  aria-label="فيسبوك"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors shadow-sm"
                  aria-label="إنستغرام"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-colors shadow-sm"
                  aria-label="تويتر"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
