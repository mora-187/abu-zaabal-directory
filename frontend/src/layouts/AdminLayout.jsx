import { NavLink, Outlet } from 'react-router-dom';
import './AdminLayout.css';

function AdminLayout() {
  return (
    <div className="admin-layout" dir="rtl">
      <header className="admin-header">
        <div className="admin-header-content">
          <h2>لوحة إدارة دليل أبو زعبل</h2>

          <nav className="admin-nav">
            <NavLink
              to="/admin/providers"
              className={({ isActive }) =>
                isActive ? 'admin-nav-link active' : 'admin-nav-link'
              }
            >
              مقدمو الخدمات
            </NavLink>

            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                isActive ? 'admin-nav-link active' : 'admin-nav-link'
              }
            >
              التصنيفات
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;