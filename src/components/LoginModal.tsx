import React, { useState } from 'react';
import { Button } from './Button';
import { apiFetch } from '../lib/api';

export function LoginModal({ open, onClose, onLogin }: { open: boolean; onClose: () => void; onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('api_token', data.token);
      onLogin();
      onClose();
    } catch (e) {
      alert('فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded p-6 w-96">
        <h3 className="mb-4">تسجيل دخول الأدمن</h3>
        <input className="w-full p-2 border mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full p-2 border mb-4" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onClose}>إلغاء</Button>
          <Button variant="primary" onClick={submit} loading={loading}>دخول</Button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
