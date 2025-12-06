# Sindbad Kitchens - موقع شركة خزائن المطابخ

موقع كامل لشركة Sindbad لتصنيع خزائن المطابخ المخصصة مع لوحة تحكم إدارية شاملة.

## 🚀 المميزات

### الموقع الرئيسي
- ✨ **Hero Section** حديث مع تصميم gradient وanimations
- 🧮 **حاسبة التكلفة** - تقدير فوري للمشاريع
- 🖼️ **معرض الأعمال** - عرض Before/After مع Lightbox
- 💬 **نموذج استشارة مجانية**
- 📱 **WhatsApp Integration**
- ⭐ **آراء العملاء**
- 📍 **معلومات التواصل**

### لوحة التحكم الإدارية
- 📊 **Dashboard** - إحصائيات شاملة
- 👥 **إدارة العملاء المحتملين** (Leads)
- 📁 **إدارة المشاريع**
- 📦 **إدارة الطلبات**
- 📅 **الجدولة** - معاينات وتركيبات
- 💰 **المالية** - المدفوعات والفواتير

### التقنيات
- ⚛️ React 18
- ⚡ Vite
- 🎨 Tailwind CSS 4.0
- 📘 TypeScript
- 🎭 Motion (Framer Motion)
- 📊 Recharts
- 🎯 React Hook Form
- 🔔 Sonner (Toast notifications)

## 📦 التثبيت

```bash
# تثبيت الحزم
npm install

# أو
yarn install

# أو
pnpm install
```

## 🛠️ ا��تطوير

```bash
# تشغيل السيرفر المحلي
npm run dev

# سيفتح على http://localhost:3000
```

## 🏗️ البناء

```bash
# بناء المشروع للإنتاج
npm run build

# معاينة البناء
npm run preview
```

## 📁 هيكل المشروع

```
sindbad-kitchens/
├── src/
│   ├── components/          # مكونات React
│   │   ├── ModernNavbar.tsx
│   │   ├── MobileNav.tsx
│   │   ├── ModernHero.tsx
│   │   ├── ModernEstimator.tsx
│   │   ├── ModernGallery.tsx
│   │   ├── ConsultationForm.tsx
│   │   ├── WhatsAppButton.tsx
│   │   ├── Dashboard.tsx
│   │   └── ...
│   ├── styles/
│   │   └── globals.css      # ملف الأنماط الرئيسي
│   ├── App.tsx              # المكون الرئيسي
│   ├── main.tsx             # نقطة الدخول
│   └── vite-env.d.ts
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 🎨 التصميم

### الألوان
- **Primary**: `#4ba3b3` - اللون الأساسي
- **Accent**: `#e6b86b` - لون التمييز (ذهبي)
- **Dark**: `#0f1724` - اللون الداكن للنصوص

### الخطوط
- **Inter** - للنصوص الإنجليزية
- **Noto Sans Arabic** - للنصوص العربية

## 📱 Responsive Design

الموقع مُحسّن بالكامل لجميع الأحجام:
- 📱 Mobile First Design
- 💻 Tablet Support
- 🖥️ Desktop Optimization
- 🔄 RTL Support كامل للعربية

## 🌟 المميزات التقنية

### Mobile Navigation
- Bottom navigation bar على الموبايل
- Active state detection تلقائي
- Smooth scroll behavior
- Glassmorphism effects

### Hero Section
- Gradient backgrounds مع patterns
- Animated decorative elements
- Statistics cards
- CTA buttons مع تأثيرات

### Cost Estimator
- Multi-step wizard (4 خطوات)
- Interactive sliders
- Real-time calculations
- Beautiful result display

### Gallery
- Grid layout with filters
- Lightbox with navigation
- Before/After toggle
- Smooth animations

## 🔧 التخصيص

### تغيير الألوان
عدّل ملف `src/styles/globals.css`:

```css
:root {
  --color-primary: #4ba3b3;
  --color-accent: #e6b86b;
  /* ... */
}
```

### تغيير رقم WhatsApp
عدّل ملف `src/components/WhatsAppButton.tsx`:

```typescript
const phoneNumber = '966501234567'; // رقمك هنا
```

## 📞 الدعم

للأسئلة والدعم:
- 📧 Email: info@sindbad.com
- 📱 WhatsApp: +966 50 123 4567

## 📄 الترخيص

جميع الحقوق محفوظة © 2024 Sindbad Kitchens

---

Made with ❤️ by Sindbad Team
