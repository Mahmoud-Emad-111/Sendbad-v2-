import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Calendar, 
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Phone,
  Mail,
  CheckCircle2,
  Star,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Messages,
  Download,
  MessageCircleX
} from 'lucide-react';

import PagesAdmin from './PagesAdmin';
import AdminSettingsComp from './AdminSettings';
import ReviewsAdmin from './ReviewsAdmin';
import CategoriesAdmin from './CategoriesAdmin';
import ProductsAdmin from './ProductsAdmin';
import ConsultationsAdmin from './ConsultationsAdmin';
import StatsChart from './StatsChart';
import { Button } from './Button';
import { apiFetch, apiFetchAuth } from '../lib/api';
import ClientsAdmin from './ClientsAdmin';
import GalleryAdmin from './GalleryAdmin';
import LoginModal from './LoginModal';

interface DashboardProps {
  onBackToSite: () => void;
}

type ViewType = 'overview' | 'leads' | 'projects' | 'settings' | 'pages' | 'reviews' | 'stats' | 'home' | 'categories' | 'products';

export function Dashboard({ onBackToSite }: DashboardProps) {
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('api_token');
    if (!token) {
      setUserName(null);
      setAuthChecked(true);
      return;
    }
    apiFetchAuth('me', token)
      .then((data) => setUserName(data.name || 'Admin'))
      .catch(() => setUserName(null))
      .finally(() => setAuthChecked(true));
  }, []);

  // Sidebar trimmed per request: removed pages, stats, clients, and gallery
  const menuItems = [
    { id: 'overview' as ViewType, label: 'نظرة عامة', icon: LayoutDashboard },
    { id: 'home' as ViewType, label: 'الرئيسه', icon: LayoutDashboard },
    { id: 'reviews' as ViewType, label: 'اراء العملاء', icon: CheckCircle2 },
    { id: 'categories' as ViewType, label: 'اقسام المنتجات', icon: Package },
    { id: 'products' as ViewType, label: 'المنتجات', icon: Package },
    { id: 'settings' as ViewType, label: 'الإعدادات', icon: Settings },
    { id: 'consultations' as ViewType, label: 'الاستشارات', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] flex" dir="rtl">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 right-0 h-screen w-64 bg-[var(--color-neutral-dark)] text-white z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">S</span>
            </div>
            <div>
              <div className="">Sindbad</div>
              <div className="text-xs text-gray-400">لوحة التحكم</div>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={onBackToSite}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>العودة للموقع</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <h2 className="m-0">
              {menuItems.find(item => item.id === currentView)?.label}
            </h2>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                {userName ? (
                  <>
                    <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white">{(userName || 'A')[0]}</div>
                    <span>{userName}</span>
                    <button className="text-sm text-red-500 ml-2" onClick={() => { localStorage.removeItem('api_token'); setUserName(null); }}>خروج</button>
                  </>
                ) : (
                  <button className="px-3 py-1 bg-[var(--color-primary)] text-white rounded" onClick={() => setLoginOpen(true)}>تسجيل دخول</button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {!authChecked ? (
            <div className="p-6">جارٍ التحقق...</div>
          ) : !userName ? (
            <div className="p-6">
              <div className="max-w-md mx-auto text-center bg-white rounded shadow p-8">
                <h3 className="mb-4">تحتاج لتسجيل الدخول لعرض لوحة التحكم</h3>
                <p className="text-sm text-gray-600 mb-4">استخدم بيانات المسخدم الإداري التي تم إنشاؤها بواسطة seeder.</p>
                <div className="flex justify-center gap-2">
                  <Button onClick={() => setLoginOpen(true)}>تسجيل دخول</Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {currentView === 'home' && <AdminSettingsComp />}
              {currentView === 'overview' && <OverviewView />}
              {currentView === 'leads' && <ClientsAdmin />}
              {currentView === 'projects' && <GalleryAdmin />}
              {currentView === 'reviews' && <ReviewsAdmin />}
              {currentView === 'categories' && <CategoriesAdmin />}
              {currentView === 'products' && <ProductsAdmin />}
              {currentView === 'pages' && <PagesAdmin />}
              {currentView === 'consultations' && <ConsultationsAdmin />}
              {currentView === 'stats' && <StatsChart />}
              {currentView === 'orders' && <OrdersView />}
              {currentView === 'calendar' && <CalendarView />}
              {currentView === 'finance' && <FinanceView />}
              {currentView === 'settings' && <SettingsView />}
            </>
          )}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={() => {
          const token = localStorage.getItem('api_token');
          if (token) {
            apiFetchAuth('me', token)
              .then(data => setUserName(data.name || 'Admin'))
              .catch(() => setUserName(null));
          }
          setLoginOpen(false);
        }}
      />
    </div>
  );
}

// Overview View
function OverviewView() {
  const [data, setData] = useState<{clients_count?: number, media_count?: number, admins_count?: number, users_count?: number}>({});
  const [loading, setLoading] = useState(true);
  const [recentClients, setRecentClients] = useState<any[]>([]);
  const [recentMedia, setRecentMedia] = useState<any[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [recentConsultations, setRecentConsultations] = useState<any[]>([]);
  const [extraCounts, setExtraCounts] = useState<{consultations?: number, categories?: number, products?: number, reviews?: number}>({});

  useEffect(() => {
    let mounted = true;
    apiFetch('stats')
      .then((res) => {
        if (mounted) setData(res.data || {});
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    // fetch recent lists (clients, media, consultations) and counts for extra stat cards
    (async () => {
      try {
        const [clientsRes, mediaRes, categoriesRes, productsRes, reviewsRes, consultationsRes] = await Promise.all([
          apiFetch('clients').catch(() => []),
          apiFetch('media').catch(() => []),
          apiFetch('categories').catch(() => []),
          apiFetch('products').catch(() => []),
          apiFetch('reviews').catch(() => []),
          apiFetchAuth('consultations').catch(() => null),
        ]);

        if (!mounted) return;

        const clientsArr = Array.isArray(clientsRes) ? clientsRes : (clientsRes?.data || []);
        const mediaArr = Array.isArray(mediaRes) ? mediaRes : (mediaRes?.data || []);
        const categoriesArr = Array.isArray(categoriesRes) ? categoriesRes : (categoriesRes?.data || []);
        const productsArr = Array.isArray(productsRes) ? productsRes : (productsRes?.data || []);

        setRecentClients(clientsArr.slice(0, 6));
        setRecentMedia(mediaArr.slice(0, 6));

        // consultationsRes may be wrapped: { data: { total, data: [...] } }
        let consultationsArr: any[] = [];
        let consultationsTotal = 0;
        if (consultationsRes) {
          const payload = consultationsRes.data ?? consultationsRes;
          if (Array.isArray(payload)) {
            consultationsArr = payload;
            consultationsTotal = payload.length;
          } else if (payload?.data && Array.isArray(payload.data)) {
            consultationsArr = payload.data;
            consultationsTotal = payload.total ?? consultationsArr.length;
          }
        }
        setRecentConsultations(consultationsArr.slice(0, 6));

        const reviewsArr = Array.isArray(reviewsRes) ? reviewsRes : (reviewsRes?.data || []);

        setExtraCounts({
          consultations: consultationsTotal,
          categories: Array.isArray(categoriesArr) ? categoriesArr.length : (categoriesArr?.length ?? 0),
          products: Array.isArray(productsArr) ? productsArr.length : (productsArr?.length ?? 0),
          reviews: Array.isArray(reviewsArr) ? reviewsArr.length : (reviewsArr?.length ?? 0),
        });
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoadingLists(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

    const stats = [
    { label: 'الاقسام', value: loading ? '—' :  (extraCounts.categories ?? 0), change: '+5%', icon: Package, color: 'bg-green-500' },
    { label: 'المنتجات', value: loading ? '—' : (extraCounts.products ?? 0), change: '+18%', icon: DollarSign, color: 'bg-purple-500' },
    // { label: 'التقييمات', value: loadingLists ? '—' : (extraCounts.reviews ?? 0), change: '', icon: Users, color: 'bg-amber-500' },
    { label: 'الاستشارات', value: loadingLists ? '—' : (extraCounts.consultations ?? 0), change: '',  icon: Users, color: 'bg-blue-500' },
    { label: 'التقييمات', value: loadingLists ? '—' : (extraCounts.reviews ?? 0), change: '',  icon: Users, color: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {stat.change && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </span>
                )}
              </div>
              <div className="text-3xl mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] p-6">
          <h3>أحدث العملاء المحتملين</h3>
          <div className="space-y-4">
            {loadingLists ? (
              <div className="text-sm text-gray-500">جارٍ التحميل...</div>
            ) : (recentClients.length === 0 && recentConsultations.length === 0) ? (
              <div className="text-sm text-gray-500">لا يوجد عملاء أو طلبات استشارية حتى الآن.</div>
            ) : (
              // merge recent clients and consultations by date
              [...recentClients.map(c => ({...c, _type: 'client'})), ...recentConsultations.map(c => ({...c, _type: 'consultation'}))]
                .sort((a,b) => (new Date(b.created_at || b.createdAt || Date.now()).getTime()) - (new Date(a.created_at || a.createdAt || Date.now()).getTime()))
                .slice(0,6)
                .map((lead, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    <div>
                      <div className="">{lead.name || lead.full_name || lead.fullName || '—'}</div>
                      <div className="text-sm text-gray-600">{lead.phone || lead.phone_number || '—'} • {lead._type === 'consultation' ? 'طلب استشارة' : (lead.source || lead.source_type || '—')}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{new Date(lead.created_at || lead.createdAt || Date.now()).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] p-6">
          <h3>المشاريع / آخر الوسائط</h3>
          <div className="space-y-4">
            {loadingLists ? (
              <div className="text-sm text-gray-500">جارٍ التحميل...</div>
            ) : recentMedia.length === 0 ? (
              <div className="text-sm text-gray-500">لا توجد وسائط حتى الآن.</div>
            ) : (
              recentMedia.map((m, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <img src={m.url || m.path || ''} alt={m.filename || 'media'} className="w-16 h-12 object-cover rounded" />
                      <div>
                        <div className="font-medium">{m.filename || `وسيط ${m.id || i + 1}`}</div>
                        <div className="text-sm text-gray-600">{m.mime || ''}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">{new Date(m.created_at || m.createdAt || Date.now()).toLocaleDateString()}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Leads View
function LeadsView() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const leads = [
    { id: 1, name: 'أحمد محمد السالم', phone: '0501234567', source: 'موقع الويب', status: 'جديد', area: '15 م²', style: 'عصري', created: '2025-12-05' },
    { id: 2, name: 'فاطمة علي العتيبي', phone: '0509876543', source: 'واتساب', status: 'تم الاتصال', area: '18 م²', style: 'كلاسيكي', created: '2025-12-04' },
    { id: 3, name: 'محمد سعيد الغامدي', phone: '0551234567', source: 'اتصال مباشر', status: 'معاينة مجدولة', area: '12 م²', style: 'بسيط', created: '2025-12-03' },
    { id: 4, name: 'نورة أحمد الشهري', phone: '0541234567', source: 'موقع الويب', status: 'قيد التصميم', area: '20 م²', style: 'داكن', created: '2025-12-02' },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'جديد': 'bg-blue-100 text-blue-800',
      'تم الاتصال': 'bg-yellow-100 text-yellow-800',
      'معاينة مجدولة': 'bg-purple-100 text-purple-800',
      'قيد التصميم': 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن عميل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-11 pl-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm">
            <Filter className="w-5 h-5" />
            تصفية
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="w-5 h-5" />
            عميل جديد
          </Button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-right text-sm text-gray-600">#</th>
                <th className="px-6 py-4 text-right text-sm text-gray-600">الاسم</th>
                <th className="px-6 py-4 text-right text-sm text-gray-600">الهاتف</th>
                <th className="px-6 py-4 text-right text-sm text-gray-600">المصدر</th>
                <th className="px-6 py-4 text-right text-sm text-gray-600">المساحة</th>
                <th className="px-6 py-4 text-right text-sm text-gray-600">النمط</th>
                <th className="px-6 py-4 text-right text-sm text-gray-600">الحالة</th>
                <th className="px-6 py-4 text-right text-sm text-gray-600">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{lead.id}</td>
                  <td className="px-6 py-4">
                    <div className="">{lead.name}</div>
                    <div className="text-xs text-gray-500">{lead.created}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <a href={`tel:${lead.phone}`} className="text-[var(--color-primary)] hover:underline flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {lead.phone}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm">{lead.source}</td>
                  <td className="px-6 py-4 text-sm">{lead.area}</td>
                  <td className="px-6 py-4 text-sm">{lead.style}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="عرض">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="تعديل">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="حذف">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Placeholder views
function ProjectsView() {
  return (
    <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] p-12 text-center">
      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3>المشاريع</h3>
      <p className="text-gray-600">عرض وإدارة جميع المشاريع النشطة</p>
    </div>
  );
}

function OrdersView() {
  return (
    <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] p-12 text-center">
      <CheckCircle2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3>الطلبات</h3>
      <p className="text-gray-600">تتبع حالة جميع الطلبات</p>
    </div>
  );
}

function CalendarView() {
  return (
    <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] p-12 text-center">
      <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3>الجدول الزمني</h3>
      <p className="text-gray-600">جدولة المعاينات والتركيبات</p>
    </div>
  );
}

function FinanceView() {
  return (
    <div className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-soft)] p-12 text-center">
      <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3>المالية</h3>
      <p className="text-gray-600">الفواتير والمدفوعات والتقارير</p>
    </div>
  );
}

import AdminSettings from './AdminSettings';

function SettingsView() {
  return (
    <div>
      <AdminSettings />
    </div>
  );
}
