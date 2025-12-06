# إعداد المشروع - Vite Setup

## 📋 خطوات التحويل لـ Vite

تم تجهيز جميع ملفات الإعداد اللازمة لـ Vite. لإكمال الإعداد:

### 1️⃣ نقل الملفات

انقل جميع الملفات من `/components` إلى `/src/components`:

```bash
# من terminal
mkdir -p src/components/figma src/components/ui
cp -r components/* src/components/
cp -r styles src/
```

أو يدوياً:
- انقل مجلد `components/` بالكامل إلى `src/components/`
- انقل مجلد `styles/` بالكامل إلى `src/styles/`

### 2️⃣ تثبيت المكتبات

```bash
npm install
```

### 3️⃣ تشغيل المشروع

```bash
npm run dev
```

---

## 📁 الهيكل النهائي المطلوب

```
sindbad-kitchens/
├── node_modules/
├── public/
├── src/
│   ├── components/
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx
│   │   ├── ui/
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── textarea.tsx
│   │   ├── Button.tsx
│   │   ├── ConsultationForm.tsx
│   │   ├── Contact.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx
│   │   ├── ModernEstimator.tsx
│   │   ├── ModernGallery.tsx
│   │   ├── ModernHero.tsx
│   │   ├── ModernNavbar.tsx
│   │   ├── Reviews.tsx
│   │   ├── TrustStrip.tsx
│   │   └── WhatsAppButton.tsx
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## ✅ ملفات Vite الجاهزة

تم إنشاء الملفات التالية:

### ⚙️ ملفات الإعداد
- ✅ `package.json` - المكتبات والأوامر
- ✅ `vite.config.ts` - إعدادات Vite
- ✅ `tsconfig.json` - إعدادات TypeScript
- ✅ `tsconfig.node.json` - إعدادات Node
- ✅ `index.html` - نقطة الدخول HTML
- ✅ `.gitignore` - ملفات Git المُستبعدة

### 📄 ملفات المصدر
- ✅ `src/main.tsx` - نقطة دخول React
- ✅ `src/App.tsx` - المكون الرئيسي
- ✅ `src/vite-env.d.ts` - TypeScript definitions

### 📚 التوثيق
- ✅ `README.md` - دليل كامل للمشروع
- ✅ `SETUP.md` - هذا الملف

---

## 🎯 المكتبات المثبتة

### Dependencies
- `react` ^18.3.1
- `react-dom` ^18.3.1
- `lucide-react` ^0.344.0
- `motion` ^10.18.0
- `recharts` ^2.10.3
- `react-hook-form` ^7.55.0
- `sonner` ^2.0.3

### Dev Dependencies
- `@types/react` ^18.3.1
- `@types/react-dom` ^18.3.0
- `@vitejs/plugin-react` ^4.2.1
- `typescript` ^5.3.3
- `vite` ^5.1.4
- `tailwindcss` ^4.0.0
- `@tailwindcss/vite` ^4.0.0
- `autoprefixer` ^10.4.17

---

## 🚀 الأوامر المتاحة

```bash
# التطوير
npm run dev          # تشغيل سيرفر التطوير

# البناء
npm run build        # بناء المشروع للإنتاج
npm run preview      # معاينة البناء

# الجودة
npm run lint         # فحص الكود
```

---

## 🔧 التخصيص

### تغيير المنفذ (Port)
في `vite.config.ts`:
```typescript
server: {
  port: 3000, // غير الرقم هنا
}
```

### إضافة مكتبات جديدة
```bash
npm install package-name
```

---

## ❓ المشاكل الشائعة

### المشكلة: Module not found
**الحل**: تأكد من أن جميع الملفات في `src/components/`

### المشكلة: Tailwind لا يعمل
**الحل**: تأكد من وجود `src/styles/globals.css` وأنه مستورد في `main.tsx`

### المشكلة: TypeScript errors
**الحل**: تأكد من وجود `tsconfig.json` واستخدم `npm run build` للفحص

---

## 📞 الدعم

إذا واجهت أي مشاكل، تحقق من:
1. ✅ جميع الملفات منقولة إلى `src/`
2. ✅ تم تشغيل `npm install`
3. ✅ الملفات في المسارات الصحيحة

---

**جاهز للتشغيل! 🎉**

بمجرد نقل الملفات وتثبيت المكتبات، شغّل:
```bash
npm run dev
```
