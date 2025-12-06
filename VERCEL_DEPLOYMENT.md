# نشر المشروع على Vercel

## خطوات النشر

### 1. طريقة النشر عبر Vercel CLI

#### تثبيت Vercel CLI

```bash
npm install -g vercel
```

#### تسجيل الدخول

```bash
vercel login
```

#### نشر المشروع

```bash
# للنشر التجريبي (Preview)
vercel

# للنشر على الإنتاج (Production)
vercel --prod
```

### 2. طريقة النشر عبر واجهة Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخول باستخدام GitHub/GitLab/Bitbucket أو بريدك الإلكتروني
3. اضغط على "Add New Project"
4. قم باستيراد مستودع Git الخاص بك
5. تأكد من الإعدادات التالية:

   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

6. اضغط على "Deploy"

## التكوين

✅ تم إعداد ملف `vercel.json` بالإعدادات الصحيحة
✅ تم تحديث `package.json` بالـ scripts المطلوبة
✅ تم إنشاء `.vercelignore` لتسريع عملية النشر
✅ تم اختبار البناء بنجاح

## إعدادات البيئة (Environment Variables)

إذا كان لديك متغيرات بيئة (Environment Variables)، أضفها في:

- Dashboard → Project Settings → Environment Variables

مثال:

```
VITE_API_URL=https://api.example.com
VITE_APP_NAME=Sendbad
```

**ملاحظة**: في Vite، يجب أن تبدأ جميع متغيرات البيئة بـ `VITE_`

## معلومات مهمة

- ✅ البناء يعمل بنجاح محلياً
- ✅ حجم البناء: ~234 KB (مضغوط: ~66 KB)
- ✅ مسار الإخراج: `build/`
- ✅ تم تكوين routing للـ SPA بشكل صحيح
- ✅ Node.js version: >= 18.0.0

## استكشاف الأخطاء

### إذا فشل البناء على Vercel:

1. تحقق من أن Node.js version 18 أو أحدث
2. تأكد من تثبيت جميع dependencies بشكل صحيح
3. راجع سجلات البناء (Build Logs) في Vercel Dashboard

### إذا لم يعمل الـ routing:

- ملف `vercel.json` يحتوي على rewrites للتعامل مع SPA routing

## الأوامر المفيدة

```bash
# تشغيل المشروع محلياً
npm run dev

# بناء المشروع
npm run build

# معاينة البناء محلياً
npm run preview
```

## الروابط المفيدة

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Environment Variables in Vite](https://vitejs.dev/guide/env-and-mode.html)
