import React, { useEffect, useState } from 'react';
import { apiFetchAuth } from '../lib/api';
import { Button } from './Button';

export default function PagesAdmin() {
  const [headers, setHeaders] = useState<any[]>([]);
  const [footers, setFooters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      apiFetchAuth('headers').then(r => r.data),
      apiFetchAuth('footers').then(r => r.data),
    ]).then(([h, f]) => {
      if (!mounted) return;
      setHeaders(h || []);
      setFooters(f || []);
    }).catch(() => {}).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const edit = async (type: 'header'|'footer', item: any) => {
    const title = prompt('Title', item.title || '');
    const content = prompt('Content', item.content || '');
    if (title === null || content === null) return;
    try {
      const path = type === 'header' ? `headers/${item.id}` : `footers/${item.id}`;
      await apiFetchAuth(path, undefined, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, content }) });
      window.location.reload();
    } catch (e) { alert('فشل التحديث'); }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg">محتوى الصفحات</h3>
      {loading ? <div>جارٍ التحميل...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h4 className="mb-2">Headers</h4>
            {headers.length === 0 ? <div className="text-sm text-gray-500">لا يوجد</div> : (
              <ul className="space-y-2">
                {headers.map(h => (
                  <li key={h.id} className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{h.key}</div>
                      <div className="text-sm text-gray-600">{h.title}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => edit('header', h)}>تعديل</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h4 className="mb-2">Footers</h4>
            {footers.length === 0 ? <div className="text-sm text-gray-500">لا يوجد</div> : (
              <ul className="space-y-2">
                {footers.map(f => (
                  <li key={f.id} className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{f.key}</div>
                      <div className="text-sm text-gray-600">{f.title}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => edit('footer', f)}>تعديل</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
