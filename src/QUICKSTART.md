# 🚀 Quick Start Guide - Vite Project

## للبدء السريع (3 خطوات فقط!)

### الطريقة الأولى: Using Script (موصى بها)

#### على Linux/Mac:
```bash
# 1. اجعل الملف قابل للتنفيذ
chmod +x migrate-to-vite.sh

# 2. شغّل السكريبت
./migrate-to-vite.sh

# 3. ثبّت وشغّل
npm install
npm run dev
```

#### على Windows:
```bash
# 1. شغّل السكريبت
migrate-to-vite.bat

# 2. ثبّت وشغّل
npm install
npm run dev
```

---

### الطريقة الثانية: Manual (يدوياً)

```bash
# 1. أنشئ المجلدات
mkdir -p src/components/figma src/components/ui src/styles

# 2. انقل الملفات
cp -r components/* src/components/
cp -r styles/* src/styles/

# 3. ثبّت المكتبات
npm install

# 4. شغّل المشروع
npm run dev
```

---

## ✅ تحقق من النجاح

بعد تشغيل `npm run dev`، يجب أن ترى:

```
  VITE v5.1.4  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

افتح المتصفح على: **http://localhost:3000**

---

## 🎯 ما تم إعداده لك

### ✨ المميزات الجاهزة:
- ⚡ Vite - سريع جداً
- ⚛️ React 18 + TypeScript
- �� Tailwind CSS 4.0
- 📱 Mobile-first Responsive
- 🌍 RTL Support كامل
- 🎭 Animations & Transitions
- 📊 Charts (Recharts)
- 💬 Forms (React Hook Form)
- 🔔 Notifications (Sonner)

### 📦 الصفحات الجاهزة:
1. 🏠 **الصفحة الرئيسية** - Hero + استشارة مجانية
2. 🧮 **حاسبة التكلفة** - تقدير فوري للمشاريع
3. 🖼️ **المعرض** - عرض الأعمال Before/After
4. ⭐ **آراء العملاء** - تقييمات حقيقية
5. 📞 **التواصل** - نموذج + معلومات
6. 💼 **لوحة التحكم** - Dashboard إداري كامل

### 🎨 المكونات الحديثة:
- Bottom Navigation للموبايل
- Modern Hero مع Glassmorphism
- Interactive Calculator
- Lightbox Gallery
- WhatsApp Integration
- Consultation Form
- وأكثر من 15 مكون جاهز!

---

## 🔧 الأوامر الأساسية

```bash
npm run dev      # تطوير (Development)
npm run build    # بناء للإنتاج (Production Build)
npm run preview  # معاينة البناء (Preview Build)
npm run lint     # فحص الكود (Lint)
```

---

## 🎨 التخصيص السريع

### تغيير الألوان:
افتح `src/styles/globals.css`:
```css
:root {
  --color-primary: #4ba3b3;    /* اللون الأساسي */
  --color-accent: #e6b86b;     /* لون التمييز */
}
```

### تغيير رقم WhatsApp:
افتح `src/components/WhatsAppButton.tsx`:
```typescript
const phoneNumber = '966501234567'; // ضع رقمك هنا
```

### إضافة صور خاصة:
ضع الصور في مجلد `public/` واستخدمها:
```tsx
<img src="/your-image.jpg" alt="..." />
```

---

## 📱 للتطوير على الموبايل

```bash
# افتح على جميع الأجهزة في الشبكة
npm run dev -- --host
```

ثم افتح عنوان Network IP من هاتفك

---

## 🆘 مشاكل شائعة وحلولها

### ❌ `Cannot find module './components/...`
**الحل:** تأكد من نقل المكونات إلى `src/components/`

### ❌ `Tailwind classes not working`
**الحل:** تأكد من استيراد `src/styles/globals.css` في `main.tsx`

### ❌ `Port 3000 already in use`
**الحل:** غيّر البورت في `vite.config.ts`:
```typescript
server: { port: 3001 }
```

---

## 🎓 مصادر مفيدة

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🎉 كل شيء جاهز!

المشروع جاهز 100% للتطوير. فقط:

```bash
npm install && npm run dev
```

**استمتع بالبرمجة! 💻✨**
