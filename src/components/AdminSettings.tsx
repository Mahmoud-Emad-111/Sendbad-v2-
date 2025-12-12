import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { apiFetch, apiFetchAuth } from '../lib/api';
import UploadButton from './UploadButton';
import { Button } from './Button';

export function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(localStorage.getItem('api_token'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [authed, setAuthed] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const addInputRef = useRef<HTMLInputElement | null>(null);

  // derived previews for pending upload files
  const uploadPreviews = useMemo(() => {
    return uploadFiles.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
  }, [uploadFiles]);

  useEffect(() => {
    let mounted = true;
    apiFetch('settings')
      .then((data) => {
        // API may return an envelope { data: { ... } }
        const s = data?.data ?? data ?? {};
        try {
          if (s.hero_images && typeof s.hero_images === 'string') {
            s.hero_images = JSON.parse(s.hero_images);
          }
        } catch (e) {
          // ignore
        }
        if (mounted) setSettings(s);
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    apiFetch('media')
      .then((m) => { if (mounted) setMediaList(m?.data ?? m ?? []); })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    async function check() {
      const t = localStorage.getItem('api_token');
      setToken(t);
      if (!t) {
        setAuthed(false);
        return;
      }
      try {
        const me = await apiFetchAuth('me', t);
        // Accept both envelope { data: user } and raw user object
        const user = me && (me.data ?? me);
        if (user && (user.id || user.email)) setAuthed(true);
        else setAuthed(false);
      } catch (e) {
        setAuthed(false);
      }
    }
    check();
  }, []);

  const handleLogin = async () => {
    setMessage(null);
    try {
      const res = await fetch(`${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api')}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();
      localStorage.setItem('api_token', data.token);
      setToken(data.token);
      setAuthed(true);
      setMessage({ type: 'success', text: 'تم تسجيل الدخول' });
    } catch (e: any) {
      setMessage({ type: 'error', text: e?.message || 'فشل تسجيل الدخول' });
    }
  };

  const handleSave = async () => {
    setMessage(null);
    if (!authed || !token) {
      setMessage({ type: 'error', text: 'تحتاج تسجيل الدخول لحفظ الإعدادات' });
      return;
    }
    setSaving(true);
    try {
      // If new upload files are selected, upload them first and add to hero_images
      let heroImages: string[] = Array.isArray(settings.hero_images) ? [...settings.hero_images] : [];
      if (uploadFiles && uploadFiles.length > 0) {
        try {
          for (const f of uploadFiles) {
            const fd = new FormData();
            fd.append('file', f);
            const uploaded = await apiFetchAuth('media', token, { method: 'POST', body: fd });
            const mediaObj = uploaded?.data ?? uploaded;
            const url = mediaObj?.url ?? (mediaObj?.path ? `/storage/${mediaObj.path}` : null);
            if (url) heroImages.push(url);
          }
          // update local state to reflect uploaded images
          setUploadFiles([]);
          setSettings((s) => ({ ...s, hero_images: heroImages }));
        } catch (e) {
          setMessage({ type: 'error', text: 'فشل رفع أحد الملفات' });
          setSaving(false);
          return;
        }
      }
      const entries: Array<[string, any]> = [
        ['hero_title_line1', settings.hero_title_line1 || ''],
        ['hero_title_line2', settings.hero_title_line2 || ''],
        ['hero_subtitle', settings.hero_subtitle || ''],
        ['hero_images', JSON.stringify(heroImages || settings.hero_images || [])],
      ];
      for (const [key, value] of entries) {
        await apiFetchAuth('settings', token, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        });
      }
      setMessage({ type: 'success', text: 'تم الحفظ' });
      // notify other parts of the app (SettingsProvider) to refresh
      try { window.dispatchEvent(new Event('settings:updated')); } catch (e) { /* ignore */ }
    } catch (e: any) {
      setMessage({ type: 'error', text: 'فشل الحفظ' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>جاري التحميل...</div>;

  // helper to remove image either from existing hero_images or from pending uploads
  const removeExistingImage = (url: string) => {
    const arr = Array.isArray(settings.hero_images) ? [...settings.hero_images] : [];
    setSettings({ ...settings, hero_images: arr.filter((u) => u !== url) });
  };

  const removeUploadFile = (index: number) => {
    setUploadFiles((files) => files.filter((_, i) => i !== index));
  };

  const onAddFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files as any) as File[];
    setUploadFiles((f) => [...f, ...fileArray]);
  };

  const deleteMedia = async (m: any) => {
    if (!authed || !token) {
      setMessage({ type: 'error', text: 'تحتاج تسجيل الدخول لحذف الوسائط' });
      return;
    }
    try {
      await apiFetchAuth(`media/${m.id}`, token, { method: 'DELETE' });
      // remove from mediaList
      setMediaList((list) => list.filter((x) => x.id !== m.id));
      // also remove from hero_images if present
      const url = m.url || (m.path ? `/storage/${m.path}` : null);
      if (url) {
        setSettings((s) => {
          const arr = Array.isArray(s.hero_images) ? [...s.hero_images] : [];
          return { ...s, hero_images: arr.filter((u) => u !== url) };
        });
      }
      setMessage({ type: 'success', text: 'تم حذف الصورة' });
    } catch (e) {
      setMessage({ type: 'error', text: 'فشل حذف الصورة' });
    }
  };

  return (
    <div className="space-y-4">
      {!authed && (
        <div className="p-4 bg-gray-50 rounded">
          <h4 className="mb-2">تسجيل دخول الأدمن</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
            <input className="w-full p-2 border col-span-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="w-full p-2 border" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="flex items-center gap-4">
            <div className="mr-auto">
              <Button variant="primary" onClick={handleLogin} loading={false}>تسجيل الدخول</Button>
            </div>
            {message && message.type === 'error' && <div className="text-red-600">{message.text}</div>}
            {message && message.type === 'success' && <div className="text-green-600">{message.text}</div>}
          </div>
        </div>
      )}

      <div className="p-6 bg-white rounded shadow">
        <h4 className="mb-4 text-lg font-medium">محتوى الصفحة الرئيسية (Hero)</h4>

        {/* Top: text inputs */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block mb-2 font-medium">سطر العنوان 1</label>
            <input className="w-full p-3 border rounded-lg" value={settings.hero_title_line1 || ''} onChange={(e) => setSettings({ ...settings, hero_title_line1: e.target.value })} />
          </div>

          <div>
            <label className="block mb-2 font-medium">سطر العنوان 2</label>
            <input className="w-full p-3 border rounded-lg" value={settings.hero_title_line2 || ''} onChange={(e) => setSettings({ ...settings, hero_title_line2: e.target.value })} />
          </div>

          <div>
            <label className="block mb-2 font-medium">العنوان الفرعي</label>
            <textarea className="w-full p-3 border rounded-lg" rows={3} value={settings.hero_subtitle || ''} onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })} />
          </div>
        </div>

        {/* Images grid */}
        <div>
          <label className="block mb-3 font-medium">صور الهيرو</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {/* media library (click to add/remove) */}
            {mediaList.map((m: any) => {
              const url = m.url || (m.path ? `/storage/${m.path}` : null);
              if (!url) return null;
              const arr = Array.isArray(settings.hero_images) ? settings.hero_images : [];
              const selected = arr.includes(url);
              return (
                <div
                  key={`media-${m.id}`}
                  className={`group relative rounded-lg overflow-hidden shadow-sm border ${selected ? 'ring-4 ring-[var(--color-primary)]' : ''}`}
                >
                    <div className="w-full h-40 flex items-center justify-center bg-gray-50">
                      <img src={url} className="max-h-full max-w-full object-contain" alt={m.filename || m.id} />
                    </div>

                    {/* full-overlay shown on hover with centered delete icon */}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteMedia(m); }}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title="حذف الصورة"
                    >
                      <div className="p-3 rounded-full bg-white/90 shadow-lg transform transition-all hover:scale-105">
                        <Trash2 className="w-6 h-6 text-red-600" />
                      </div>
                    </button>

                    {/* small add/remove overlay in top-right to toggle inclusion in hero */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const cur = Array.isArray(settings.hero_images) ? [...settings.hero_images] : [];
                        let next: string[];
                        if (cur.includes(url)) next = cur.filter((x) => x !== url);
                        else next = [...cur, url];
                        setSettings({ ...settings, hero_images: next });
                      }}
                      title={selected ? 'إزالة من الهيرو' : 'أضف إلى الهيرو'}
                        className="absolute top-2 right-2 bg-white/90 p-1 rounded-full shadow cursor-pointer"
                    >
                      {selected ? <Trash2 className="w-4 h-4 text-red-600" /> : <Plus className="w-4 h-4 text-[var(--color-primary)]" />}
                    </button>

                    {selected && <div className="absolute top-10 right-2 bg-[var(--color-primary)] text-white text-xs px-2 py-1 rounded">محدد</div>}
                </div>
              );
            })}

            {/* existing hero images that are NOT part of mediaList (avoid duplicates) */}
            {(() => {
              const mediaUrls = mediaList.map((m) => m.url || (m.path ? `/storage/${m.path}` : null)).filter(Boolean) as string[];
              const heroOnly = (Array.isArray(settings.hero_images) ? settings.hero_images : []).filter((u: string) => !mediaUrls.includes(u));
              return heroOnly.map((url: string, idx: number) => (
                <div key={`exist-${idx}`} className="group relative rounded-lg overflow-hidden shadow-sm border cursor-default group-hover:cursor-pointer">
                  <div className="w-full h-40 flex items-center justify-center bg-gray-50">
                    <img src={url} alt={`hero-${idx}`} className="max-h-full max-w-full object-contain" />
                  </div>

                  {/* overlay for delete on hover */}
                  <button
                    onClick={(e) => { e.stopPropagation(); removeExistingImage(url); }}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition cursor-pointer"
                    title="حذف من الهيرو"
                  >
                    <div className="p-3 rounded-full bg-white/90 shadow-lg transform transition-all hover:scale-105">
                      <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                  </button>
                </div>
              ));
            })()}

            {/* pending upload previews */}
            {uploadPreviews.map((p, i) => (
              <div key={`up-${i}`} className="group relative rounded-lg overflow-hidden shadow-sm border cursor-default group-hover:cursor-pointer">
                <div className="w-full h-40 flex items-center justify-center bg-gray-50">
                  <img src={p.url} alt={p.file.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="absolute bottom-2 left-2 bg-white/90 text-xs px-2 py-1 rounded">جديد</div>

                <button
                  onClick={(e) => { e.stopPropagation(); removeUploadFile(i); }}
                  title="إزالة"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  <div className="p-3 rounded-full bg-white/90 shadow-lg transform transition-all hover:scale-105">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                </button>
              </div>
            ))}

            {/* add new box */}
            <div
              className="flex items-center justify-center h-40 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 hover:border-primary cursor-pointer"
              onClick={() => addInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="text-sm">أضف صورة جديدة</div>
              </div>
            </div>
          </div>

          {/* hidden file input for add box */}
          <input
            ref={addInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length) onAddFiles(files);
              // reset to allow same file selection again
              e.currentTarget.value = '';
            }}
          />
        </div>

        <div className="flex gap-2 items-center mt-6">
          <div className="mr-auto">
            <Button variant="primary" onClick={handleSave} loading={saving} disabled={!authed}>
              حفظ الإعدادات
            </Button>
          </div>
          {message && <div className={`${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</div>}
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
