import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { lazy, Suspense } from 'react';
import { store } from './store';
import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { useAppSelector } from './store';
import { selectTheme, selectLanguage } from './store/uiSlice';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SkeletonCard } from './components/ui/SkeletonCard';

// Dynamic import with code splitting
const NotesPage = lazy(() => import('./pages/NotesPage').then(m => ({ default: m.NotesPage })));

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppSelector(selectTheme);
  const language = useAppSelector(selectLanguage);
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, i18n]);

  return <>{children}</>;
}

function AppInner() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={
            <AppLayout>
              <Suspense fallback={<div className="p-4"><SkeletonCard /></div>}>
                <NotesPage />
              </Suspense>
            </AppLayout>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AppInner />
      </Provider>
    </ErrorBoundary>
  );
}
