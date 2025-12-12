import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from './api';

type Settings = Record<string, any>;

const SettingsContext = createContext<Settings>({});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    let mounted = true;
    const fetchSettings = () => {
      apiFetch('settings')
        .then((data) => {
          // API returns envelope { success: true, data: { ... } }
          const s = data?.data ?? data ?? {};
          if (mounted) setSettings(s || {});
        })
        .catch(() => {
          // ignore - keep defaults
        });
    };

    fetchSettings();

    const onUpdated = () => { fetchSettings(); };
    window.addEventListener('settings:updated', onUpdated as EventListener);
    return () => { mounted = false; window.removeEventListener('settings:updated', onUpdated as EventListener); };
  }, []);

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  return useContext(SettingsContext);
}
