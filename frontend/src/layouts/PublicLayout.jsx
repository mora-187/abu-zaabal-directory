import { Outlet, Link, NavLink } from 'react-router-dom';
import './PublicLayout.css';

function PublicLayout() {
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