import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login, user, isAdmin, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate('/admin/providers', { replace: true });
    }
  }, [authLoading, user, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('من فضلك أدخل البريد الإلكتروني وكلمة المرور');
      return;
    }

    try {
      setSubmitting(true);

      const loggedInUser = await login(email.trim(), password);

      if (loggedInUser.role === 'admin') {
        navigate('/admin/providers', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page" dir="rtl">
      <div className="login-card">
        <h1>تسجيل الدخول</h1>
        <p className="login-subtitle">
          لوحة إدارة دليل أبو زعبل
        </p>

        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">البريد الإلكتروني</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">كلمة المرور</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
              autoComplete="current-password"
            />
          </div>

          <button
            className="login-button"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'جاري تسجيل الدخول...' : 'دخول'}
          </button>
        </form>

        <Link to="/" className="login-back">
          العودة إلى الصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;