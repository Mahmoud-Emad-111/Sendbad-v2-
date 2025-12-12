import React, { useEffect, useState } from 'react';
import { apiFetch, apiFetchAuth } from '../lib/api';
import { Button } from './Button';

export default function CategoriesAdmin() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any | null>(null);
  const [name, setName] = useState('');

  useEffect(() => {
    let mounted = true;
    apiFetch('categories').then(r => r?.data ?? r).then(d => { if (!mounted) return; setList(d || []); }).catch(() => {}).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const start = (c?: any) => {
    if (!c) { setEditing(null); setName(''); return; }
    setEditing(c); setName(c.name || '');
  };

  const save = async () => {
    const payload = { name };
    try {
      if (editing) {
        const res = await apiFetchAuth(`categories/${editing.id}`, undefined, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        setList(list.map(l => l.id === editing.id ? res.data ?? res : l));
      } else {
        const res = await apiFetchAuth('categories', undefined, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const created = res.data ?? res;
        setList([created, ...list]);
      }
      start();
      window.dispatchEvent(new Event('categories:updated'));
    } catch (e) { alert('فشل الحفظ'); }
  };

  const del = async (id: number) => {
    if (!confirm('حذف القسم؟')) return;
    try {
      await apiFetchAuth(`categories/${id}`, undefined, { method: 'DELETE' });
      setList(list.filter(l => l.id !== id));
      window.dispatchEvent(new Event('categories:updated'));
    } catch (e) { alert('فشل الحذف'); }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg">أقسام المنتجات</h3>

      <div className="bg-white p-4 rounded shadow">
        <h4 className="mb-3">إضافة / تعديل قسم</h4>
        <div className="grid grid-cols-1 gap-3">
          <input className="w-full p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} placeholder="اسم القسم" />
          <div className="flex gap-2">
            <Button variant="primary" onClick={save}>{editing ? 'تحديث' : 'إضافة'}</Button>
            <Button variant="ghost" onClick={() => start()}>إفراغ</Button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h4 className="mb-3">قائمة الأقسام</h4>
        {loading ? <div>جارٍ التحميل...</div> : (
          <div className="space-y-2">
            {list.length === 0 && <div className="text-sm text-gray-500">لا توجد أقسام</div>}
            {list.map(c => (
              <div key={c.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>{c.name}</div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => start(c)}>تعديل</Button>
                  <Button variant="destructive" size="sm" onClick={() => del(c.id)}>حذف</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
