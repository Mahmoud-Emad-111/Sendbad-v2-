import React, { useEffect, useState } from 'react';
import { apiFetchAuth } from '../lib/api';

export default function StatsChart() {
  const [series, setSeries] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    // default last 6 months
    apiFetchAuth('stats?start=&end=').then(r => r.data).then((data) => {
      if (!mounted) return;
      setSeries(data);
    }).catch(() => {}).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) return <div>جارٍ التحميل...</div>;
  if (!series) return <div>لا بيانات</div>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h4 className="mb-4">الرسوم البيانية (آخر أشهر)</h4>
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="p-2">شهر</th>
              {series.labels.map((l: string, i: number) => <th key={i} className="p-2">{l}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 font-medium">عملاء</td>
              {series.clients.map((v: number, i: number) => <td key={i} className="p-2">{v}</td>)}
            </tr>
            <tr>
              <td className="p-2 font-medium">صور</td>
              {series.media.map((v: number, i: number) => <td key={i} className="p-2">{v}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
