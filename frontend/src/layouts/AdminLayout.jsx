import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminLayout.css';


function AdminLayout() {
    const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };
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
                    <div className="admin-user">
            {user && <span className="admin-user-name">{user.name}</span>}

            <button
              className="admin-logout"
              type="button"
              onClick={handleLogout}
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;