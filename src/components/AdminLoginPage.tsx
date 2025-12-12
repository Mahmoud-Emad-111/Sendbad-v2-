import React, { useState } from 'react';
import { Button } from './Button';

export default function AdminLoginPage({ onSuccess }: { onSuccess?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api')}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Login failed');
      }
      const data = await res.json();
      if (data?.token) {
        localStorage.setItem('api_token', data.token);
      }
      if (onSuccess) onSuccess();
      // navigate to dashboard
      try { window.history.pushState({}, '', '/dashboard'); } catch(e) {}
      window.location.reload();
    } catch (e: any) {
      setError(e?.message || 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="w-full max-w-md bg-white rounded shadow p-6">
        <h2 className="text-xl mb-4">تسجيل دخول الأدمن</h2>
        {error && <div className="mb-3 text-red-600">{error}</div>}
        <label className="block mb-2 text-sm">البريد الإلكتروني</label>
        <input className="w-full p-2 border rounded mb-3" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" />
        <label className="block mb-2 text-sm">كلمة المرور</label>
        <input className="w-full p-2 border rounded mb-4" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => { try { window.history.back(); } catch(e) {} }}>عودة</Button>
          <Button variant="primary" onClick={submit} loading={loading}>دخول</Button>
        </div>
        <div className="mt-4 text-xs text-gray-500">استعمل بيانات الأدمن التي تم إنشاؤها بواسطة seeder أو استخدم التوكن المطبوع في الطرفية.</div>
      </div>
    </div>
  );
}
