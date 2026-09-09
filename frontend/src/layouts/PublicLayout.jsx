import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import './PublicLayout.css';

function PublicLayout() {
const [theme, setTheme] = useState(() => {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    return savedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
});

useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}, [theme]);

const toggleTheme = () => {
  setTheme((currentTheme) =>
    currentTheme === 'dark' ? 'light' : 'dark'
  );
};
  return (
    <div className="public-layout">
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="site-logo">
            دليل أبو زعبل
          </Link>

          <nav className="site-nav">
            <NavLink to="/" end>
              الرئيسية
            </NavLink>
            <NavLink to="/search">
              البحث
            </NavLink>
            <NavLink to="/providers">
              مقدمو الخدمات
            </NavLink>
          </nav>
          <button
  type="button"
  className="theme-toggle"
  onClick={toggleTheme}
  aria-label={
    theme === 'dark'
      ? 'التبديل إلى الوضع الفاتح'
      : 'التبديل إلى الوضع الداكن'
  }
>
  {theme === 'dark' ? '☀️' : '🌙'}
</button>
        </div>
      </header>

      <Outlet />

      <footer className="site-footer">
        دليل خدمات أبو زعبل
      </footer>
    </div>
  );
}

export default PublicLayout;